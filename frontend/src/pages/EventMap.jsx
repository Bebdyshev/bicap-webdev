import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import WeatherWidget from '../components/weather';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'; // Для работы с датами
import { ru } from 'date-fns/locale';
import axiosInstance from '../axios/instanse';
import MarkerPopup from './MarkerPopup';
import './EventMap.css';

const bounds = [
  [0, 0], // Верхний левый угол
  [1500, 1500], // Нижний правый угол (размер карты в пикселях)
];

const createPulsingIcon = () => {
  return L.divIcon({
    className: 'pulsing-icon',
    html: `<div class="pulse-container">
             <div class="pulse"></div>
             <div class="outer-pulse"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const styles = `
  .pulsing-icon {
    position: relative;
    width: 32px;
    height: 32px;
  }

  .pulse-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .pulse {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #ffc446;
    animation: pulse 1.5s infinite;
    position: absolute;
    top: 0;
    left: 0;
  }

  .outer-pulse {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #ffc446;
    animation: outerPulse 2s infinite;
    position: absolute;
    top: -16px;
    left: -16px;
    opacity: 0;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes outerPulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.4;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
  .leaflet-control {
    display: none;
  }
`;

function FitToBounds() {
  const map = useMap();
  React.useEffect(() => {
    map.fitBounds(bounds);
  }, [map]);
  return null;
}

function generateRandomPosition() {
  const lat = 750 - ( 0.5 - Math.random()) * 350;
  const lng = 750  - ( 0.5 - Math.random()) * 350;
  return [lat, lng];
}

function EventMap() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [markers, setMarkers] = useState([]);

  const fetchEventsByDate = async (date) => {
    try {
      const formattedDate = format(date, 'dd.MM.yyyy');
      const response = await axiosInstance.post('/event-by-time', { date: formattedDate });
      // Добавляем случайные координаты для каждого маркера
      const updatedMarkers = response.data.events.map((event, index) => ({
        ...event, // Spread the event properties
        id: index, // Add or update the id property
        position: generateRandomPosition(),
      }));      
      setMarkers(updatedMarkers);
    } catch (error) {
      console.error('Ошибка при загрузке событий:', error);
    }
  };

  useEffect(() => {
    fetchEventsByDate(selectedDate); // Загружаем события при изменении даты
  }, [selectedDate]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  return (
    <div style={{ height: '91.5vh', width: '100%' }}>
      <style>{styles}</style>
      <WeatherWidget />
      <a className="create-button" href='/create'>
          Создать событие
      </a>
      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          overflowX: 'hidden',
          maxWidth: '90%',
          marginTop: '20px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Декабрь:
        {daysInMonth.map((date) => {
          const dayOfWeek = format(date, 'EEE', { locale: ru });
          const isWeekend = dayOfWeek === 'суб' || dayOfWeek === 'вск';

          return (
            <div
              key={date}
              onClick={() => handleDateClick(date)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderRadius: '4px',
                backgroundColor:
                  selectedDate.getDate() === date.getDate() ? '#ffc446' : 'transparent',
                color: isWeekend ? 'red' : selectedDate.getDate() === date.getDate() ? 'white' : 'black',
                transition: 'background-color 0.3s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{dayOfWeek}</span>
              <span>{format(date, 'd')}</span>
            </div>
          );
        })}
      </div>

      <MapContainer
        center={[500, 500]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        crs={L.CRS.Simple}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
      >
        <ImageOverlay url="https://events.sxodim.com/maps/aktobe.svg" bounds={bounds} />
        <FitToBounds />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={createPulsingIcon()}
            eventHandlers={{
              click: () => setSelectedMarker(marker),
            }}
          >
          </Marker>
        ))}
      </MapContainer>
      {selectedMarker && <MarkerPopup event={selectedMarker} onClose={() => setSelectedMarker(null)} />}
    </div>
  );
}

export default EventMap;

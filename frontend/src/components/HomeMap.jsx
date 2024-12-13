import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './HomeMap.css';

const HomeMap = (props) => {
  const [coordinates, setCoordinates] = useState([]);
  const data = Object.values(props.data).flat();

  // Используем useRef для хранения предыдущих данных
  const prevDataRef = useRef();

  // Функция получения координат с Google API
  const getCoordinatesGoogle = async (address) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: 'AIzaSyD3gzo6yiL6osEkR-GDDA3DjA9D7qKqI4o', // Замените на действительный API ключ
        },
      });
  
      if (response.data.results && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        console.error('Адрес не найден.');
        return null;
      }
    } catch (error) {
      console.error('Ошибка при получении координат:', error);
      return null;
    }
  };

  // Функция для получения координат для всех событий
  const fetchCoordinates = async () => {
    const newCoordinates = await Promise.all(
      data.map(async (event) => {
        const location = `${event.location} Aktobe, Kazakhstan`;
        const coordinates = await getCoordinatesGoogle(location);
        return coordinates ? { ...event, coordinates } : null;
      })
    );
    setCoordinates(newCoordinates.filter(Boolean)); // Сохраняем только те события, у которых есть координаты
  };

  // Используем useEffect, чтобы обновить координаты только при изменении данных
  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(data)) {
      // Если данные изменились, обновляем координаты
      fetchCoordinates();
      prevDataRef.current = data; // Обновляем ссылку на предыдущие данные
    }
  }, [data]); // Хук срабатывает только если данные изменяются

  return (
    <div className="map-container">
      <MapContainer
        center={coordinates.length > 0 ? coordinates[0].coordinates : [50.283451, 57.166785]} // Устанавливаем центр карты на координаты первого события
        zoom={14}
        maxZoom={15}
        minZoom={10}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {coordinates.map((event, index) => (
          <Marker
            key={index}
            position={event.coordinates}
            icon={
              new L.Icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Замените на URL вашего иконки маркера
                iconSize: [25, 31],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
              })
            }
          >
            <Popup>
              <h3>{event.name}</h3>
              <p>{event.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default HomeMap;

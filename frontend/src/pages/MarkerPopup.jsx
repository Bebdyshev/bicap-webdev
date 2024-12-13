import React from 'react';

const MarkerPopup = ({ event, onClose }) => {
  console.log(event);

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.6)', // Slightly transparent black background
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 1)', // Light white background for the content box
          borderRadius: '8px',
          padding: '20px',
          width: '500px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        }}
      >
        {event.url && (
          <img
            src={event.url}
            alt={event.name}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
            }}
          />
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            {event.name}
          </h3>
        </div>

        <p
          style={{
            color: '#555',
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '10px',
          }}
        >
          {event.description}
        </p>

        <div
          style={{
            marginBottom: '10px',
            color: '#555',
            fontSize: '14px',
          }}
        >
          <strong>Дата:</strong> {event.date} <br />
        </div>
        <div
          style={{
            marginBottom: '10px',
            color: '#555',
            fontSize: '14px',
          }}
        >
          <strong>Локация:</strong> {event.location}
        </div>
        <div
          style={{
            marginBottom: '10px',
            color: '#555',
            fontSize: '14px',
          }}
        >
          <strong>Стоимость:</strong> {event.price === 0 ? 'Бесплатно' : `${event.price} ₸`}
        </div>

        {/* Back button */}
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#e1a523',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: '10px',
            marginLeft: '85%'
          }}
        >
          Назад
        </button>
      </div>
    </div>
  );
};

export default MarkerPopup;

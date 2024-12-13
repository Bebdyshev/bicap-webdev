import React from 'react';
import './EventCard.css'; // Стили для карточки события

const EventCard = ({ event }) => (
  <div className="event-card">
    <img 
      src={event.url} 
      alt={event.title} 
      className="event-card-image"
    />
    <h4 className="event-card-title">{event.name}</h4>
    <p className="event-card-description">{event.description}</p>
    <div className="event-card-details">
      <p className="event-card-price">Цена: {event.price === 0 ? 'Бесплатно' : `${event.price} ₸`}</p>
      <p className="event-card-date">{new Date(event.date).toLocaleDateString()}</p>
      <p className="event-card-location">{event.location}</p>
    </div>
  </div>
);

export { EventCard };

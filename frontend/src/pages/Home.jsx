import React, { useEffect, useState } from 'react';
import SearchComponent from '../components/SearchComponent';
import axiosInstance from '../axios/instanse';
import './Home.css';
import TrendingCarousel from '../components/Carousel';
import Dialog from '../components/Dialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookCatalog from '../components/BookCatalog';
import { EventCard } from './EventCard';  // Импортируем компонент для карточки события
import HomeMap from '../components/HomeMap';

function Home() {
  const [trending, setTrending] = useState([]);
  const [liked, setLiked] = useState([]);
  const [viewed, setViewed] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [events, setEvents] = useState({}); // Состояние для ивентов, теперь объект
  const [selectedCategory, setSelectedCategory] = useState(''); // Состояние для выбранной категории

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get("/events"); // Запрос к /events
        if (response.data && typeof response.data === 'object') {
          setEvents(response.data); // Сохраняем данные ивентов
        } else {
          console.error("Expected events to be an object, but received:", response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Обновляем выбранную категорию
  };

  const handleMoreClick = (description) => {
    setSelectedDescription(description);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDescription('');
  };

  const like = async (bookId) => {
    try {
      await axiosInstance.post(`/books/like?bookId=${bookId}`);
      toast("Successfully liked");
    } catch (err) {
      console.error(err);
    }
  };

  // Если фильтр не выбран, показываем все ивенты по категориям
  const filteredEvents = selectedCategory
    ? { [selectedCategory]: events[selectedCategory] } // Если категория выбрана, фильтруем по ней
    : events; // Если категория не выбрана, показываем все категории

  return (
    <div className="home-container">
      <HomeMap data={events}/>
      <div className="search-container">
        <div className="search-bar">
          <SearchComponent 
            setSearchResults={setSearchResults} // Передаем функцию обновления состояния
          />
          <select
            className="filter-select"
            title="Применить фильтр"
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            {/* фильтр по категориям */}
            <option value="">Все</option>
            {Object.keys(events).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {searchResults.length > 0&& (
        <div className="search-results-container">
          <h3 className="category-title">Результаты поиска:</h3>
          <div style={{display: 'flex', gap: '15px'}}>
            {searchResults.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      <div className="events-container">
        {Object.entries(filteredEvents).map(([category, events]) => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category === ">Музыка и концерты" ? 'Музыка и концерты' : category}</h3>
            <div className="event-cards">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Home;

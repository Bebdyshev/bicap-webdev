import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import "./Findbook.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { events } from "../constant/data";
import axiosInstance from "../axios/instanse";

const HeartIcon = ({ color = "red", backgroundColor = "#fa04042a" }) => (
  <motion.div
    className="icon-container"
    initial={{ scale: 1 }}
    animate={{ scale: [1, 1.2, 1] }}
    transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop" }}
  >
    <div className="yes" style={{ backgroundColor }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={color}
        className="heart-icon"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  </motion.div>
);

const BrokenHeartIcon = () => (
  <motion.div
    className="icon-container"
    initial={{ scale: 1 }}
    animate={{ scale: [1, 1.2, 1] }}
    transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop" }}
  >
    <div
      className="yes"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.163)" }}
    >
      <i
        className="fa-solid fa-heart-crack"
        style={{
          fontSize: "100px",
          color: "black",
          padding: "50px",
          borderRadius: "50%",
          backgroundColor: "rgba(0, 0, 0, 0.371)",
        }}
      ></i>
    </div>
  </motion.div>
);

const Findbook = () => {
  const [showHeart, setShowHeart] = useState(false);
  const [showBrokenHeart, setShowBrokenHeart] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true); // для отслеживания загрузки данных

  useEffect(() => {
    axiosInstance.get('/recommend_events')
      .then(response => {
        setCards(response.data.recommended_events); // предполагается, что ответ содержит массив с книгами
        setLoading(false);
        console.log("sent!")
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        toast.error('Ошибка при загрузке данных');
        setLoading(false);
      });
  }, []);


  const setRandomCards = (sourceCards) => {
    const shuffled = [...sourceCards].sort(() => Math.random() - 0.5);
    setCards(shuffled.slice(0, 3));
  };

  return (
    <div className="tinder-container">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          setCards={setCards}
          setShowHeart={setShowHeart}
          setShowBrokenHeart={setShowBrokenHeart}
          allCards={events}
        />
      ))}
      {showHeart && <HeartIcon />}
      {showBrokenHeart && <BrokenHeartIcon />}
      <ToastContainer />
    </div>
  );
};

const Card = React.memo(
  ({ card, setCards, setShowHeart, setShowBrokenHeart, allCards }) => {
    const x = useMotionValue(0);
    const rotateRaw = useTransform(x, [-100, 100], [-18, 18]);
    const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

    const handleDragEnd = () => {
  const swipeThreshold = 100;
  
  // Условие для свайпа вправо (like) или влево (dislike)
  if (x.get() > swipeThreshold) {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 500);

    // Отправляем запрос на like_event для категории
    axiosInstance
      .post(`/like_event/${card.category}`)
      .then((response) => {
      })
      .catch((error) => {
        console.error('Ошибка при отправке like_event:', error);
      });
  } else if (x.get() < -swipeThreshold) {
    setShowBrokenHeart(true);
    setTimeout(() => setShowBrokenHeart(false), 500);

    // Отправляем запрос на dislike_event для категории
    axiosInstance
      .post(`/dislike_event/${card.category}`)
      .then((response) => {
      })
      .catch((error) => {
        console.error('Ошибка при отправке dislike_event:', error);
      });
  }

  // Логика обновления списка карт
  if (Math.abs(x.get()) > swipeThreshold) {
    setCards((prev) => {
      const remainingCards = allCards.filter((c) => c.id !== card.id);
      const shuffled = remainingCards.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 3);
    });
  }
};


    return (
      <motion.div
        className="tinder-card"
        style={{ x, opacity, rotate: rotateRaw }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
      >
        <div className="tinder-img">
          <img className="book-cover" src={card.url} alt={card.title} />
        </div>
        <div className="text">
          <div className="card-top">
            <div className="bookcrossing-indicator">{card.category}</div>
            <h2 className="title">{card.name}</h2>
            <span className="date">Дата: {card.time}</span>
          </div>
          <div className="card-body">
            <span className="author">{card.author}</span>
            <span className="description">{card.description}</span>
          </div>
          <div className="card-bottom">
            <span className="description">
              Стоимость: {card.price === 0 ? "Бесплатно" : `${card.price} ₸`}            
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
);

export default Findbook;
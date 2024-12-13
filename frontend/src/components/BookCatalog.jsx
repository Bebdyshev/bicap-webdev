import React from 'react';
import axiosInstance from "../axios/instanse";
import { useNavigate } from 'react-router-dom';

const BookCatalog = ({ books }) => {
  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '1rem',
    justifyContent: 'center',
  };

  const cardStyle = {
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '250px',
    width: '100%',
  };

  const imgStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    marginBottom: '0.5rem',
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '0.25rem',
  };

  const authorStyle = {
    color: 'gray',
    fontSize: '14px',
    marginBottom: '0.5rem',
  };

  const descriptionStyle = {
    fontSize: '14px',
    color: '#4a4a4a',
    maxHeight: '100px',
    overflowY: 'auto',
    marginBottom: '0.5rem',
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    color: 'white',
    cursor: 'pointer',
    border: 'none',
    marginRight: '0.5rem',
    fontSize: '14px',
  };

  const reserveButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'green',
    ':hover': { backgroundColor: 'darkgreen' },
  };

  const navigate = useNavigate()

  const handleReserveClick = async (cardId) => {
    try {
      const rep = await axiosInstance.post(`/books/reserv?bookId=${cardId}`);
      console.log(rep);
      toast("Successfully booked. View more in filed reservations");
    } catch (error) {
      console.error('Error booking book:', error);
    }
  };

  const handleEbookClick = (pdfName) => {
    const encodedPdfName = encodeURIComponent(pdfName);
    navigate(`/pdf?url=${encodedPdfName}`);
    };
  
  return (
    <div style={containerStyle}>
      {ebooks.map((ebook, index) => (
        <div key={index} style={cardStyle}>
          <img
            src={ebook.media_urls[0]}
            alt={ebook.title}
            style={imgStyle}
          />
          <p style={titleStyle}>{ebook.title}</p>
          <p style={authorStyle}>{ebook.author}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href={ebook.pdfName}
                          >
              Open PDF
            </a>
          </div>
        </div>
      ))}
      {/* Отображение книг из базы данных */}
      {books.map((book) => (
        <div key={book._id} style={cardStyle}>
          <img
            src={book.media_urls[0]}
            alt={book.title}
            style={imgStyle}
          />
          <p style={titleStyle}>{book.title}</p>
          <p style={authorStyle}>{book.author}</p>
          <p style={descriptionStyle}>
            {book.description.length > 200
              ? `${book.description.substring(0, 200)}...`
              : book.description}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {book.is_from_library && (
              <button
                style={reserveButtonStyle}
                onClick={() => handleReserveClick(book._id)}
              >
                Book
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookCatalog;

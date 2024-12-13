import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../axios/instanse';

const SearchComponent = ({ setSearchResults }) => {
  const [text, setText] = useState('');
  const [hasFile, setHasFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSearch = async () => {
      try {
        const response = await axiosInstance.post('/recommend_events_by_prompt', {"prompt": text});

        setSearchResults(response.data.recommendations); // Обновляем состояние с результатами поиска
        console.log(response.data.recommendations)
      } catch (error) {
      } finally {
        setIsUploading(false);
      }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const clearSearch = () => {
    setText('');
    setHasFile(false);
    setFilePreview(null);
  };

  const showContinueButton = hasFile || text.trim() !== '';

  return (
    <div style={{ display: 'flex', borderRadius: '8px', width: '75%', marginTop: '20px' }}>
      {/* Text Input */}
      <div style={{ width: '100%'}}>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Найдётся всё"
          style={{
            height: '25px',
            width: '97.5%',
            padding: '8px',
            border: '1px solid #D1D5DB',
            borderRadius: '5px',
            outline: 'none',
            fontSize: '17px',
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0px'}}>
        {/* Clear Button */}
        <button
          onClick={clearSearch}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            backgroundColor: 'white',
            color: '#4A4A4A',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            border: '1px solid #D1D5DB',
          }}
          title="Очистить поисковый запрос"
        >
          <i className="fa-solid fa-x" style={{ fontSize: '20px' }}></i>
        </button>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isUploading}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            backgroundColor: !showContinueButton ? 'white' : '#3B82F6',
            border: !showContinueButton ? '1px solid #D1D5DB' : 'none',
            color: !showContinueButton ? '#4A4A4A' : '#ffffff',
            borderRadius: '4px',
            marginLeft: '5px',
            cursor: !showContinueButton ? 'not-allowed' : 'pointer',
          }}
          title="Поиск"
        >
          <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '20px' }}></i>
        </button>
      </div>
    </div>
  );
};

export default SearchComponent;

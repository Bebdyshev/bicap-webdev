import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios/instanse'; // Make sure axios is configured correctly
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CreateEvent = () => {
  const [eventDetails, setEventDetails] = useState({
    name: '',
    description: '',
    location: '',
    price: '',
    date: '',
    category: '',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // This effect will fetch categories from the server if needed
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories'); // Assume this is the endpoint to fetch categories
        setCategories(response.data); // Adjust response as necessary
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array to only run once when the component mounts

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', eventDetails.name);
      formData.append('description', eventDetails.description);
      formData.append('location', JSON.stringify(selectedLocation)); // Send coordinates
      formData.append('price', eventDetails.price);
      formData.append('date', eventDetails.date);
      formData.append('category', eventDetails.category);

      // Send the form data to the server to create the event
      const response = await axiosInstance.post('/create_real_event', formData);

      alert('Event created successfully');
    } catch (error) {
      alert('Error while creating event');
    }
  };

  // Component for handling location selection on the map
  function LocationPicker() {
    const map = useMapEvents({
      click(e) {
        setSelectedLocation(e.latlng); // Get coordinates of the clicked location
      },
    });

    return selectedLocation ? (
      <Marker position={selectedLocation}>
        <Popup>Selected location</Popup>
      </Marker>
    ) : null;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, sans-serif' }}>
      {/* Left side with image */}
      {/* Left side with image */}
<div style={{ 
  width: '48%', 
  marginTop: '20px',
  height: '700px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  position: 'relative',
  borderRadius: '10px',
  backgroundColor: '#f7f7f7',
  border: '2px dashed #ccc',
  overflow: 'hidden',
}}>
  {!imagePreview ? (
    <input
      type="file"
      onChange={handleImageChange}
      accept="image/*"
      style={{
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        opacity: 0,
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  ) : (
    <img
      src={imagePreview}
      alt="Preview"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  )}
  <p style={{ 
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)', 
    color: '#ccc',
    fontSize: '16px',
    textAlign: 'center',
    pointerEvents: 'none',
  }}>
    {!imagePreview ? 'Click to upload' : ''}
  </p>
</div>


      {/* Right side with event details */}
      <div style={{ width: '48%', marginTop: '20px', marginRight: '50px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name">Название</label>
            <input
              type="text"
              id="name"
              name="name"
              value={eventDetails.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginTop: '5px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={eventDetails.description}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginTop: '5px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="location">Локация</label>
            <div style={{ width: '100%', height: '200px' }}>
              <MapContainer center={[50.283451, 57.166785]} zoom={13} style={{ width: '100%', height: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationPicker />
              </MapContainer>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="price">Стоимость</label>
            <input
              type="number"
              id="price"
              name="price"
              value={eventDetails.price}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginTop: '5px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="date">Дата</label>
            <input
              type="date"
              id="date"
              name="date"
              value={eventDetails.date}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginTop: '5px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="category">Категория</label>
            <select
              id="category"
              name="category"
              value={eventDetails.category}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                backgroundColor: 'white',
                fontSize: '15px',
                marginTop: '5px',
              }}
            >
              <option value="">Выберите категорию</option>
              <option value="Еда и напитки">Еда и напитки</option>
              <option value="Кино и театр">Кино и театр</option>
              <option value="Музыка и концерты">Музыка и концерты</option>
              <option value="Образование и мастер-классы">Образование и мастер-классы</option>
              <option value="Развлечения">Развлечения</option>
              <option value="Ярмарки и выставки">Ярмарки и выставки</option>
            </select>
          </div>

          <div style={{ marginTop: '20px', width: '760px' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#f3a71a',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Создать событие
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

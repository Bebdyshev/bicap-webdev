import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios/instanse'; // Make sure the axiosInstance is properly set up
import { EventCard } from './EventCard';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [userEvents, setMyEvent] = useState([]);
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/user/me');
        setUserInfo(response.data); // Set user data in state
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchMyEvents = async () => {
        try {
          const response = await axiosInstance.get('/get_user_events');
          setMyEvent(response.data.events); 
          console.log(response.data.events)
        } catch (error) {
          console.error('Error fetching event data:', error);
        }
    }

    fetchUserInfo();
    fetchMyEvents();
  }, []); // Empty dependency array means this runs only once after the component mounts

  // If user data is still loading, display a loading state
  if (!userInfo.full_name) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f7f7f7',
        height: '90vh',
        width: '100%',
      }}
    >
      <div
        style={{
          marginTop: '2.5%',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          width: '60%',
          padding: '20px',
          display: 'flex',          // Set display to flex
          alignItems: 'center',     // Vertically align items
        }}
      >
        {/* Avatar */}
        <img
          src={`https://avatar.iran.liara.run/username?username=${userInfo.full_name}`} // Default avatar if none is provided
          alt="Profile Avatar"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '20px',     // Add space between avatar and text
          }}
        />
        {/* Text */}
        <div>
          <h2 style={{ margin: '10px 0', fontSize: '24px' }}>{userInfo.full_name}</h2>
          <p style={{ color: '#777', fontSize: '16px', marginBottom: '15px' }}>{userInfo.email}</p>
        </div>
      </div>

      {/* Statistics */}
      <div
        style={{
          marginTop: '2.5%',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          width: '60%',
          padding: '20px',
        }}
      >
        <h1 style={{marginBottom: '10px'}}>Статистика</h1>
        <div style={{ marginBottom: '15px' }}>
          <strong>Создано: </strong> {userInfo.creations.length}
          <div style={{marginTop: '15px'}}>
            {userEvents.map((event) => (
                <EventCard key={event.id} event={event} />
                ))}
          </div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>Участие в: </strong> {userInfo.participation.length - 1}
        </div>
      </div>

      {/* Recommendations */}
      <div
        style={{
          marginTop: '2.5%',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          width: '60%',
          padding: '20px',
        }}
      >
        <h1>Предпочтения</h1>
        <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
          {Object.entries(userInfo.recommend || {}).map(([category, value]) => (
            <li key={category} style={{ marginBottom: '10px' }}>
              <strong>{category}: </strong> {value.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;

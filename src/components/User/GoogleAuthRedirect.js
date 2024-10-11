import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add a delay to ensure the URL is fully loaded with query parameters
    const timer = setTimeout(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');
      console.log('Token:', token);

      if (token) {
        localStorage.setItem('token', token);
        navigate('/');  // Redirect to home after login
      } else {
        console.error('No token found in the URL');
        navigate('/login');  // Redirect to login if no token
      }
    }, 100); // 100 ms delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default GoogleAuthRedirect;

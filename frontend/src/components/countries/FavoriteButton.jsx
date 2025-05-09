import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const FavoriteButton = ({ countryCode }) => {
  const { user, refreshUser } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(user?.favoriteCountries?.includes(countryCode));
  }, [user, countryCode]);

  const handleFavorite = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const config = {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      };

      if (isFavorite) {
        await axios.delete(`http://localhost:5000/api/user/favorites/${countryCode}`, config);
      } else {
        await axios.post(`http://localhost:5000/api/user/favorites/${countryCode}`, {}, config);
      }

      await refreshUser();
    } catch (error) {
      console.error('Favorite action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Button
      variant={isFavorite ? 'danger' : 'outline-primary'}
      onClick={handleFavorite}
      disabled={loading}
    >
      {loading ? (
        <Spinner as="span" size="sm" animation="border" />
      ) : isFavorite ? (
        '❤️ Remove Favorite'
      ) : (
        '♡ Add to Favorites'
      )}
    </Button>
  );
};

export default FavoriteButton;

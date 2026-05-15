// src/app/hooks/useFavorites.ts
import { useState, useEffect } from 'react';

export interface FavoriteItem {
  id: number;
  title: string;
  location: string;
  price: number;
  priceDisplay: string;
  rating: number;
  reviews: number;
  image: string;
  type?: string;
  addedAt: string;
}

// ✅ Utilisez 'export function' pour un export nommé
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Charger les favoris depuis localStorage au démarrage
  useEffect(() => {
    const stored = localStorage.getItem('bluefin_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Erreur chargement favoris', e);
      }
    }
  }, []);

  // Sauvegarder les favoris dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('bluefin_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Ajouter un favori
  const addFavorite = (property: any) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === property.id)) {
        return prev;
      }
      const newFavorite: FavoriteItem = {
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        priceDisplay: property.priceDisplay,
        rating: property.rating,
        reviews: property.reviews,
        image: property.image,
        type: property.type || 'Logement',
        addedAt: new Date().toISOString()
      };
      return [...prev, newFavorite];
    });
  };

  // Supprimer un favori
  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  // Vérifier si un logement est favori
  const isFavorite = (id: number): boolean => {
    return favorites.some(fav => fav.id === id);
  };

  // Basculer l'état favori
  const toggleFavorite = (property: any) => {
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    favoriteCount: favorites.length
  };
}

const API_BASE_URL = 'https://api.bluefin-immo.com';

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder.jpg';
  
  // Si c'est déjà une URL complète
  if (path.startsWith('http')) return path;
  
  // Nettoyer le chemin (enlever les slashes au début)
  const cleanPath = path.replace(/^\/+/, '');
  
  // ✅ URL CORRECTE
  return `${API_BASE_URL}/api/storage/photos/${cleanPath}`;
};
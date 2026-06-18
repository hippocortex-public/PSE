import axios from 'axios';

// Configuration de base pour Axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Re-exporter toutes les fonctions API depuis leurs modules dédiés
export * from './competenceApi';
export * from './entrepriseApi';
export * from './projetApi';
export * from './candidatureApi';

export default api;

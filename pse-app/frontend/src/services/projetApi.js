import api from './api';

// ====================
// PROJETS
// ====================

export const getProjets = async (params = {}) => {
  try {
    const response = await api.get('/projets', { params });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    throw error;
  }
};

export const getProjetById = async (id) => {
  try {
    const response = await api.get(`/projets/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    throw error;
  }
};

export const createProjet = async (projetData) => {
  try {
    const response = await api.post('/projets', projetData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    throw error;
  }
};

export const updateProjet = async (id, projetData) => {
  try {
    const response = await api.put(`/projets/${id}`, projetData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    throw error;
  }
};

export const deleteProjet = async (id) => {
  try {
    const response = await api.delete(`/projets/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    throw error;
  }
};

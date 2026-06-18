import api from './api';

// ====================
// COMPÉTENCES
// ====================

export const getCompetences = async (params = {}) => {
  try {
    const response = await api.get('/competences', { params });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    throw error;
  }
};

export const getCompetenceById = async (id) => {
  try {
    const response = await api.get(`/competences/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la compétence:', error);
    throw error;
  }
};

export const createCompetence = async (competenceData) => {
  try {
    const response = await api.post('/competences', competenceData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la compétence:', error);
    throw error;
  }
};

export const updateCompetence = async (id, competenceData) => {
  try {
    const response = await api.put(`/competences/${id}`, competenceData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la compétence:', error);
    throw error;
  }
};

export const deleteCompetence = async (id) => {
  try {
    const response = await api.delete(`/competences/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    throw error;
  }
};

export const getOrCreateCompetenceByNom = async (competenceData) => {
  try {
    const response = await api.post('/competences/get-or-create', competenceData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération/création de la compétence:', error);
    throw error;
  }
};

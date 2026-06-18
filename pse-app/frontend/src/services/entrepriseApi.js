import api from './api';

// ====================
// ENTREPRISES
// ====================

export const getEntreprises = async (params = {}) => {
  try {
    const response = await api.get('/entreprises', { params });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des entreprises:', error);
    throw error;
  }
};

export const getEntrepriseById = async (id) => {
  try {
    const response = await api.get(`/entreprises/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'entreprise:', error);
    throw error;
  }
};

export const createEntreprise = async (entrepriseData) => {
  try {
    const response = await api.post('/entreprises', entrepriseData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'entreprise:', error);
    throw error;
  }
};

export const updateEntreprise = async (id, entrepriseData) => {
  try {
    const response = await api.put(`/entreprises/${id}`, entrepriseData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
    throw error;
  }
};

export const deleteEntreprise = async (id) => {
  try {
    const response = await api.delete(`/entreprises/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'entreprise:', error);
    throw error;
  }
};

// Sections de préparation
export const addSectionPreparation = async (entrepriseId, sectionData) => {
  try {
    const response = await api.post(`/entreprises/${entrepriseId}/sections`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la section:', error);
    throw error;
  }
};

export const updateSectionPreparation = async (entrepriseId, sectionId, sectionData) => {
  try {
    const response = await api.put(`/entreprises/${entrepriseId}/sections/${sectionId}`, sectionData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la section:', error);
    throw error;
  }
};

export const deleteSectionPreparation = async (entrepriseId, sectionId) => {
  try {
    const response = await api.delete(`/entreprises/${entrepriseId}/sections/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la section:', error);
    throw error;
  }
};

export const reorderSections = async (entrepriseId, sections) => {
  try {
    const response = await api.put(`/entreprises/${entrepriseId}/sections/reorder`, { sections });
    return response.data;
  } catch (error) {
    console.error('Erreur lors du réordonnancement des sections:', error);
    throw error;
  }
};

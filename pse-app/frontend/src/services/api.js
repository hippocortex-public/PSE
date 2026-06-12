import axios from 'axios';

// Configuration de base pour Axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// ====================
// CANDIDATURES
// ====================

export const getCandidatures = async (params = {}) => {
  try {
    const response = await api.get('/candidatures', { params });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
    throw error;
  }
};

export const getCandidatureById = async (id) => {
  try {
    const response = await api.get(`/candidatures/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la candidature:', error);
    throw error;
  }
};

export const createCandidature = async (candidatureData) => {
  try {
    const response = await api.post('/candidatures', candidatureData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la candidature:', error);
    throw error;
  }
};

export const updateCandidature = async (id, candidatureData) => {
  try {
    const response = await api.put(`/candidatures/${id}`, candidatureData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la candidature:', error);
    throw error;
  }
};

export const deleteCandidature = async (id) => {
  try {
    const response = await api.delete(`/candidatures/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la candidature:', error);
    throw error;
  }
};

// Statuts
export const updateStatut = async (id, statutData) => {
  try {
    const response = await api.put(`/candidatures/${id}/statut`, statutData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
};

// Documents
export const addDocument = async (candidatureId, documentData, file) => {
  try {
    const formData = new FormData();
    formData.append('candidature_id', candidatureId);
    formData.append('type_document', documentData.type_document);
    formData.append('version', documentData.version || '1.0');
    formData.append('document', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'upload du document:', error);
    throw error;
  }
};

export const deleteDocument = async (candidatureId, documentId) => {
  try {
    const response = await api.delete(`/candidatures/${candidatureId}/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error);
    throw error;
  }
};

export default api;

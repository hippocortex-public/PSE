import api from './api';

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

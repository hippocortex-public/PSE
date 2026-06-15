// frontend/src/components/RechercheAvancee.jsx
import React, { useState } from 'react';
import axios from 'axios';

const RechercheAvancee = ({ onSearch }) => {
  const [filtres, setFiltres] = useState({
    poste: '',
    statut: '',
    entreprise: '',
    dateMin: '',
    dateMax: '',
    competences: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltres({ ...filtres, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Construire l'URL avec les paramètres de filtre
      const queryParams = new URLSearchParams();
      Object.entries(filtres).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(`/api/candidatures/recherche?${queryParams.toString()}`);
      onSearch(response.data); // Passer les résultats au parent
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="recherche-avancee">
      <h3>Recherche avancée</h3>

      <div className="form-group">
        <label>Poste:</label>
        <input
          type="text"
          name="poste"
          value={filtres.poste}
          onChange={handleChange}
          placeholder="Ex: Développeur"
        />
      </div>

      <div className="form-group">
        <label>Statut:</label>
        <select name="statut" value={filtres.statut} onChange={handleChange}>
          <option value="">Tous</option>
          <option value="En cours">En cours</option>
          <option value="Acceptée">Acceptée</option>
          <option value="Rejetée">Rejetée</option>
        </select>
      </div>

      <div className="form-group">
        <label>Entreprise:</label>
        <input
          type="text"
          name="entreprise"
          value={filtres.entreprise}
          onChange={handleChange}
          placeholder="Ex: Google"
        />
      </div>

      <div className="form-group">
        <label>Date minimale:</label>
        <input
          type="date"
          name="dateMin"
          value={filtres.dateMin}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Date maximale:</label>
        <input
          type="date"
          name="dateMax"
          value={filtres.dateMax}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Compétences (séparées par des virgules):</label>
        <input
          type="text"
          name="competences"
          value={filtres.competences}
          onChange={handleChange}
          placeholder="Ex: React, Node.js"
        />
      </div>

      <button type="submit">Rechercher</button>
    </form>
  );
};

export default RechercheAvancee;
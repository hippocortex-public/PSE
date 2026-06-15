// frontend/src/pages/Candidatures.jsx
import React, { useState } from 'react';
import RechercheAvancee from '../components/RechercheAvancee';

const Candidatures = () => {
  const [candidatures, setCandidatures] = useState([]);

  const handleSearch = (results) => {
    setCandidatures(results);
  };

  return (
    <div>
      <h1>Liste des candidatures</h1>
      <RechercheAvancee onSearch={handleSearch} />

      <div className="results">
        {candidatures.map((candidature) => (
          <div key={candidature._id} className="candidature">
            <h3>{candidature.poste}</h3>
            <p>Entreprise: {candidature.entreprise}</p>
            <p>Statut: {candidature.statut}</p>
            <p>Date: {new Date(candidature.dateCandidature).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Candidatures;
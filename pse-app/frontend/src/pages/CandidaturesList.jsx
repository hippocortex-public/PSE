import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCandidatures, deleteCandidature } from '../services/api';

function CandidaturesList() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatut, setFilterStatut] = useState('');
  const [filterEntreprise, setFilterEntreprise] = useState('');

  useEffect(() => {
    fetchCandidatures();
  }, [filterStatut, filterEntreprise]);

  const fetchCandidatures = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatut) params.statut = filterStatut;
      if (filterEntreprise) params.nom_entreprise = filterEntreprise; // Ajout du filtre par nom d'entreprise


      const data = await getCandidatures(params);
      setCandidatures(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des candidatures');
    } finally {
      setLoading(false);
    }
  };

  // Optionnel : Permettre la recherche avec la touche "Entrée"
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchCandidatures();
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      try {
        await deleteCandidature(id);
        fetchCandidatures();
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const getStatutBadgeClass = (statut) => {
    switch (statut) {
      case 'Envoyé':
        return 'badge-envoye';
      case 'Réponse reçue':
        return 'badge-reponse';
      case 'Entretien':
        return 'badge-entretien';
      case 'Refus':
        return 'badge-refus';
      default:
        return 'badge';
    }
  };

  return (
    <div>
      <div className="flex-between mb-20">
        <h2>Liste des Candidatures</h2>
        <Link to="/candidatures/new" className="btn">
          Ajouter une candidature
        </Link>
      </div>

      <div className="card mb-20">
        <h3>Filtres</h3>
        <div className="flex" style={{ gap: '15px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Statut</label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="Envoyé">Envoyé</option>
              <option value="Réponse reçue">Réponse reçue</option>
              <option value="Entretien">Entretien</option>
              <option value="Refus">Refus</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Entreprise (Nom)</label>
            <input
              type="text"
              value={filterEntreprise}
              onChange={(e) => setFilterEntreprise(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nom de l'entreprise"
            />
            <button onClick={fetchCandidatures}>Rechercher</button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div>Chargement en cours...</div>
      ) : candidatures.length === 0 ? (
        <div className="card">
          <p>Aucune candidature trouvée.</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Poste</th>
                <th>Entreprise</th>
                <th>Statut</th>
                <th>Date de candidature</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidatures.map((candidature) => (
                <tr key={candidature._id}>
                  <td>{candidature.titre_poste}</td>
                  <td>
                    {candidature.entreprise_id?.nom || candidature.entreprise_id}
                  </td>
                  <td>
                    <span className={`badge ${getStatutBadgeClass(candidature.statut)}`}>
                      {candidature.statut}
                    </span>
                  </td>
                  <td>
                    {new Date(candidature.date_candidature).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <Link
                      to={`/candidatures/${candidature._id}`}
                      className="btn btn-secondary"
                    >
                      Voir
                    </Link>
                    <Link
                      to={`/candidatures/${candidature._id}/edit`}
                      className="btn btn-secondary"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(candidature._id)}
                      className="btn btn-danger"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CandidaturesList;

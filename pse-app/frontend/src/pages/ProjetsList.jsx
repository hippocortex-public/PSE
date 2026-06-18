import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjets, deleteProjet } from '../services/api';

function ProjetsList() {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatut, setFilterStatut] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjets();
  }, [filterStatut, searchTerm]);

  const fetchProjets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatut) params.statut = filterStatut;
      if (searchTerm) params.search = searchTerm;
      
      const data = await getProjets(params);
      setProjets(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des projets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await deleteProjet(id);
        fetchProjets();
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const getStatutBadgeClass = (statut) => {
    switch (statut) {
      case 'En cours':
        return 'badge-envoye';
      case 'Terminé':
        return 'badge-reponse';
      case 'À venir':
        return 'badge';
      case 'Annulé':
        return 'badge-refus';
      default:
        return 'badge';
    }
  };

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="flex-between mb-20">
        <h2>Liste des Projets</h2>
        <Link to="/projets/new" className="btn">
          Ajouter un projet
        </Link>
      </div>

      <div className="card mb-20">
        <h3>Filtres</h3>
        <div className="flex" style={{ gap: '20px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label>Recherche</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre, contexte ou mission"
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label>Statut</label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="À venir">À venir</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>
        </div>
      </div>

      {projets.length === 0 ? (
        <div className="card">
          <p>Aucun projet trouvé.</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Entreprise</th>
                <th>Statut</th>
                <th>Date de début</th>
                <th>Date de fin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projets.map((projet) => (
                <tr key={projet._id}>
                  <td>
                    <Link to={`/projets/${projet._id}`}>
                      {projet.titre}
                    </Link>
                  </td>
                  <td>
                    {projet.entreprise_id?.nom || 'N/A'}
                  </td>
                  <td>
                    <span className={`badge ${getStatutBadgeClass(projet.statut)}`}>
                      {projet.statut}
                    </span>
                  </td>
                  <td>{new Date(projet.date_debut).toLocaleDateString('fr-FR')}</td>
                  <td>
                    {projet.date_fin 
                      ? new Date(projet.date_fin).toLocaleDateString('fr-FR') 
                      : '-'}
                  </td>
                  <td>
                    <Link
                      to={`/projets/${projet._id}`}
                      className="btn btn-secondary"
                    >
                      Voir
                    </Link>
                    <Link
                      to={`/projets/${projet._id}/edit`}
                      className="btn btn-secondary"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(projet._id)}
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

export default ProjetsList;

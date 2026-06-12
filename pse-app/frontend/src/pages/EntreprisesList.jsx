import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEntreprises, deleteEntreprise } from '../services/api';

function EntreprisesList() {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSecteur, setFilterSecteur] = useState('');

  useEffect(() => {
    fetchEntreprises();
  }, [filterSecteur]);

  const fetchEntreprises = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterSecteur) params.secteur = filterSecteur;
      
      const data = await getEntreprises(params);
      setEntreprises(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des entreprises');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
      try {
        await deleteEntreprise(id);
        fetchEntreprises();
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression');
      }
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
        <h2>Liste des Entreprises</h2>
        <Link to="/entreprises/new" className="btn">
          Ajouter une entreprise
        </Link>
      </div>

      <div className="card mb-20">
        <h3>Filtres</h3>
        <div className="form-group">
          <label>Secteur</label>
          <input
            type="text"
            value={filterSecteur}
            onChange={(e) => setFilterSecteur(e.target.value)}
            placeholder="Filtrer par secteur"
          />
        </div>
      </div>

      {entreprises.length === 0 ? (
        <div className="card">
          <p>Aucune entreprise trouvée.</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Secteur</th>
                <th>Site web</th>
                <th>Taille</th>
                <th>Sections de préparation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entreprises.map((entreprise) => (
                <tr key={entreprise._id}>
                  <td>{entreprise.nom}</td>
                  <td>{entreprise.secteur || '-'}</td>
                  <td>
                    {entreprise.site_web ? (
                      <a href={entreprise.site_web} target="_blank" rel="noopener noreferrer">
                        Voir
                      </a>
                    ) : '-'}
                  </td>
                  <td>{entreprise.taille || '-'}</td>
                  <td>
                    {entreprise.sections_preparation ? (
                      <span>
                        {entreprise.sections_preparation.filter(s => s.actif).length} sections
                      </span>
                    ) : '0 sections'}
                  </td>
                  <td>
                    <Link
                      to={`/entreprises/${entreprise._id}`}
                      className="btn btn-secondary"
                    >
                      Voir
                    </Link>
                    <Link
                      to={`/entreprises/${entreprise._id}/edit`}
                      className="btn btn-secondary"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(entreprise._id)}
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

export default EntreprisesList;

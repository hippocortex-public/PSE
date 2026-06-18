import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompetences, deleteCompetence, updateCompetence } from '../services/api';

function CompetencesList() {
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategorie, setFilterCategorie] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCompetence, setEditingCompetence] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nom: '',
    description: '',
    categorie: 'Technique'
  });

  useEffect(() => {
    fetchCompetences();
  }, [filterCategorie, searchTerm]);

  const fetchCompetences = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterCategorie) params.categorie = filterCategorie;
      if (searchTerm) params.search = searchTerm;
      
      const data = await getCompetences(params);
      setCompetences(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des compétences');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compétence ? Cela peut affecter les projets qui l\'utilisent.')) {
      try {
        await deleteCompetence(id);
        fetchCompetences();
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (competence) => {
    setEditingCompetence(competence._id);
    setEditFormData({
      nom: competence.nom || '',
      description: competence.description || '',
      categorie: competence.categorie || 'Technique'
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCompetence(editingCompetence, editFormData);
      setEditingCompetence(null);
      fetchCompetences();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleCancelEdit = () => {
    setEditingCompetence(null);
  };

  const getCategorieColor = (categorie) => {
    switch (categorie) {
      case 'Technique':
        return { background: '#e3f2fd', color: '#1976d2', border: '1px solid #90caf9' };
      case 'Fonctionnelle':
        return { background: '#f3e5f5', color: '#7b1fa2', border: '1px solid #ba68c8' };
      case 'Méthodologie':
        return { background: '#e8f5e9', color: '#388e3c', border: '1px solid #81c784' };
      case 'Langue':
        return { background: '#fff3e0', color: '#f57c00', border: '1px solid #ffb74d' };
      default:
        return { background: '#f5f5f5', color: '#333', border: '1px solid #ddd' };
    }
  };

  const categories = ['Tous', 'Technique', 'Fonctionnelle', 'Méthodologie', 'Langue', 'Autre'];

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="flex-between mb-20">
        <h2>Gestion des Compétences</h2>
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
              placeholder="Rechercher par nom ou description"
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label>Catégorie</label>
            <select
              value={filterCategorie}
              onChange={(e) => setFilterCategorie(e.target.value || '')}
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'Tous' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {competences.length === 0 ? (
        <div className="card">
          <p>Aucune compétence trouvée.</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {competences.map((competence) => (
                <tr key={competence._id}>
                  <td>
                    <span 
                      className="badge"
                      style={{
                        ...getCategorieColor(competence.categorie),
                        padding: '5px 10px',
                        borderRadius: '12px',
                        fontSize: '0.9em'
                      }}
                    >
                      {competence.nom}
                    </span>
                  </td>
                  <td>
                    <span 
                      style={{
                        background: getCategorieColor(competence.categorie).background,
                        color: getCategorieColor(competence.categorie).color,
                        padding: '3px 8px',
                        borderRadius: '8px',
                        fontSize: '0.85em'
                      }}
                    >
                      {competence.categorie}
                    </span>
                  </td>
                  <td>{competence.description || '-'}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(competence)}
                      className="btn btn-secondary"
                      style={{ marginRight: '5px' }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(competence._id)}
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

      {/* Modal de modification */}
      {editingCompetence && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
            <h3>Modifier la compétence</h3>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit-nom">Nom *</label>
                <input
                  type="text"
                  id="edit-nom"
                  name="nom"
                  value={editFormData.nom}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-categorie">Catégorie</label>
                <select
                  id="edit-categorie"
                  name="categorie"
                  value={editFormData.categorie}
                  onChange={handleEditChange}
                >
                  <option value="Technique">Technique</option>
                  <option value="Fonctionnelle">Fonctionnelle</option>
                  <option value="Méthodologie">Méthodologie</option>
                  <option value="Langue">Langue</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows={3}
                  placeholder="Description de la compétence..."
                />
              </div>

              <div className="flex-between mt-20">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-20">
        <Link to="/projets" className="btn btn-secondary">
          Retour aux projets
        </Link>
      </div>
    </div>
  );
}

export default CompetencesList;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getEntrepriseById, 
  deleteEntreprise, 
  addSectionPreparation, 
  updateSectionPreparation, 
  deleteSectionPreparation,
  reorderSections 
} from '../services/api';

function EntrepriseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entreprise, setEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSection, setNewSection] = useState({
    type_section: '',
    titre: '',
    contenu: ''
  });
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editSectionData, setEditSectionData] = useState({
    type_section: '',
    titre: '',
    contenu: ''
  });

  useEffect(() => {
    fetchEntreprise();
  }, [id]);

  const fetchEntreprise = async () => {
    try {
      setLoading(true);
      const data = await getEntrepriseById(id);
      setEntreprise(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération de l\'entreprise');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
      try {
        await deleteEntreprise(id);
        navigate('/entreprises');
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression de l\'entreprise');
      }
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    try {
      await addSectionPreparation(id, newSection);
      fetchEntreprise();
      setNewSection({ type_section: '', titre: '', contenu: '' });
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout de la section');
    }
  };

  const handleEditSection = (section) => {
    setEditingSectionId(section._id);
    setEditSectionData({
      type_section: section.type_section,
      titre: section.titre,
      contenu: section.contenu
    });
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    try {
      await updateSectionPreparation(id, editingSectionId, editSectionData);
      fetchEntreprise();
      setEditingSectionId(null);
      setEditSectionData({ type_section: '', titre: '', contenu: '' });
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour de la section');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
      try {
        await deleteSectionPreparation(id, sectionId);
        fetchEntreprise();
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression de la section');
      }
    }
  };

  const handleToggleSection = async (sectionId, currentActif) => {
    try {
      await updateSectionPreparation(id, sectionId, { actif: !currentActif });
      fetchEntreprise();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour de la section');
    }
  };

  const handleReorder = async (newSections) => {
    try {
      await reorderSections(id, newSections);
      fetchEntreprise();
    } catch (err) {
      setError(err.message || 'Erreur lors du réordonnancement');
    }
  };

  const moveSection = (fromIndex, toIndex) => {
    if (!entreprise?.sections_preparation) return;
    
    const newSections = [...entreprise.sections_preparation];
    const [removed] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, removed);
    
    // Mettre à jour les ordres
    const updatedSections = newSections.map((section, index) => ({
      sectionId: section._id,
      ordre: index
    }));
    
    handleReorder(updatedSections);
  };

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!entreprise) {
    return <div>Entreprise non trouvée</div>;
  }

  return (
    <div>
      <div className="flex-between mb-20">
        <h2>Fiche Entreprise: {entreprise.nom}</h2>
        <div>
          <Link to={`/entreprises/${id}/edit`} className="btn btn-secondary mr-10">
            Modifier
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Supprimer
          </button>
        </div>
      </div>

      <div className="card mb-20">
        <h3>Informations générales</h3>
        <div className="form-group">
          <label>Nom</label>
          <p>{entreprise.nom}</p>
        </div>
        <div className="form-group">
          <label>Site web</label>
          <p>
            {entreprise.site_web ? (
              <a href={entreprise.site_web} target="_blank" rel="noopener noreferrer">
                {entreprise.site_web}
              </a>
            ) : '-'}
          </p>
        </div>
        <div className="form-group">
          <label>Secteur</label>
          <p>{entreprise.secteur || '-'}</p>
        </div>
        <div className="form-group">
          <label>Taille</label>
          <p>{entreprise.taille || '-'}</p>
        </div>
        <div className="form-group">
          <label>Chiffre d'affaires</label>
          <p>{entreprise.chiffre_affaires || '-'}</p>
        </div>
        <div className="form-group">
          <label>Organisation</label>
          <p>{entreprise.organisation || '-'}</p>
        </div>
        <div className="form-group">
          <label>Valeurs</label>
          <p>{entreprise.valeurs || '-'}</p>
        </div>
        <div className="form-group">
          <label>Historique</label>
          <p>{entreprise.historique_court || '-'}</p>
        </div>
      </div>

      <div className="card mb-20">
        <h3>Sections de préparation d'entretien</h3>
        
        {editingSectionId ? (
          <div className="section-card mb-20">
            <h4>Modifier la section</h4>
            <form onSubmit={handleUpdateSection}>
              <div className="form-group">
                <label>Type de section</label>
                <input
                  type="text"
                  value={editSectionData.type_section}
                  onChange={(e) => setEditSectionData({...editSectionData, type_section: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={editSectionData.titre}
                  onChange={(e) => setEditSectionData({...editSectionData, titre: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contenu</label>
                <textarea
                  value={editSectionData.contenu}
                  onChange={(e) => setEditSectionData({...editSectionData, contenu: e.target.value})}
                  required
                />
              </div>
              <div className="flex-between">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingSectionId(null)}>
                  Annuler
                </button>
                <button type="submit" className="btn">
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="section-card mb-20">
            <h4>Ajouter une nouvelle section</h4>
            <form onSubmit={handleAddSection}>
              <div className="flex" style={{ gap: '10px', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Type de section</label>
                  <select
                    value={newSection.type_section}
                    onChange={(e) => setNewSection({...newSection, type_section: e.target.value})}
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="Chiffres clés">Chiffres clés</option>
                    <option value="Secteur et tendances">Secteur et tendances</option>
                    <option value="Concurrents">Concurrents</option>
                    <option value="Valeurs et culture">Valeurs et culture</option>
                    <option value="Faits historiques">Faits historiques</option>
                    <option value="Questions à poser">Questions à poser</option>
                    <option value="Points de vigilance">Points de vigilance</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Titre</label>
                  <input
                    type="text"
                    value={newSection.titre}
                    onChange={(e) => setNewSection({...newSection, titre: e.target.value})}
                    required
                    placeholder="Titre de la section"
                  />
                </div>
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Contenu</label>
                  <input
                    type="text"
                    value={newSection.contenu}
                    onChange={(e) => setNewSection({...newSection, contenu: e.target.value})}
                    required
                    placeholder="Contenu de la section"
                  />
                </div>
                <button type="submit" className="btn">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        )}

        <h4>Sections existantes</h4>
        {entreprise.sections_preparation && entreprise.sections_preparation.length > 0 ? (
          <div>
            {entreprise.sections_preparation
              .filter(section => section.actif)
              .map((section, index) => (
                <div key={section._id} className="section-card">
                  <div className="flex-between">
                    <div>
                      <h5>{section.titre}</h5>
                      <p><strong>Type:</strong> {section.type_section}</p>
                      <p>{section.contenu}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditSection(section)}
                        className="btn btn-secondary"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section._id)}
                        className="btn btn-danger"
                      >
                        Supprimer
                      </button>
                      <button
                        onClick={() => handleToggleSection(section._id, section.actif)}
                        className="btn btn-secondary"
                      >
                        {section.actif ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p>Aucune section de préparation ajoutée.</p>
        )}
      </div>

      <div className="card">
        <h3>Candidatures associées</h3>
        <Link to="/" className="btn">
          Voir toutes les candidatures
        </Link>
      </div>
    </div>
  );
}

export default EntrepriseDetail;

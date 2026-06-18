import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getProjetById, 
  createProjet, 
  updateProjet, 
  getEntreprises,
  getCompetences,
  createCompetence 
} from '../services/api';

function ProjetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: '',
    contexte_projet: '',
    contexte_technologique: '',
    mission: '',
    date_debut: '',
    date_fin: '',
    entreprise_id: '',
    statut: 'À venir',
    competences: [],
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entreprises, setEntreprises] = useState([]);
  const [allCompetences, setAllCompetences] = useState([]);
  const [newCompetenceInput, setNewCompetenceInput] = useState('');
  const [newCompetenceCategorie, setNewCompetenceCategorie] = useState('Technique');
  const [selectedCompetences, setSelectedCompetences] = useState([]);
  const [competenceFilter, setCompetenceFilter] = useState('');
  const [competencesLoaded, setCompetencesLoaded] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchEntreprises(),
          fetchCompetences()
        ]);
        
        if (id) {
          await fetchProjet();
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des données');
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [id]);

  const fetchProjet = async () => {
    try {
      setLoading(true);
      const data = await getProjetById(id);
      
      // Extraire les IDs des compétences (au cas où ce seraient des objets)
      const competenceIds = data.competences ? 
        data.competences.map(c => c._id ? c._id : c) 
        : [];
      
      setFormData({
        titre: data.titre || '',
        contexte_projet: data.contexte_projet || '',
        contexte_technologique: data.contexte_technologique || '',
        mission: data.mission || '',
        date_debut: data.date_debut ? new Date(data.date_debut).toISOString().split('T')[0] : '',
        date_fin: data.date_fin ? new Date(data.date_fin).toISOString().split('T')[0] : '',
        entreprise_id: data.entreprise_id?._id || '',
        statut: data.statut || 'À venir',
        competences: competenceIds,
        notes: data.notes || ''
      });
      
      // Initialiser les compétences sélectionnées avec les IDs
      setSelectedCompetences(competenceIds);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération du projet');
      setLoading(false);
    }
  };

  const fetchEntreprises = async () => {
    try {
      const data = await getEntreprises();
      setEntreprises(data.data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des entreprises:', err);
      throw err;
    }
  };

  const fetchCompetences = async () => {
    try {
      const data = await getCompetences({ limit: 100 });
      setAllCompetences(data.data || []);
      setCompetencesLoaded(true);
    } catch (err) {
      console.error('Erreur lors de la récupération des compétences:', err);
      throw err;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompetenceSelection = (competenceId) => {
    if (selectedCompetences.includes(competenceId)) {
      setSelectedCompetences(selectedCompetences.filter(id => id !== competenceId));
    } else {
      setSelectedCompetences([...selectedCompetences, competenceId]);
    }
  };

  const handleAddNewCompetence = async () => {
    if (!newCompetenceInput.trim()) return;

    try {
      // Créer la nouvelle compétence avec la catégorie sélectionnée
      const newCompetence = await createCompetence({
        nom: newCompetenceInput.trim(),
        categorie: newCompetenceCategorie,
        description: ''
      });

      // Ajouter à la liste des compétences
      setAllCompetences([...allCompetences, newCompetence]);
      
      // Sélectionner la nouvelle compétence
      setSelectedCompetences([...selectedCompetences, newCompetence._id]);
      
      // Réinitialiser les champs
      setNewCompetenceInput('');
      setNewCompetenceCategorie('Technique');
      setCompetenceFilter('');
    } catch (err) {
      console.error('Erreur lors de la création de la compétence:', err);
      setError(err.message || 'Erreur lors de l\'ajout de la compétence');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const projetData = {
        ...formData,
        competences: selectedCompetences,
        date_debut: formData.date_debut ? new Date(formData.date_debut) : null,
        date_fin: formData.date_fin ? new Date(formData.date_fin) : null,
        entreprise_id: formData.entreprise_id || null
      };

      if (id) {
        await updateProjet(id, projetData);
      } else {
        await createProjet(projetData);
      }
      navigate(id ? `/projets/${id}` : '/projets');
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les compétences en fonction de la recherche
  const filteredCompetences = allCompetences.filter(competence => {
    if (!competenceFilter) return true;
    return competence.nom.toLowerCase().includes(competenceFilter.toLowerCase());
  });

  // Afficher le chargement si on est en train de charger ou si les compétences ne sont pas encore chargées
  if (loading || (id && !competencesLoaded)) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-20">
        <h2>{id ? 'Modifier le projet' : 'Ajouter un nouveau projet'}</h2>
      </div>

      {error && <div className="alert alert-error mb-20">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titre">Titre *</label>
            <input
              type="text"
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
              placeholder="Ex: Refonte du système de paiement"
            />
          </div>

          <div className="form-group">
            <label htmlFor="statut">Statut</label>
            <select
              id="statut"
              name="statut"
              value={formData.statut}
              onChange={handleChange}
            >
              <option value="À venir">À venir</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="entreprise_id">Entreprise associée</label>
            <select
              id="entreprise_id"
              name="entreprise_id"
              value={formData.entreprise_id}
              onChange={handleChange}
            >
              <option value="">Aucune entreprise</option>
              {entreprises.map(entreprise => (
                <option key={entreprise._id} value={entreprise._id}>
                  {entreprise.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="flex" style={{ gap: '20px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label htmlFor="date_debut">Date de début *</label>
              <input
                type="date"
                id="date_debut"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label htmlFor="date_fin">Date de fin</label>
              <input
                type="date"
                id="date_fin"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contexte_projet">Contexte du projet *</label>
            <textarea
              id="contexte_projet"
              name="contexte_projet"
              value={formData.contexte_projet}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Décrivez le contexte général du projet, son origine, les enjeux métiers..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="contexte_technologique">Contexte technologique *</label>
            <textarea
              id="contexte_technologique"
              name="contexte_technologique"
              value={formData.contexte_technologique}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Décrivez l'environnement technique, les technologies utilisées, les contraintes techniques..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="mission">Mission *</label>
            <textarea
              id="mission"
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Décrivez votre rôle, vos responsabilités et vos réalisations dans ce projet..."
            />
          </div>

          <div className="form-group">
            <label>Compétences</label>
            <div className="mb-10">
              <input
                type="text"
                value={competenceFilter}
                onChange={(e) => setCompetenceFilter(e.target.value)}
                placeholder="Rechercher une compétence..."
                style={{ width: '100%', marginBottom: '10px' }}
              />
            </div>
            
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
              {filteredCompetences.length > 0 ? (
                filteredCompetences.map((competence) => (
                  <div key={competence._id} style={{ marginBottom: '5px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedCompetences.includes(competence._id)}
                        onChange={() => handleCompetenceSelection(competence._id)}
                        style={{ marginRight: '10px' }}
                      />
                      <span>{competence.nom}</span>
                      {competence.categorie && (
                        <span 
                          style={{ 
                            marginLeft: '10px', 
                            fontSize: '0.8em', 
                            color: '#666',
                            background: '#f0f0f0',
                            padding: '2px 6px',
                            borderRadius: '3px'
                          }}>
                          {competence.categorie}
                        </span>
                      )}
                    </label>
                  </div>
                ))
              ) : (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                  Aucune compétence trouvée. Ajoutez-en une nouvelle ci-dessous.
                </p>
              )}
            </div>

            <div style={{ marginTop: '10px', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
              <div className="flex" style={{ gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={newCompetenceInput}
                  onChange={(e) => setNewCompetenceInput(e.target.value)}
                  placeholder="Nouvelle compétence"
                  style={{ flex: 1 }}
                />
                <select
                  value={newCompetenceCategorie}
                  onChange={(e) => setNewCompetenceCategorie(e.target.value)}
                  style={{ minWidth: '150px' }}
                >
                  <option value="Technique">Technique</option>
                  <option value="Fonctionnelle">Fonctionnelle</option>
                  <option value="Méthodologie">Méthodologie</option>
                  <option value="Langue">Langue</option>
                  <option value="Autre">Autre</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddNewCompetence}
                  className="btn"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Affichage des compétences sélectionnées */}
            {selectedCompetences.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <strong>Compétences sélectionnées :</strong>
                <div className="flex" style={{ gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
                  {allCompetences
                    .filter(c => selectedCompetences.includes(c._id))
                    .map((competence) => (
                      <span 
                        key={competence._id} 
                        className="badge badge-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center' }}
                      >
                        {competence.nom}
                        <button
                          type="button"
                          onClick={() => handleCompetenceSelection(competence._id)}
                          style={{ 
                            marginLeft: '5px', 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer',
                            color: '#ff4444'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes supplémentaires</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Ajoutez des notes ou commentaires supplémentaires..."
            />
          </div>

          <div className="flex-between mt-20">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/projets')}>
              Annuler
            </button>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'En cours...' : (id ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjetForm;

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEntrepriseById, createEntreprise, updateEntreprise } from '../services/api';

function EntrepriseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    site_web: '',
    secteur: '',
    taille: '',
    chiffre_affaires: '',
    organisation: '',
    valeurs: '',
    historique_court: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchEntreprise();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchEntreprise = async () => {
    try {
      setLoading(true);
      const data = await getEntrepriseById(id);
      setFormData({
        nom: data.nom || '',
        site_web: data.site_web || '',
        secteur: data.secteur || '',
        taille: data.taille || '',
        chiffre_affaires: data.chiffre_affaires || '',
        organisation: data.organisation || '',
        valeurs: data.valeurs || '',
        historique_court: data.historique_court || ''
      });
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération de l\'entreprise');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await updateEntreprise(id, formData);
      } else {
        await createEntreprise(formData);
      }
      navigate(id ? `/entreprises/${id}` : '/entreprises');
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-20">
        <h2>{id ? 'Modifier l\'entreprise' : 'Ajouter une nouvelle entreprise'}</h2>
      </div>

      {error && <div className="alert alert-error mb-20">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nom">Nom *</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="site_web">Site web</label>
            <input
              type="url"
              id="site_web"
              name="site_web"
              value={formData.site_web}
              onChange={handleChange}
              placeholder="https://exemple.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="secteur">Secteur</label>
            <input
              type="text"
              id="secteur"
              name="secteur"
              value={formData.secteur}
              onChange={handleChange}
              placeholder="Ex: Technologie, Finance, Santé"
            />
          </div>

          <div className="form-group">
            <label htmlFor="taille">Taille</label>
            <input
              type="text"
              id="taille"
              name="taille"
              value={formData.taille}
              onChange={handleChange}
              placeholder="Ex: 10-50 employés, 100+ employés"
            />
          </div>

          <div className="form-group">
            <label htmlFor="chiffre_affaires">Chiffre d'affaires</label>
            <input
              type="text"
              id="chiffre_affaires"
              name="chiffre_affaires"
              value={formData.chiffre_affaires}
              onChange={handleChange}
              placeholder="Ex: 1M€, 10M€-50M€"
            />
          </div>

          <div className="form-group">
            <label htmlFor="organisation">Organisation</label>
            <textarea
              id="organisation"
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
              placeholder="Description de l'organisation..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="valeurs">Valeurs</label>
            <textarea
              id="valeurs"
              name="valeurs"
              value={formData.valeurs}
              onChange={handleChange}
              placeholder="Valeurs de l'entreprise..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="historique_court">Historique court</label>
            <textarea
              id="historique_court"
              name="historique_court"
              value={formData.historique_court}
              onChange={handleChange}
              placeholder="Historique de l'entreprise..."
            />
          </div>

          <div className="flex-between mt-20">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/entreprises')}>
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

export default EntrepriseForm;

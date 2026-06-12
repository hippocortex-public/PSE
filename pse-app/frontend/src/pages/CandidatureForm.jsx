import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCandidatureById, createCandidature, updateCandidature, getEntreprises } from '../services/api';

function CandidatureForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre_poste: '',
    entreprise_id: '',
    url_offre: '',
    date_candidature: new Date().toISOString().split('T')[0],
    statut: 'Envoyé',
    notes: ''
  });
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEntreprises();
    if (id) {
      fetchCandidature();
    }
  }, [id]);

  const fetchEntreprises = async () => {
    try {
      const data = await getEntreprises();
      setEntreprises(data.data || []);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des entreprises');
    }
  };

  const fetchCandidature = async () => {
    try {
      setLoading(true);
      const data = await getCandidatureById(id);
      setFormData({
        titre_poste: data.titre_poste || '',
        entreprise_id: data.entreprise_id?._id || data.entreprise_id || '',
        url_offre: data.url_offre || '',
        date_candidature: new Date(data.date_candidature).toISOString().split('T')[0],
        statut: data.statut || 'Envoyé',
        notes: data.notes || ''
      });
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération de la candidature');
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
        await updateCandidature(id, formData);
      } else {
        await createCandidature(formData);
      }
      navigate(id ? `/candidatures/${id}` : '/');
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
        <h2>{id ? 'Modifier la candidature' : 'Ajouter une nouvelle candidature'}</h2>
      </div>

      {error && <div className="alert alert-error mb-20">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titre_poste">Titre du poste *</label>
            <input
              type="text"
              id="titre_poste"
              name="titre_poste"
              value={formData.titre_poste}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="entreprise_id">Entreprise *</label>
            <select
              id="entreprise_id"
              name="entreprise_id"
              value={formData.entreprise_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une entreprise</option>
              {entreprises.map(entreprise => (
                <option key={entreprise._id} value={entreprise._id}>
                  {entreprise.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="url_offre">Lien de l'offre *</label>
            <input
              type="url"
              id="url_offre"
              name="url_offre"
              value={formData.url_offre}
              onChange={handleChange}
              required
              placeholder="https://exemple.com/offre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date_candidature">Date de candidature *</label>
            <input
              type="date"
              id="date_candidature"
              name="date_candidature"
              value={formData.date_candidature}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="statut">Statut *</label>
            <select
              id="statut"
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              required
            >
              <option value="Envoyé">Envoyé</option>
              <option value="Réponse reçue">Réponse reçue</option>
              <option value="Entretien">Entretien</option>
              <option value="Refus">Refus</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notes supplémentaires..."
            />
          </div>

          <div className="flex-between mt-20">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
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

export default CandidatureForm;

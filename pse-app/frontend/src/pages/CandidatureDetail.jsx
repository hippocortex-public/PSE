import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCandidatureById, updateStatut, deleteCandidature, addDocument, deleteDocument } from '../services/api';

function CandidatureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidature, setCandidature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('CV');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCandidature();
  }, [id]);

  const fetchCandidature = async () => {
    try {
      setLoading(true);
      const data = await getCandidatureById(id);
      setCandidature(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération de la candidature');
    } finally {
      setLoading(false);
    }
  };

  const handleStatutChange = async (nouveauStatut) => {
    try {
      const commentaire = prompt('Ajouter un commentaire (optionnel) :');
      await updateStatut(id, { nouveau_statut: nouveauStatut, commentaire });
      fetchCandidature();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du statut');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    try {
      setUploading(true);
      await addDocument(id, { type_document: documentType }, file);
      fetchCandidature();
      setFile(null);
      setDocumentType('CV');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'upload du document');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await deleteDocument(id, documentId);
        fetchCandidature();
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression du document');
      }
    }
  };

  const handleDeleteCandidature = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      try {
        await deleteCandidature(id);
        navigate('/');
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression de la candidature');
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

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!candidature) {
    return <div>Candidature non trouvée</div>;
  }

  return (
    <div>
      <div className="flex-between mb-20">
        <h2>Détails de la candidature</h2>
        <div>
          <Link to={`/candidatures/${id}/edit`} className="btn btn-secondary mr-10">
            Modifier
          </Link>
          <button onClick={handleDeleteCandidature} className="btn btn-danger">
            Supprimer
          </button>
        </div>
      </div>

      <div className="card mb-20">
        <h3>Informations générales</h3>
        <div className="form-group">
          <label>Titre du poste</label>
          <p>{candidature.titre_poste}</p>
        </div>
        <div className="form-group">
          <label>Entreprise</label>
          <p>
            {candidature.entreprise_id?.nom || candidature.entreprise_id}
          </p>
        </div>
        <div className="form-group">
          <label>Lien de l'offre</label>
          <p>
            <a href={candidature.url_offre} target="_blank" rel="noopener noreferrer">
              {candidature.url_offre}
            </a>
          </p>
        </div>
        <div className="form-group">
          <label>Date de candidature</label>
          <p>{new Date(candidature.date_candidature).toLocaleDateString('fr-FR')}</p>
        </div>
        <div className="form-group">
          <label>Statut actuel</label>
          <div>
            <span className={`badge ${getStatutBadgeClass(candidature.statut)}`}>
              {candidature.statut}
            </span>
          </div>
        </div>
        <div className="form-group">
          <label>Changer le statut</label>
          <div className="flex" style={{ gap: '10px', flexWrap: 'wrap' }}>
            {['Envoyé', 'Réponse reçue', 'Entretien', 'Refus'].map(statut => (
              <button
                key={statut}
                onClick={() => handleStatutChange(statut)}
                className="btn btn-secondary"
                disabled={candidature.statut === statut}
              >
                → {statut}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <p>{candidature.notes || 'Aucune note'}</p>
        </div>
      </div>

      <div className="card mb-20">
        <h3>Historique des statuts</h3>
        {candidature.historique_statut && candidature.historique_statut.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Ancien statut</th>
                <th>Nouveau statut</th>
                <th>Date</th>
                <th>Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {candidature.historique_statut.map((hist, index) => (
                <tr key={index}>
                  <td>{hist.ancien_statut || 'N/A'}</td>
                  <td>{hist.nouveau_statut}</td>
                  <td>{new Date(hist.date_changement).toLocaleString('fr-FR')}</td>
                  <td>{hist.commentaire || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun historique disponible.</p>
        )}
      </div>

      <div className="card mb-20">
        <h3>Documents joints</h3>
        <form onSubmit={handleUpload} className="mb-20">
          <div className="flex" style={{ gap: '10px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Type de document</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="CV">CV</option>
                <option value="Lettre de motivation">Lettre de motivation</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 2 }}>
              <label>Fichier (PDF, DOC, DOCX)</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
            </div>
            <button type="submit" className="btn" disabled={uploading}>
              {uploading ? 'Upload en cours...' : 'Uploader'}
            </button>
          </div>
        </form>

        {candidature.documents && candidature.documents.length > 0 ? (
          <ul className="document-list">
            {candidature.documents.map((doc) => (
              <li key={doc._id}>
                <div>
                  <strong>{doc.type_document}</strong> - {doc.nom_fichier} (v{doc.version})
                  <br />
                  <small>
                    Ajouté le {new Date(doc.date_ajout).toLocaleDateString('fr-FR')}
                  </small>
                </div>
                <div>
                  <a
                    href={doc.url_complete || `/api${doc.chemin_fichier}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    Voir
                  </a>
                  <button
                    onClick={() => handleDeleteDocument(doc._id)}
                    className="btn btn-danger"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun document joint.</p>
        )}
      </div>

      <div className="mt-20">
        <Link to={`/entreprises/${candidature.entreprise_id?._id || candidature.entreprise_id}`} className="btn">
          Voir la fiche entreprise
        </Link>
      </div>
    </div>
  );
}

export default CandidatureDetail;

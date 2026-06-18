import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjetById, deleteProjet } from '../services/api';

function ProjetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjet();
  }, [id]);

  const fetchProjet = async () => {
    try {
      setLoading(true);
      const data = await getProjetById(id);
      setProjet(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération du projet');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await deleteProjet(id);
        navigate('/projets');
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression du projet');
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

  const getCategorieColor = (categorie) => {
    switch (categorie) {
      case 'Technique':
        return { background: '#e3f2fd', color: '#1976d2' };
      case 'Fonctionnelle':
        return { background: '#f3e5f5', color: '#7b1fa2' };
      case 'Méthodologie':
        return { background: '#e8f5e9', color: '#388e3c' };
      case 'Langue':
        return { background: '#fff3e0', color: '#f57c00' };
      default:
        return { background: '#f5f5f5', color: '#333' };
    }
  };

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!projet) {
    return <div>Projet non trouvé</div>;
  }

  return (
    <div>
      <div className="flex-between mb-20">
        <h2>Détails du projet : {projet.titre}</h2>
        <div>
          <Link to={`/projets/${id}/edit`} className="btn btn-secondary mr-10">
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
          <label>Titre</label>
          <p>{projet.titre}</p>
        </div>

        <div className="form-group">
          <label>Statut</label>
          <div>
            <span className={`badge ${getStatutBadgeClass(projet.statut)}`}>
              {projet.statut}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>Entreprise associée</label>
          <p>
            {projet.entreprise_id?.nom || 'Aucune entreprise associée'}
          </p>
        </div>

        <div className="form-group">
          <label>Date de début</label>
          <p>{new Date(projet.date_debut).toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="form-group">
          <label>Date de fin</label>
          <p>
            {projet.date_fin 
              ? new Date(projet.date_fin).toLocaleDateString('fr-FR') 
              : 'En cours ou non spécifiée'}
          </p>
        </div>

        {projet.competences && projet.competences.length > 0 && (
          <div className="form-group">
            <label>Compétences</label>
            <div className="flex" style={{ gap: '10px', flexWrap: 'wrap' }}>
              {projet.competences.map((competence) => (
                <span 
                  key={competence._id} 
                  className="badge"
                  style={{
                    ...getCategorieColor(competence.categorie),
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '5px 10px',
                    borderRadius: '12px',
                    fontSize: '0.9em'
                  }}
                >
                  {competence.nom}
                  {competence.categorie && (
                    <span style={{ 
                      marginLeft: '5px', 
                      fontSize: '0.8em',
                      opacity: 0.8
                    }}>
                      ({competence.categorie})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card mb-20">
        <h3>Contexte du projet</h3>
        <div className="form-group">
          <p style={{ whiteSpace: 'pre-wrap' }}>{projet.contexte_projet}</p>
        </div>
      </div>

      <div className="card mb-20">
        <h3>Contexte technologique</h3>
        <div className="form-group">
          <p style={{ whiteSpace: 'pre-wrap' }}>{projet.contexte_technologique}</p>
        </div>
      </div>

      <div className="card mb-20">
        <h3>Mission</h3>
        <div className="form-group">
          <p style={{ whiteSpace: 'pre-wrap' }}>{projet.mission}</p>
        </div>
      </div>

      {projet.notes && (
        <div className="card mb-20">
          <h3>Notes supplémentaires</h3>
          <div className="form-group">
            <p style={{ whiteSpace: 'pre-wrap' }}>{projet.notes}</p>
          </div>
        </div>
      )}

      <div className="mt-20">
        {projet.entreprise_id && (
          <Link 
            to={`/entreprises/${projet.entreprise_id._id}`} 
            className="btn mr-10"
          >
            Voir la fiche entreprise
          </Link>
        )}
        <Link to="/projets" className="btn btn-secondary">
          Retour à la liste des projets
        </Link>
      </div>
    </div>
  );
}

export default ProjetDetail;

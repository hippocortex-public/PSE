import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CandidaturesList from './pages/CandidaturesList';
import CandidatureDetail from './pages/CandidatureDetail';
import CandidatureForm from './pages/CandidatureForm';
import EntreprisesList from './pages/EntreprisesList';
import EntrepriseDetail from './pages/EntrepriseDetail';
import EntrepriseForm from './pages/EntrepriseForm';
import RechercheAvancee from './pages/RechercheAvancee';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <h1>PSE - Suivi de Candidatures</h1>
        </header>
        
        <nav className="nav">
          <ul>
            <li><Link to="/">Candidatures</Link></li>
            <li><Link to="/entreprises">Entreprises</Link></li>
            <li><Link to="/recherche">Recherche Avancée</Link></li>
          </ul>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<CandidaturesList />} />
            <Route path="/candidatures/new" element={<CandidatureForm />} />
            <Route path="/candidatures/:id" element={<CandidatureDetail />} />
            <Route path="/candidatures/:id/edit" element={<CandidatureForm />} />
            <Route path="/recherche" element={<RechercheAvancee />} />
            
            <Route path="/entreprises" element={<EntreprisesList />} />
            <Route path="/entreprises/new" element={<EntrepriseForm />} />
            <Route path="/entreprises/:id" element={<EntrepriseDetail />} />
            <Route path="/entreprises/:id/edit" element={<EntrepriseForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

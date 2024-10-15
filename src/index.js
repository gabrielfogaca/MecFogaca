import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Inicio from './components/Homepage/Inicio';
import Profile from './components/Inicio/Profile';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authContext'; // Importa o AuthProvider

const App = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Redireciona para /profile se o usuário estiver logado */}
      <Route
        path="/"
        element={currentUser ? <Navigate to="/profile" /> : <Inicio />}
      />
      <Route path="/profile" element={<Profile />} />
      {/* Adicione outras rotas conforme necessário */}
      {/* Exemplo de rota não encontrada */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>,
);

reportWebVitals();

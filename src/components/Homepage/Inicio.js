import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext'; // Ajuste o caminho conforme necessário
import wpp from './images/wallpper.jpeg';
import wppcel from './images/wallppercel.jpeg';
import Loginform from '../login/Loginform';
import './Inicio.css';

function getWindowSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return { width, height };
}

function Inicio() {
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const { currentUser } = useAuth(); // Obtemos o usuário atual do contexto de autenticação
  const navigate = useNavigate(); // Hook para redirecionar

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getWindowSize());
    };

    // Adiciona o listener para o evento de resize da janela
    window.addEventListener('resize', handleResize);

    // Remove o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      console.log('User is logged in, redirecting to /profile');
      navigate('/profile');
    }
  }, [currentUser, navigate]);

  return (
    <>
      {windowSize.width < 740 ? (
        <div
          className="justify-center items-center bg-fixed h-screen static"
          style={{
            backgroundImage: `url(${wppcel})`,
            backgroundAttachment: 'fixed',
          }}
        >
          <Loginform />
        </div>
      ) : (
        <div
          className="flex justify-center items-center bg-fixed bg-no-repeat bg-center bg-cover h-screen"
          style={{
            backgroundImage: `url(${wpp})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Loginform />
        </div>
      )}
    </>
  );
}

export default Inicio;

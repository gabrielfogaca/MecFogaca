import React, { useState, useEffect } from 'react';
import f250 from './images/f250wpp2.jpg';
import f250cel from './images/f250wppcel.jpg';
import ResponsiveDrawer from './Drawer.js';
import { useAuth } from '../../contexts/authContext'; // Importe o contexto de autenticação
import { Navigate } from 'react-router-dom'; // Importe para redirecionar se não estiver logado

function getWindowSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return { width, height };
}

function Profile() {
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const { userLoggedIn, loading } = useAuth(); // Verifica se o usuário está logado

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

  // Verifica se está carregando a autenticação
  if (loading) {
    return <div>Loading...</div>; // Pode exibir um loading enquanto verifica o login
  }

  // Se o usuário não estiver logado, redireciona para a página de login
  if (!userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Caso o usuário esteja logado, renderiza o componente
  return (
    <>
      {windowSize.width < 740 ? (
        <div
          className="justify-center items-center bg-fixed h-screen static"
          style={{
            backgroundImage: `url(${f250cel})`,
            backgroundAttachment: 'fixed',
          }}
        >
          <ResponsiveDrawer />
        </div>
      ) : (
        <div
          className="flex justify-center items-center bg-fixed bg-no-repeat bg-center bg-cover h-screen"
          style={{
            backgroundImage: `url(${f250})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <ResponsiveDrawer />
        </div>
      )}
    </>
  );
}

export default Profile;

import React, { useState } from 'react';
import './LoginForm.css'; // Importar o CSS
import avatar from './mecanicoavatar.avif';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from '../../firebase/auth';

const LoginModal = () => {
  const { userLoggedIn } = useAuth(); // Pega o estado da autenticação
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // Função para lidar com o login
  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Limpa qualquer mensagem de erro anterior
    setIsSigningIn(true); // Indica que a autenticação está em progresso
    try {
      // Tenta realizar o login com email e senha
      await doSignInWithEmailAndPassword(email, password);
      setIsSigningIn(false);
      navigate('/profile'); // Navega para o perfil após o login bem-sucedido
    } catch (error) {
      setIsSigningIn(false); // Encerra o estado de autenticação
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  // Função para login com Google
  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    try {
      await doSignInWithGoogle();
      setIsSigningIn(false);
      navigate('/profile'); // Navega após login com Google
    } catch (error) {
      setIsSigningIn(false);
      setErrorMessage('Google sign-in failed. Please try again.');
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para fechar o modal ao clicar fora dele
  const handleOutsideClick = (event) => {
    if (event.target.className === 'modal') {
      setIsModalOpen(false);
    }
  };

  // Se o usuário já está logado, redireciona para a página inicial
  if (userLoggedIn) {
    return <Navigate to={'/home'} replace={true} />;
  }

  return (
    <div>
      {/* Botão para abrir o modal */}
      <button onClick={() => setIsModalOpen(true)} style={{ width: 'auto' }}>
        Login
      </button>

      {/* O Modal */}
      {isModalOpen && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content animate">
            <div className="relative">
              <div className="flex justify-center">
                <span
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-2xl cursor-pointer"
                  title="Close Modal"
                >
                  &times;
                </span>
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-3/12 rounded-full"
                />
              </div>
            </div>

            <div className="container">
              <form onSubmit={onSubmit}>
                <label htmlFor="uname">
                  <b>Username</b>
                </label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  name="uname"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="psw">
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  name="psw"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>
                  <input type="checkbox" defaultChecked name="remember" />{' '}
                  Remember me
                </label>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}{' '}
                {/* Exibe erro de autenticação */}
                <button type="submit" disabled={isSigningIn}>
                  Acessar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginModal;

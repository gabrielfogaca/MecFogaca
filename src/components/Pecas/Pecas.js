import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext'; // Importar o contexto de autenticação
import NovaPeca from './NovaPeca';
import PecasCadastradas from './PecasCadastradas';

function Pecas() {
  const { userLoggedIn } = useAuth(); // Obter estado de autenticação
  const [isNovaPecaOpen, setIsNovaPecaOpen] = useState(false); // Controle do modal
  const [pecaParaEditar, setPecaParaEditar] = useState(null); // Peça para edição

  // Função para abrir o modal de cadastro de nova peça
  const handleNovaPecaClick = () => {
    setPecaParaEditar(null); // Garantir que o modal seja usado para criação
    setIsNovaPecaOpen(true); // Abrir modal
  };

  // Função para abrir o modal para editar uma peça existente
  const handleEditPeca = (peca) => {
    setPecaParaEditar(peca); // Definir peça a ser editada
    setIsNovaPecaOpen(true); // Abrir modal
  };

  // Função para fechar o modal
  const handleCloseNovaPeca = () => {
    setIsNovaPecaOpen(false); // Fechar modal
    setPecaParaEditar(null); // Limpar peça de edição ao fechar
  };

  if (!userLoggedIn) {
    return <p>Você precisa estar logado para acessar esta página.</p>;
  }

  return (
    <div className="flex flex-row gap-4">
      <div className="basis-full">
        {/* Botão para abrir o modal de criação de nova peça */}
        <button
          onClick={handleNovaPecaClick}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          + Nova Peça
        </button>

        {/* Componente que exibe as peças cadastradas */}
        <PecasCadastradas onEdit={handleEditPeca} />

        {/* Modal para criar ou editar uma peça */}
        {isNovaPecaOpen && (
          <NovaPeca peca={pecaParaEditar} onClose={handleCloseNovaPeca} />
        )}
      </div>
    </div>
  );
}

export default Pecas;

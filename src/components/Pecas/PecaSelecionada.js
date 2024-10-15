import React, { useState, useEffect } from 'react';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import NovaPeca from './NovaPeca'; // Supondo que haja um componente para editar peças

const PecasCard = ({ pecas }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const db = getFirestore();
  const auth = getAuth();

  // Função para abrir o modo de edição
  const handleEditPeca = () => {
    setIsEditing(true);
  };

  // Função para abrir a confirmação de exclusão
  const handleDeletePeca = () => {
    setShowDeleteConfirmation(true);
  };

  // Função para confirmar exclusão da peça
  const confirmDeletePeca = async () => {
    if (!pecas || !pecas.uid) {
      toast.error('Peça não encontrada para exclusão.');
      return;
    }

    try {
      const pecaRef = doc(db, 'peca', pecas.uid); // Usando o UID da peça
      await deleteDoc(pecaRef);

      toast.success('Peça excluída com sucesso!');
      // Lógica para atualizar a lista de peças, se necessário
    } catch (error) {
      toast.error('Erro ao excluir peça.');
      console.error('Erro ao excluir peça: ', error);
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  // Função para cancelar exclusão
  const cancelDeletePeca = () => {
    setShowDeleteConfirmation(false);
  };

  // Função para calcular o preço de venda
  const calcularPrecoVenda = (precoCompra, precoFrete) => {
    const compra = parseFloat(precoCompra) || 0;
    const frete = parseFloat(precoFrete) || 0;
    return (compra + frete) * 1.2;
  };

  if (!pecas) {
    return (
      <div role="status" className="flex items-start justify-center h-screen">
        <div className="mt-10">
          <div className="flex items-center justify-center w-96 h-96 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
              Veja os detalhes da Peça clicando no botão "Ver Detalhes"...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto p-6 border border-gray-200 rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Detalhes da Peça
        </h2>
        <div className="space-x-2">
          <button
            onClick={handleEditPeca}
            className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
          >
            Editar
          </button>
          <button
            onClick={handleDeletePeca}
            className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Excluir
          </button>
        </div>
      </div>

      {isEditing ? (
        <NovaPeca peca={pecas} onClose={() => setIsEditing(false)} />
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {pecas.nome || 'Não disponível'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preço de Compra
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              R$ {parseFloat(pecas.precoCompra).toFixed(2) || 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preço do Frete
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              R$ {parseFloat(pecas.precoFrete).toFixed(2) || 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preço de Venda
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              R${' '}
              {calcularPrecoVenda(pecas.precoCompra, pecas.precoFrete).toFixed(
                2,
              )}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantidade em Estoque
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {pecas.estoque || 'N/A'}
            </p>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Deseja realmente excluir esta peça?
            </h3>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={confirmDeletePeca}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
              >
                Confirmar
              </button>
              <button
                onClick={cancelDeletePeca}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PecasCard;

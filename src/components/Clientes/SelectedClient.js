import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import CardOrcamento from './CardOrcamento';
import NovoCliente from './NovoCliente';
import { toast } from 'react-toastify';

const ClientCard = ({ client }) => {
  const [selectedOrcamento, setSelectedOrcamento] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Configuração do Firebase
  const db = getFirestore();
  const auth = getAuth();

  // Função para buscar orçamentos do Firestore
  const fetchOrcamentos = async () => {
    if (!client || !client.cpfcnpj) return;

    try {
      setLoading(true);
      const orcamentosRef = collection(db, 'orcamento');
      const q = query(orcamentosRef, where('cpfcnpj', '==', client.cpfcnpj));
      const querySnapshot = await getDocs(q);
      const orcamentosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrcamentos(orcamentosData);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Efetuar autenticação e buscar orçamentos quando o componente é montado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchOrcamentos();
      } else {
        console.log('Usuário não autenticado.');
      }
    });

    return () => unsubscribe();
  }, [auth, client]);

  // Função para selecionar um orçamento e exibir o modal
  const handleOrcamentoClick = (id) => {
    const orcamentoSelecionado = orcamentos.find(
      (orcamento) => orcamento.id === id,
    );
    setSelectedOrcamento(orcamentoSelecionado);
    setShowModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrcamento(null);
  };

  // Função para abrir o modo de edição
  const handleEditClient = () => {
    setIsEditing(true);
  };

  // Função para abrir a confirmação de exclusão
  const handleDeleteClient = () => {
    setShowDeleteConfirmation(true);
  };

  // Função para confirmar exclusão do cliente
  const confirmDeleteClient = async () => {
    try {
      await deleteDoc(doc(db, 'cliente', client.id));
      toast.success('Cliente excluído com sucesso!');
      // Adicione aqui a lógica para atualizar a lista de clientes se necessário
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast.error('Erro ao excluir cliente.');
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  // Função para cancelar exclusão
  const cancelDeleteClient = () => {
    setShowDeleteConfirmation(false);
  };

  if (!client) {
    return (
      <div role="status" className="flex items-start justify-center h-screen">
        <div className="mt-10">
          <div className="flex items-center justify-center w-96 h-96 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
              Veja os detalhes do Cliente clicando no botão "Ver Detalhes"...
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
          Detalhes do Cliente
        </h2>
        <div className="space-x-2">
          <button
            onClick={handleEditClient}
            className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
          >
            Editar
          </button>
          <button
            onClick={handleDeleteClient}
            className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Excluir
          </button>
        </div>
      </div>

      {isEditing ? (
        <NovoCliente cliente={client} onClose={() => setIsEditing(false)} />
      ) : (
        <div className="space-y-4">
          {/* Detalhes do Cliente */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome Completo
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {client.nome || 'Não disponível'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              CPF/CNPJ
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {client.cpfcnpj || 'Não disponível'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Carro
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {client.carro || 'Não disponível'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Placa
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {client.placa || 'Não disponível'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Data de Nascimento
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {client.dataNascimento || 'Não disponível'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cidade
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {client.cidade || 'Não disponível'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Telefone 1
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {client.telefone1 || 'Não disponível'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Telefone 2
            </h3>
            <p className="text-gray-900 dark:text-gray-100">
              {client.telefone2 || 'Não disponível'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Orçamentos
            </h3>
            {loading ? (
              <p>Carregando orçamentos...</p>
            ) : (
              <ul className="list-disc pl-5 text-gray-900 dark:text-gray-100">
                {orcamentos.length > 0 ? (
                  orcamentos.map((orcamento) => (
                    <li key={orcamento.id}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">Valor: </span>
                          {orcamento.ValorAvista} -
                          <span className="font-semibold"> Data: </span>
                          {orcamento.dataOrcamento}
                          <button
                            onClick={() => handleOrcamentoClick(orcamento.id)}
                            className="ml-2 text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                          >
                            Visualizar Orçamento / Pedido
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>Não disponível</li>
                )}
              </ul>
            )}
          </div>

          {/* Modal de Orçamento */}
          {showModal && selectedOrcamento && (
            <CardOrcamento
              orcamento={selectedOrcamento}
              onClose={handleCloseModal}
            />
          )}

          {/* Modal de Confirmação de Exclusão */}
          {showDeleteConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Deseja realmente excluir este cliente?
                </h3>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={confirmDeleteClient}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={cancelDeleteClient}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientCard;

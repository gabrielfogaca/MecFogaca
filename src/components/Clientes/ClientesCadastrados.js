import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext'; // Importar o contexto de autenticação
import { collection, onSnapshot } from 'firebase/firestore'; // Importar funções do Firestore
import { db } from '../../firebase/firebase'; // Importar o db do Firebase
import ClientCard from './SelectedClient';

const Cadastrados = () => {
  const { userLoggedIn } = useAuth(); // Obter estado de autenticação
  const [clientData, setClientData] = useState([]); // Estado para armazenar dados dos clientes
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (userLoggedIn) {
      // Função para buscar clientes e orçamentos do Firestore
      const unsubscribeClients = onSnapshot(
        collection(db, 'cliente'),
        async (clientsSnapshot) => {
          try {
            // Buscar clientes
            const clients = clientsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              orcamentos: [], // Inicialmente, orçamentos vazios
            }));

            // Buscar orçamentos
            const orcamentosSnapshot = await onSnapshot(
              collection(db, 'orcamento'),
              (orcamentosSnapshot) => {
                const orcamentos = orcamentosSnapshot.docs.map((doc) =>
                  doc.data(),
                );

                // Associar orçamentos aos clientes
                const updatedClients = clients.map((client) => {
                  // Filtrar orçamentos que correspondem ao cliente atual
                  const clientOrcamentos = orcamentos.filter(
                    (orcamento) => orcamento.cpfcnpj === client.cpfcnpj,
                  );
                  return {
                    ...client,
                    orcamentos: clientOrcamentos,
                  };
                });

                setClientData(updatedClients);
              },
            );

            // Cleanup function to unsubscribe from the listener
            return () => {
              unsubscribeClients();
              orcamentosSnapshot(); // Unsubscribe from orcamentos listener
            };
          } catch (error) {
            console.error('Erro ao buscar clientes e orçamentos:', error);
          }
        },
      );

      // Cleanup function to unsubscribe from the listener
      return () => {
        unsubscribeClients();
      };
    }
  }, [userLoggedIn]);

  // Filtra os clientes pelo nome ou pela placa
  const filteredClients = clientData.filter(
    (client) =>
      client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.placa.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Redireciona para a página de login se o usuário não estiver autenticado
  if (!userLoggedIn) {
    return <p>Você precisa estar logado para acessar esta página.</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Lista de Clientes */}
      <div className="flex-1 p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow dark:divide-gray-700 md:p-6 dark:border-gray-700">
        {/* Campo de busca */}
        <div className="w-full lg:w-1/3 p-4">
          <input
            type="text"
            placeholder="Buscar por nome ou placa"
            className="p-2 border border-gray-300 rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredClients.map((client, index) => (
          <div key={index} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-x-4 flex-1">
              <div className="h-12 w-12 flex-none rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-black">
                  {client.nome}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  CPF/CNPJ: {client.cpfcnpj}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Carro: {client.carro}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Placa: {client.placa}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cidade: {client.cidade}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Telefone: {client.telefone1}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="ml-4 px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 w-48 max-w-[10%]"
              onClick={() => setSelectedClient(client)}
            >
              Ver Detalhes
            </button>
          </div>
        ))}
      </div>

      {/* Detalhes do Cliente */}
      <div className="flex-none w-full lg:w-1/3 p-4">
        <ClientCard client={selectedClient} />
      </div>
    </div>
  );
};

export default Cadastrados;

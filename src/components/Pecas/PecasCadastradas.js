import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext'; // Importar o contexto de autenticação
import { collection, onSnapshot } from 'firebase/firestore'; // Importar funções do Firestore
import { db } from '../../firebase/firebase'; // Importar o db do Firebase
import PecasCard from './PecaSelecionada'; // Certifique-se de que o caminho está correto

const PecasCadastradas = () => {
  const { userLoggedIn } = useAuth(); // Obter estado de autenticação
  const [pecasData, setPecasData] = useState([]); // Estado para armazenar dados das peças
  const [selectedPeca, setSelectedPeca] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para armazenar o termo de busca

  // Função para calcular o preço de venda
  const calcularPrecoVenda = (precoCompra, precoFrete) => {
    // Certificar que ambos os valores são números antes de fazer o cálculo
    const compra = parseFloat(precoCompra) || 0;
    const frete = parseFloat(precoFrete) || 0;
    return (compra + frete) * 1.2; // 20% acima do total
  };

  useEffect(() => {
    if (userLoggedIn) {
      // Função para buscar peças em tempo real
      const unsubscribe = onSnapshot(collection(db, 'peca'), (snapshot) => {
        const pecas = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPecasData(pecas);
      });

      // Limpar o listener quando o componente for desmontado
      return () => unsubscribe();
    }
  }, [userLoggedIn]);

  // Função para filtrar as peças com base no termo de busca
  const filteredPecas = pecasData.filter((peca) =>
    peca.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Redireciona para a página de login se o usuário não estiver autenticado
  if (!userLoggedIn) {
    return <p>Você precisa estar logado para acessar esta página.</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow dark:divide-gray-700 md:p-6 dark:border-gray-700">
        {/* Campo de busca */}
        <div className="w-full lg:w-1/3 p-4">
          <input
            type="text"
            placeholder="Buscar por nome da peça"
            className="p-2 border border-gray-300 rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredPecas.map((peca) => (
          <div key={peca.id} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-x-4 flex-1">
              <div className="h-12 w-12 flex-none rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-black">
                  {peca.nome}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Preço de Compra: R${' '}
                  {peca.precoCompra
                    ? parseFloat(peca.precoCompra).toFixed(2)
                    : 'N/A'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Preço do Frete: R${' '}
                  {peca.precoFrete
                    ? parseFloat(peca.precoFrete).toFixed(2)
                    : 'N/A'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Preço de Venda: R${' '}
                  {calcularPrecoVenda(
                    peca.precoCompra,
                    peca.precoFrete,
                  ).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Quantidade em Estoque: {peca.estoque || 'N/A'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="ml-4 px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 w-24 max-w-[10%]"
              onClick={() => setSelectedPeca(peca)}
            >
              Ver Detalhes
            </button>
          </div>
        ))}
      </div>
      <div className="flex-none w-full lg:w-1/3 p-4">
        <PecasCard pecas={selectedPeca} />
      </div>
    </div>
  );
};

export default PecasCadastradas;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import DateSelect from './DateSelect';

const DespesasCadastradas = () => {
  const { userLoggedIn } = useAuth();
  const [despesaData, setDespesaData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDespesa, setSelectedDespesa] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    if (userLoggedIn) {
      const unsubscribeDespesas = onSnapshot(
        collection(db, 'despesa'),
        (despesasSnapshot) => {
          try {
            const despesas = despesasSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setDespesaData(despesas);
          } catch (error) {
            console.error('Erro ao buscar despesas:', error);
          }
        },
      );

      return () => {
        unsubscribeDespesas();
      };
    }
  }, [userLoggedIn]);

  const handleDelete = async (despesaId) => {
    try {
      await deleteDoc(doc(db, 'despesa', despesaId));
      setDespesaData((prevData) =>
        prevData.filter((despesa) => despesa.id !== despesaId),
      );
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
    }
  };

  const filteredDespesas = despesaData.filter((despesa) => {
    const matchesSearchTerm =
      despesa.informacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      despesa.valor.toString().toLowerCase().includes(searchTerm.toLowerCase());

    const [year, month] = despesa.data.split('-');
    const matchesSelectedMonthYear =
      (!selectedMonth || parseInt(month) === selectedMonth) &&
      (!selectedYear || parseInt(year) === selectedYear);

    return matchesSearchTerm && matchesSelectedMonthYear;
  });

  const handleDateSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  if (!userLoggedIn) {
    return <p>Você precisa estar logado para acessar esta página.</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow dark:divide-gray-700 md:p-6 dark:border-gray-700">
        <div className="flex gap-4 w-full lg:w-2/3 p-4">
          <input
            type="text"
            placeholder="Buscar por informação ou valor"
            className="p-2 border border-gray-300 rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DateSelect onDateSelect={handleDateSelect} />
        </div>
        {filteredDespesas.map((despesa, index) => (
          <div key={index} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-x-4 flex-1">
              <div className="h-12 w-12 flex-none rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-black">
                  {despesa.informacao}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Tipo: {despesa.tipo}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Valor: R$ {despesa.valor}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Data: {despesa.data}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                onClick={() => setSelectedDespesa(despesa)}
              >
                Ver Detalhes
              </button>
              <button
                type="button"
                className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
                onClick={() => handleDelete(despesa.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detalhes da Despesa */}
      <div className="flex-none w-full lg:w-1/3 p-4">
        {selectedDespesa ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detalhes da Despesa
            </h3>
            <p className="text-sm text-gray-900 dark:text-gray-400">
              Informação: {selectedDespesa.informacao}
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-400">
              Tipo: {selectedDespesa.tipo}
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-400">
              Valor: R$ {selectedDespesa.valor}
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-400">
              Data: {selectedDespesa.data}
            </p>
          </div>
        ) : (
          <div role="status" className="flex items-start justify-center">
            <div className="w-96 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <div className="px-3 py-1 text-xs font-medium text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                Veja os detalhes das Despesas clicando no botão "Ver
                Detalhes"...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DespesasCadastradas;

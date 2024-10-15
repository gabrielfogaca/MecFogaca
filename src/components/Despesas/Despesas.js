import React, { useState } from 'react';
import NovaDespesa from './NovaDespesa';
import DespesasCadastradas from './DespesasCadastradas';

function Despesas() {
  const [isNovaDespesaOpen, setIsNovaDespesaOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  // Função para abrir o modal de NovaDespesa
  const handleNovaDespesaClick = () => {
    setIsNovaDespesaOpen(true);
  };

  // Função para fechar o modal de NovaDespesa
  const handleCloseNovaDespesa = () => {
    setIsNovaDespesaOpen(false);
  };

  // Função para atualizar mês e ano selecionados
  const handleDateSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <div className="flex flex-row gap-4">
      <div className="basis-full">
        {/* Botão para abrir o modal de NovaDespesa */}
        <button
          onClick={handleNovaDespesaClick}
          className="block mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          + Nova Despesa
        </button>

        {/* Exibe as despesas do mês e ano selecionados */}
        <DespesasCadastradas />

        {/* Modal para adicionar nova despesa */}
        {isNovaDespesaOpen && <NovaDespesa onClose={handleCloseNovaDespesa} />}
      </div>
    </div>
  );
}

export default Despesas;

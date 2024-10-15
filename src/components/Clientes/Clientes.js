import React, { useState } from 'react';
import NovoCliente from './NovoCliente';
import Cadastrados from './ClientesCadastrados';

function Clientes() {
  // Estados para controlar o modal e o cliente a ser editado
  const [isNovoClienteOpen, setIsNovoClienteOpen] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);

  // Função para abrir o modal para criar um novo cliente
  const handleNovoClienteClick = () => {
    setClienteParaEditar(null); // Garante que o modal seja usado para criação
    setIsNovoClienteOpen(true); // Abre o modal
  };

  // Função para abrir o modal para editar um cliente existente
  const handleEditCliente = (cliente) => {
    setClienteParaEditar(cliente); // Define o cliente a ser editado
    setIsNovoClienteOpen(true); // Abre o modal
  };

  // Função para fechar o modal
  const handleCloseNovoCliente = () => {
    setIsNovoClienteOpen(false); // Fecha o modal
    setClienteParaEditar(null); // Limpa o cliente para edição ao fechar
  };

  return (
    <div className="flex flex-row gap-4">
      <div className="basis-full">
        {/* Botão para abrir o modal de criação de novo cliente */}
        <button
          onClick={handleNovoClienteClick}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          + Novo Cliente
        </button>

        {/* Componente que exibe os clientes cadastrados */}
        <Cadastrados />

        {/* Modal para criar ou editar um cliente */}
        {isNovoClienteOpen && (
          <NovoCliente
            cliente={clienteParaEditar}
            onClose={handleCloseNovoCliente}
          />
        )}
      </div>
    </div>
  );
}

export default Clientes;

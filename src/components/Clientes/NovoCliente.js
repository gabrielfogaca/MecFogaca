import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext'; // Contexto de autenticação
import { db } from '../../firebase/firebase'; // Conexão com o Firestore
import { doc, setDoc } from 'firebase/firestore'; // Funções do Firestore para adicionar/editar documentos
import { ToastContainer, toast, Bounce } from 'react-toastify'; // Biblioteca de notificações
import 'react-toastify/dist/ReactToastify.css'; // Estilos para o Toastify
import { v4 as uuidv4 } from 'uuid'; // Importar função para gerar UUID

const NovoCliente = ({ cliente, onClose }) => {
  // Estado para gerenciar os dados do formulário
  const uid = uuidv4();
  const [formData, setFormData] = useState({
    uid,
    nome: '',
    cpfcnpj: '',
    carro: '',
    cidade: '',
    dataNascimento: '',
    telefone1: '',
    telefone2: '',
    endereco: '',
    placa: '',
    dataDoCadastro: new Date().toLocaleDateString('pt-BR'),
    numero: 0,
  });

  const { currentUser } = useAuth(); // Usuário autenticado

  // Atualiza os dados do formulário se um cliente for passado para edição
  useEffect(() => {
    if (cliente) {
      setFormData(cliente);
    }
  }, [cliente]);

  // Função para gerenciar as alterações nos campos do formulário
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Função para gerenciar o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se o usuário está autenticado
    if (!currentUser) {
      toast.error('Você precisa estar autenticado para cadastrar um cliente', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
      return;
    }

    try {
      // Referência ao documento do cliente no Firestore usando o UID como identificador
      const clienteRef = doc(db, 'cliente', formData.uid);

      // Salva os dados do cliente no Firestore
      await setDoc(clienteRef, formData);

      // Notifica o usuário sobre o sucesso da operação
      if (cliente) {
        toast.success('Cliente atualizado com sucesso!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        });
      } else {
        toast.success('Cliente cadastrado com sucesso!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        });
      }

      onClose(); // Fecha o modal ao salvar com sucesso
    } catch (error) {
      console.error('Erro ao salvar cliente: ', error);

      // Notifica o usuário sobre o erro na operação
      toast.error('Erro ao cadastrar o Cliente!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Cabeçalho do modal */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {cliente ? 'Editar Cliente' : 'Cadastro de novo Cliente'}
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="text-white bg-gray-500 hover:bg-gray-600 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            >
              <span>X</span>
            </button>
          </div>

          {/* Corpo do modal com o formulário */}
          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  CPF/CNPJ
                </label>
                <input
                  type="text"
                  name="cpfcnpj"
                  value={formData.cpfcnpj}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Digite o CPF/CNPJ"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Carro
                </label>
                <input
                  type="text"
                  name="carro"
                  value={formData.carro}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Digite o modelo do carro"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Digite sua cidade"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Endereço, nº
                </label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Digite o endereço"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Placa do Carro
                </label>
                <input
                  type="text"
                  name="placa"
                  value={formData.placa}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Digite a placa do carro"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Telefone 1
                </label>
                <input
                  type="tel"
                  name="telefone1"
                  value={formData.telefone1}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Digite seu telefone principal"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Telefone 2 (opcional)
                </label>
                <input
                  type="tel"
                  name="telefone2"
                  value={formData.telefone2}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Digite seu telefone secundário"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {cliente ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </button>
          </form>
        </div>
      </div>

      {/* Container para as notificações */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        transition={Bounce}
        closeButton={false}
      />
    </>
  );
};

export default NovoCliente;

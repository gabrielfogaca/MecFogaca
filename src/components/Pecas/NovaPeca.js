import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext'; // Importar o contexto de autenticação
import { db } from '../../firebase/firebase'; // Importar o db do Firebase
import { doc, setDoc } from 'firebase/firestore'; // Importar funções do Firestore
import { v4 as uuidv4 } from 'uuid'; // Importar função para gerar UUID
import { toast, ToastContainer, Bounce } from 'react-toastify'; // Importar o Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos do Toastify
import { useNavigate } from 'react-router-dom'; // Importar o hook para navegação

const NovaPeca = ({ peca, onClose }) => {
  const { currentUser } = useAuth(); // Obter estado de autenticação
  const navigate = useNavigate(); // Hook para navegação
  const uid = uuidv4();

  const [formData, setFormData] = useState({
    uid,
    nome: '',
    precoCompra: '',
    precoFrete: '',
    estoque: '',
    dataDoCadastro: new Date().toLocaleDateString('pt-BR'),
  });

  // Atualiza os dados do formulário se uma peça for passada para edição
  useEffect(() => {
    if (peca) {
      setFormData(peca);
    }
  }, [peca]);

  // Função para gerenciar as alterações nos campos do formulário
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar se o usuário está autenticado
    if (!currentUser) {
      toast.error('Você precisa estar autenticado para cadastrar uma peça', {
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
      // Referência ao documento da peça no Firestore usando o UID como identificador
      const pecaRef = doc(db, 'peca', formData.uid);

      // Salvar ou atualizar os dados da peça no Firestore
      await setDoc(pecaRef, formData);

      // Notificar o usuário sobre o sucesso da operação
      if (peca) {
        toast.success('Peça atualizada com sucesso!', {
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
        toast.success('Peça cadastrada com sucesso!', {
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

      // Limpar os campos do formulário e fechar o modal
      setFormData({
        uid: uuidv4(),
        nome: '',
        precoCompra: '',
        precoFrete: '',
        estoque: '',
        dataDoCadastro: new Date().toLocaleDateString('pt-BR'),
      });
      onClose(); // Fecha o modal ao salvar com sucesso
    } catch (error) {
      console.error('Erro ao cadastrar peça: ', error);
      toast.error('Erro ao cadastrar a peça!', {
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
              {peca ? 'Editar Peça' : 'Cadastro de nova Peça'}
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
                  Nome da Peça
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Digite o nome da peça"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Preço de Compra
                </label>
                <input
                  type="number"
                  name="precoCompra"
                  value={formData.precoCompra}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Digite o preço de compra"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Preço do Frete
                </label>
                <input
                  type="number"
                  name="precoFrete"
                  value={formData.precoFrete}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Digite o preço do frete"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Estoque
                </label>
                <input
                  type="number"
                  name="estoque"
                  value={formData.estoque}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Digite a quantidade em estoque"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {peca ? 'Salvar Alterações' : 'Cadastrar Peça'}
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

export default NovaPeca;

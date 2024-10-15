import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { db } from '../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const NovaDespesas = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [despesaData, setDespesaData] = useState({
    uid: uuidv4(),
    informacao: '',
    valor: '',
    tipo: 'DespesasGerais',
    data: '',
  });

  const handleInputChange = (e) => {
    setDespesaData({
      ...despesaData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Você precisa estar autenticado para cadastrar uma despesa', {
        position: 'top-center',
        autoClose: 5000,
        theme: 'colored',
        transition: Bounce,
      });
      return;
    }

    try {
      const despesaRef = doc(db, 'despesa', despesaData.uid);
      await setDoc(despesaRef, despesaData);

      toast.success('Despesa cadastrada com sucesso!', {
        position: 'top-center',
        autoClose: 5000,
        theme: 'colored',
        transition: Bounce,
      });

      onClose();
    } catch (error) {
      console.error('Erro ao salvar despesa: ', error);
      toast.error('Erro ao cadastrar a despesa!', {
        position: 'top-center',
        autoClose: 5000,
        theme: 'colored',
        transition: Bounce,
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cadastro de Despesa
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="text-white bg-gray-500 hover:bg-gray-600 rounded-lg text-sm w-8 h-8"
            >
              X
            </button>
          </div>
          <form className="p-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Informação
              </label>
              <input
                type="text"
                name="informacao"
                value={despesaData.informacao}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                placeholder="Descrição da despesa"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Valor (R$)
              </label>
              <input
                type="number"
                name="valor"
                value={despesaData.valor}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                placeholder="Valor da despesa"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Tipo
              </label>
              <select
                name="tipo"
                value={despesaData.tipo}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
              >
                <option value="DespesasGerais">Despesas Gerais</option>
                <option value="CompraDePeças">Compra de Peças</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Data
              </label>
              <input
                type="date"
                name="data"
                value={despesaData.data}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5"
            >
              Salvar Despesa
            </button>
          </form>
        </div>
      </div>
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

export default NovaDespesas;

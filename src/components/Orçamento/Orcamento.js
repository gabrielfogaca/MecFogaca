import React, { useState, useEffect } from 'react';
import './OrderForm.css';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import logo1 from './imagens/logomf.jpg';
import logo2 from './imagens/logomg.jpg';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { db } from '../../firebase/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (name, selectedName, theme) => ({
  fontWeight:
    selectedName.indexOf(name) === -1
      ? theme.typography.fontWeightRegular
      : theme.typography.fontWeightMedium,
});

function Orcamento() {
  const [currentDate, setCurrentDate] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [clientData, setClientData] = useState([]);
  const [selectedPecas, setSelectedPecas] = useState([]);
  const [pecasData, setPecasData] = useState([]);
  const [tipo, setTipo] = useState(1); // Default to "Orçamento"
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR');
    setCurrentDate(formattedDate);
  }, []);

  // Fetch clients from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cliente'), (snapshot) => {
      const clients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientData(clients);
    });

    return () => unsubscribe();
  }, []);

  // Fetch pieces from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'peca'), (snapshot) => {
      const pecas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        uid: doc.data().uid || doc.id,
      }));
      setPecasData(pecas);
    });

    return () => unsubscribe();
  }, []);

  const handleClientChange = (e) => {
    const client = clientData.find((client) => client.nome === e.target.value);
    setSelectedClient(client);
  };

  const handlePecaChange = (e, index) => {
    const selectedPeca = pecasData.find((peca) => peca.nome === e.target.value);
    if (selectedPeca) {
      const updatedPecas = [...selectedPecas];
      updatedPecas[index] = {
        ...selectedPeca,
        quantidade: selectedPecas[index]?.quantidade || 1,
      };
      setSelectedPecas(updatedPecas);
    }
  };

  const handleQuantityChange = (e, index) => {
    const updatedPecas = [...selectedPecas];
    updatedPecas[index].quantidade = Number(e.target.value);
    setSelectedPecas(updatedPecas);
  };

  const handleRemovePeca = (index) => {
    const updatedPecas = selectedPecas.filter((_, i) => i !== index);
    setSelectedPecas(updatedPecas);
  };

  const handleAddPeca = () => {
    if (selectedPecas.some((peca) => !peca.nome || !peca.uid)) {
      toast.error('Por favor, selecione uma peça antes de adicionar outra.', {
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
    const newPeca = { nome: '', quantidade: 1, uid: null };
    setSelectedPecas([...selectedPecas, newPeca]);
  };

  const printPage = () => {
    const elementsToHide = document.querySelectorAll('.no-print');
    elementsToHide.forEach((element) => element.classList.add('hidden'));
    window.print();
    elementsToHide.forEach((element) => element.classList.remove('hidden'));
  };

  // Handle tipo change
  const handleTipoChange = (e) => {
    setTipo(Number(e.target.value));
  };

  // Function to save the budget/order
  const handleSaveOrcamento = async () => {
    if (!selectedClient || selectedPecas.length === 0) {
      toast.error('Por favor, selecione um cliente e pelo menos uma peça.', {
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

    const incompletePecas = selectedPecas.filter((peca) => !peca.uid);
    if (incompletePecas.length > 0) {
      toast.error(
        'Por favor, selecione uma peça válida para todas as linhas.',
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        },
      );
      return;
    }

    // Se for pedido, verificar o estoque
    if (tipo === 0) {
      // Tipo 0 é Pedido
      for (const peca of selectedPecas) {
        const pecaDocRef = doc(db, 'peca', peca.uid);
        const pecaDocSnap = await getDoc(pecaDocRef);

        if (pecaDocSnap.exists()) {
          const pecaData = pecaDocSnap.data();
          if (pecaData.estoque < peca.quantidade) {
            toast.error(
              `Estoque insuficiente para a peça: ${peca.nome}. Quantidade disponível: ${pecaData.estoque}`,
              {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Bounce,
              },
            );
            return; // Interromper se o estoque não for suficiente
          }
        }
      }

      // Se todas as peças tiverem estoque suficiente, criar o pedido e diminuir o estoque
      for (const peca of selectedPecas) {
        const pecaDocRef = doc(db, 'peca', peca.uid);
        const pecaDocSnap = await getDoc(pecaDocRef);
        const novaQuantidade = pecaDocSnap.data().estoque - peca.quantidade;

        await updateDoc(pecaDocRef, {
          estoque: novaQuantidade,
        });
      }

      toast.success('Pedido gerado e estoque atualizado com sucesso!', {
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

    // Se for orçamento ou pedido (após verificar o estoque), salvar no banco de dados
    const valorParcelado = selectedPecas.reduce((acc, peca) => {
      const precoCompra = Number(peca.precoCompra) || 0;
      const precoFrete = Number(peca.precoFrete) || 0;
      const precoUnitario = precoCompra + precoFrete;
      return acc + precoUnitario * 1.45 * (peca.quantidade || 1);
    }, 0);

    const valorAvista = selectedPecas.reduce((acc, peca) => {
      const precoCompra = Number(peca.precoCompra) || 0;
      const precoFrete = Number(peca.precoFrete) || 0;
      const precoUnitario = precoCompra + precoFrete;
      return acc + precoUnitario * 1.2 * (peca.quantidade || 1);
    }, 0);

    const orcamentoData = {
      ValorAvista: parseFloat(valorAvista.toFixed(2)),
      ValorParcelado: parseFloat(valorParcelado.toFixed(2)),
      carro: selectedClient.carro,
      cidade: selectedClient.cidade,
      cpfcnpj: selectedClient.cpfcnpj,
      dataOrcamento: currentDate,
      endereco: selectedClient.endereco,
      nome: selectedClient.nome,
      placa: selectedClient.placa || '',
      telefone1: selectedClient.telefone1 || '',
      tipo: tipo, // Define se é Orçamento ou Pedido
      uidUser: selectedClient.cpfcnpj,
      pecas: {},
    };

    selectedPecas.forEach((peca, index) => {
      orcamentoData.pecas[`peca${index + 1}`] = {
        uid: peca.uid,
        nome: peca.nome,
        precoCompra: peca.precoCompra,
        precoFrete: peca.precoFrete,
        quantidade: peca.quantidade,
      };
    });

    try {
      await addDoc(collection(db, 'orcamento'), orcamentoData);
      toast.success('Orçamento/Pedido salvo com sucesso!', {
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
      setSelectedClient('');
      setSelectedPecas([]);
      setTipo(1); // Resetar para "Orçamento"
    } catch (error) {
      console.error('Erro ao salvar o orçamento/pedido:', error);
      toast.error('Ocorreu um erro ao salvar o orçamento/pedido.', {
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
    <div className="order-form">
      {/* Cabeçalho da página */}
      <header className="header flex items-center justify-center">
        <div className="flex flex-col items-center">
          <img src={logo1} alt="" className="w-60 mb-4" />
          <img src={logo2} alt="" className="w-60 mb-4" />
        </div>
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold mb-2">
            OFICINA ESPECIALIZADA EM SISTEMA
          </h2>
          <h2 className="text-2xl font-bold mb-2">
            COMMON RAIL E SOLDAS ESPECIAIS
          </h2>
          <p>Rua Miguel Capssa, 58, Assis Brasil - Ijuí/RS</p>
          <p>Fone: 55 99928-7017 / 55 99235-5642</p>
        </div>
      </header>

      {/* Corpo principal */}
      <main className="main">
        <div className="header-info">
          <div className="options">
            <label>
              <input
                type="radio"
                name="tipo"
                value="0"
                checked={tipo === 0}
                onChange={handleTipoChange}
              />
              <span className="ml-4">Pedido</span>
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name="tipo"
                value="1"
                checked={tipo === 1}
                onChange={handleTipoChange}
              />
              <span className="ml-4">Orçamento</span>
            </label>
          </div>
          <p className="date">Data: {currentDate}</p>
        </div>

        {/* Seleção de cliente */}
        <FormControl sx={{ m: 1, width: 450 }}>
          <InputLabel className="no-print" id="select-client-label">
            Selecione o Cliente
          </InputLabel>
          <Select
            labelId="select-client-label"
            id="select-client"
            value={selectedClient?.nome || ''}
            className="no-print"
            onChange={handleClientChange}
            input={<OutlinedInput label="Selecione o Cliente" />}
            MenuProps={MenuProps}
          >
            <MenuItem value="">
              <em>+ Selecione um cliente</em>
            </MenuItem>
            {clientData.map((client) => (
              <MenuItem
                key={client.id}
                value={client.nome}
                style={getStyles(
                  client.nome,
                  selectedClient?.nome || '',
                  theme,
                )}
              >
                {client.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Dados do cliente */}
        <div className="client-info-container rounded border-1 border-black mb-2">
          {selectedClient && (
            <table className="client-info-table">
              <tbody>
                <tr>
                  <th>Nome</th>
                  <td>{selectedClient.nome}</td>
                </tr>
                <tr>
                  <th>Endereço</th>
                  <td>{selectedClient.endereco}</td>
                </tr>
                <tr>
                  <th>Carro</th>
                  <td>{selectedClient.carro}</td>
                </tr>
                <tr>
                  <th>Cidade</th>
                  <td>{selectedClient.cidade}</td>
                </tr>
                <tr>
                  <th>CPF/CNPJ</th>
                  <td>{selectedClient.cpfcnpj}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Seleção de peças */}
        <table>
          <thead>
            <tr>
              <th>Qnt.</th>
              <th>Descrição do Produto/Serviço</th>
              <th>Valor Unitário</th>
              <th>Total</th>
              <th className="no-print">Ação</th>
            </tr>
          </thead>
          <tbody>
            {selectedPecas.map((peca, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="number"
                    value={peca?.quantidade || 1}
                    min="1"
                    onChange={(e) => handleQuantityChange(e, index)}
                  />
                </td>
                <td>
                  <FormControl sx={{ m: 1, width: 750 }}>
                    <InputLabel
                      className="no-print no-print-produto"
                      id={`select-peca-${index}-label`}
                    >
                      Selecione a Peça
                    </InputLabel>
                    <Select
                      className="no-print-produto"
                      labelId={`select-peca-${index}-label`}
                      id={`select-peca-${index}`}
                      value={peca?.nome || ''}
                      onChange={(e) => handlePecaChange(e, index)}
                      input={<OutlinedInput label="Selecione a Peça" />}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="">
                        <em>Selecione uma peça</em>
                      </MenuItem>
                      {pecasData.map((pecaData) => (
                        <MenuItem
                          key={pecaData.id}
                          value={pecaData.nome}
                          style={getStyles(
                            pecaData.nome,
                            peca?.nome || '',
                            theme,
                          )}
                        >
                          {pecaData.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </td>
                <td>
                  {peca.precoCompra !== undefined &&
                  peca.precoFrete !== undefined
                    ? `R$ ${(
                        (Number(peca.precoCompra || 0) +
                          Number(peca.precoFrete || 0)) *
                        1.2
                      ).toFixed(2)}`
                    : ''}
                </td>
                <td>
                  {peca.precoCompra !== undefined &&
                  peca.precoFrete !== undefined &&
                  peca.quantidade
                    ? `R$ ${(
                        (Number(peca.precoCompra || 0) +
                          Number(peca.precoFrete || 0)) *
                        1.2 *
                        Number(peca.quantidade)
                      ).toFixed(2)}`
                    : ''}
                </td>
                <td className="no-print">
                  <Button
                    onClick={() => handleRemovePeca(index)}
                    variant="contained"
                    startIcon={<DeleteIcon />}
                  >
                    Remover
                  </Button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="5" className="no-print">
                <Button
                  type="button"
                  variant="contained"
                  color="success"
                  onClick={handleAddPeca}
                  className="no-print"
                >
                  + Adicionar Peça ao Pedido/Orçamento
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </main>

      {/* Rodapé */}
      <footer className="footer">
        <div>
          <div className="header-info">
            <div className="options">
              <p>
                PARCELADO:
                {/* PARCELADO: R${' '}
                {selectedPecas
                  .reduce((acc, peca) => {
                    const precoUnitario =
                      (Number(peca.precoCompra || 0) +
                        Number(peca.precoFrete || 0)) *
                      1.45;
                    return acc + precoUnitario * (peca.quantidade || 1);
                  }, 0)
                  .toFixed(2)}{' '}
                em até 10X SEM JUROS */}
              </p>
            </div>
            <div>
              <p>
                À VISTA: R${' '}
                {selectedPecas
                  .reduce((acc, peca) => {
                    const precoUnitario =
                      (Number(peca.precoCompra || 0) +
                        Number(peca.precoFrete || 0)) *
                      1.2;
                    return acc + precoUnitario * (peca.quantidade || 1);
                  }, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
          <br />
          <p>Assinatura: ___________________________</p>
        </div>

        <div className="relative container space-x-4 no-print">
          {/* Botões de ações */}
          <Button
            variant="contained"
            color="primary"
            className="w-40"
            onClick={printPage}
          >
            Imprimir
          </Button>
          <Button
            variant="contained"
            className="w-72"
            onClick={handleSaveOrcamento}
            disabled={
              !selectedClient ||
              selectedPecas.length === 0 ||
              selectedPecas.some((peca) => !peca.uid)
            }
          >
            Salvar Orçamento/Pedido
          </Button>
        </div>
      </footer>
      {/* Toast Container */}
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
    </div>
  );
}

export default Orcamento;

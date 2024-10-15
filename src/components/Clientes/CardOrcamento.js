// src/CardOrcamento.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Snackbar,
  Alert,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../../firebase/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'; // Funções para atualizar e deletar documentos
import logo1 from './imagens/logomf.jpg';
import logo2 from './imagens/logomg.jpg';

const CardOrcamento = ({ orcamento, onClose, onDelete }) => {
  const currentDate = new Date().toLocaleDateString();

  // Estados para gerenciar tipo, dados do orçamento, snackbar e confirmação de exclusão
  const [tipo, setTipo] = useState(orcamento.tipo || 0);
  const [dadosOrcamento, setDadosOrcamento] = useState({ ...orcamento });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false); // Para indicar operações em andamento

  // Manipulador para alterar o tipo
  const handleTipoChange = (event) => {
    const novoTipo = Number(event.target.value);
    setTipo(novoTipo);
    setDadosOrcamento((prev) => ({ ...prev, tipo: novoTipo }));
  };

  // Manipulador para salvar as alterações no Firestore
  const handleSave = async () => {
    setLoading(true);
    try {
      // Verifique se o orçamento possui um ID
      if (!orcamento.id) {
        throw new Error('ID do orçamento não encontrado.');
      }

      // Referência ao documento específico na coleção "orcamento"
      const orcamentoRef = doc(db, 'orcamento', orcamento.id);

      // Atualiza o documento com os dados modificados
      await updateDoc(orcamentoRef, dadosOrcamento);

      setSnackbar({
        open: true,
        message: 'Orçamento/Pedido salvo com sucesso!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Erro ao salvar o orçamento/pedido: ', error);
      setSnackbar({
        open: true,
        message: 'Ocorreu um erro ao salvar. Tente novamente.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  // Manipulador para abrir o diálogo de confirmação de exclusão
  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  // Manipulador para confirmar a exclusão
  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      if (!orcamento.id) {
        throw new Error('ID do orçamento não encontrado.');
      }

      const orcamentoRef = doc(db, 'orcamento', orcamento.id);
      await deleteDoc(orcamentoRef);

      setSnackbar({
        open: true,
        message: 'Orçamento/Pedido excluído com sucesso!',
        severity: 'success',
      });

      if (onDelete) {
        onDelete(orcamento.id); // Opcional: Notifica o componente pai sobre a exclusão
      }
    } catch (error) {
      console.error('Erro ao excluir o orçamento/pedido: ', error);
      setSnackbar({
        open: true,
        message: 'Ocorreu um erro ao excluir. Tente novamente.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      setConfirmDelete(false);
      onClose();
    }
  };

  // Manipulador para cancelar a exclusão
  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  // Manipulador para fechar o Snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={!!orcamento} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>Orçamento / Pedido</DialogTitle>
        <DialogContent dividers>
          <div className="order-form">
            {/* Cabeçalho da página */}
            <header className="header flex items-center justify-center">
              <div className="flex flex-col items-center">
                <img src={logo1} alt="Logo 1" className="w-60 mb-4" />
                <img src={logo2} alt="Logo 2" className="w-60 mb-4" />
              </div>
              <div className="flex flex-col items-center text-center">
                <Typography variant="h5" component="h2" gutterBottom>
                  OFICINA ESPECIALIZADA EM SISTEMA
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  COMMON RAIL E SOLDAS ESPECIAIS
                </Typography>
                <Typography variant="body1">
                  Rua Miguel Capssa, 58, Assis Brasil - Ijuí/RS
                </Typography>
                <Typography variant="body1">
                  Fone: 55 99928-7017 / 55 99235-5642
                </Typography>
              </div>
            </header>

            {/* Corpo principal */}
            <main className="main">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                my={2}
              >
                <FormControl component="fieldset">
                  <FormLabel component="legend">Tipo</FormLabel>
                  <RadioGroup
                    row
                    aria-label="tipo"
                    name="tipo"
                    value={tipo}
                    onChange={handleTipoChange}
                  >
                    <FormControlLabel
                      value={0}
                      control={<Radio />}
                      label="Pedido"
                    />
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label="Orçamento"
                    />
                  </RadioGroup>
                </FormControl>
                <Typography variant="body1">
                  Data: {orcamento.dataOrcamento || currentDate}
                </Typography>
              </Box>

              {/* Dados do cliente */}
              <div className="client-info-container rounded border-1 border-black mb-2">
                <table className="client-info-table w-full">
                  <tbody>
                    <tr>
                      <th className="text-left px-2 py-1">Nome</th>
                      <td className="px-2 py-1">
                        {orcamento.nome || 'Não disponível'}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-left px-2 py-1">Endereço</th>
                      <td className="px-2 py-1">
                        {orcamento.endereco || 'Não disponível'}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-left px-2 py-1">Carro</th>
                      <td className="px-2 py-1">
                        {orcamento.carro || 'Não disponível'}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-left px-2 py-1">Cidade</th>
                      <td className="px-2 py-1">
                        {orcamento.cidade || 'Não disponível'}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-left px-2 py-1">CPF/CNPJ</th>
                      <td className="px-2 py-1">
                        {orcamento.cpfcnpj || 'Não disponível'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Seleção de peças */}
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Qnt.</th>
                    <th className="border px-2 py-1">
                      Descrição do Produto/Serviço
                    </th>
                    <th className="border px-2 py-1">Valor Unitário</th>
                    <th className="border px-2 py-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosOrcamento.pecas &&
                  Object.values(dadosOrcamento.pecas).length > 0 ? (
                    Object.values(dadosOrcamento.pecas).map((peca, index) => (
                      <tr key={index}>
                        <td className="border px-2 py-1">{peca.quantidade}</td>
                        <td className="border px-2 py-1">
                          {peca.nome || 'Peça não especificada'}
                        </td>
                        <td className="border px-2 py-1">
                          {(
                            (Number(peca.precoCompra || 0) +
                              Number(peca.precoFrete || 0)) *
                            1.2 *
                            Number(peca.quantidade)
                          ).toFixed(2)}
                        </td>
                        <td className="border px-2 py-1">
                          {peca.precoCompra !== undefined &&
                          peca.precoFrete !== undefined &&
                          peca.quantidade
                            ? `R$ ${(
                                (Number(peca.precoCompra) +
                                  Number(peca.precoFrete)) *
                                1.2 *
                                Number(peca.quantidade)
                              ).toFixed(2)}`
                            : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border px-2 py-1" colSpan="4">
                        Nenhuma peça disponível
                      </td>
                    </tr>
                  )}
                  {/* Linha para valores totais */}
                  <tr>
                    <td
                      className="border px-2 py-1 font-bold text-right"
                      colSpan="3"
                    >
                      Total À Vista
                    </td>
                    <td className="border px-2 py-1 font-bold">
                      R$
                      {dadosOrcamento.ValorAvista
                        ? dadosOrcamento.ValorAvista.toFixed(2)
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="border px-2 py-1 font-bold text-right"
                      colSpan="3"
                    >
                      Total Parcelado
                    </td>
                    <td className="border px-2 py-1 font-bold">
                      R$
                      {dadosOrcamento.ValorParcelado
                        ? dadosOrcamento.ValorParcelado.toFixed(2)
                        : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </main>

            {/* Rodapé */}
            <footer className="footer">
              <div className="relative container space-x-4 no-print">
                <Button
                  variant="contained"
                  color="primary"
                  className="w-72"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading
                    ? 'Salvando...'
                    : `Salvar ${tipo === 1 ? 'Orçamento' : 'Pedido'}`}
                </Button>
              </div>
            </footer>
          </div>
        </DialogContent>
        {/* Botão de exclusão no canto superior direito */}
        <IconButton
          aria-label="delete"
          onClick={handleDeleteClick}
          sx={{
            position: 'absolute',
            height: 40,
            width: 50,
            right: 0,
            top: 8,
            color: (theme) => theme.palette.error.main,
          }}
        >
          <DeleteIcon />
        </IconButton>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog
        open={confirmDelete}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography id="confirm-delete-description">
            Tem certeza de que deseja excluir este orçamento/pedido? Essa ação
            não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CardOrcamento;

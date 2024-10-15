import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import DateSelect from './DateSelect';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function Fechamento() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [compras, setCompras] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [vendas, setVendas] = useState(0);
  const [dataFetched, setDataFetched] = useState(false);

  const fetchData = async (month, year) => {
    console.log('Iniciando fetchData com mês:', month, 'e ano:', year);

    if (dataFetched || !month || !year) return;

    try {
      const despesasQuery = query(collection(db, 'despesa'));
      const despesasSnapshot = await getDocs(despesasQuery);
      let totalCompras = 0;
      let totalDespesas = 0;

      despesasSnapshot.docs.forEach((doc) => {
        const despesa = doc.data();
        const dataDespesa = despesa.data;

        if (dataDespesa) {
          const [despYear, despMonth] = dataDespesa.split('-').map(Number);

          if (despMonth === month && despYear === year) {
            const valorDespesa = Number(despesa.valor) || 0;

            if (despesa.tipo === 'CompraDePeças') {
              totalCompras += valorDespesa;
            } else if (despesa.tipo === 'DespesasGerais') {
              totalDespesas += valorDespesa;
            }
          }
        }
      });

      setCompras(totalCompras);
      setDespesas(totalDespesas);

      // Pedidos (orçamentos com tipo igual a 0)
      const pedidosSnapshot = await getDocs(
        query(collection(db, 'orcamento'), where('tipo', '==', 0)),
      );

      const orcamentos = pedidosSnapshot.docs
        .map((doc) => {
          const dataOrcamento = doc.data().dataOrcamento;
          const [dia, mes, ano] = dataOrcamento.split('/').map(Number);

          return { ...doc.data(), dia, mes, ano };
        })
        .filter(
          (orcamento) => orcamento.mes === month && orcamento.ano === year,
        );

      const totalVendas = orcamentos.reduce((acc, pedido) => {
        return acc + Number(pedido.ValorAvista || 0);
      }, 0);

      setVendas(totalVendas);
      setDataFetched(true);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchData(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  const handleDateSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setDataFetched(false);
  };

  const totalDespesas = despesas + compras; // Valor total de despesas (X)
  const totalPedidos = vendas; // Valor total de pedidos (Y)
  const resultadoFinal = totalPedidos - totalDespesas; // Resultado final do mês (Z)

  const data = {
    labels: ['Compra de Peças', 'Despesas', 'Pedidos'],
    datasets: [
      {
        label: 'R$',
        data: [compras, despesas, vendas],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Fechamento de ${selectedMonth}/${selectedYear}`,
      },
    },
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h1>Fechamento</h1>
      <DateSelect onDateSelect={handleDateSelect} />
      <div style={{ width: '500px', height: '300px' }}>
        {compras > 0 || despesas > 0 || vendas > 0 ? (
          <Bar options={options} data={data} />
        ) : (
          <p>Selecione um mês e ano para visualizar os dados.</p>
        )}
      </div>
      <div>
        <p>
          Valor total de Despesas:
          <span style={{ color: 'red' }}> R$ {totalDespesas.toFixed(2)}</span>
        </p>
        <p>
          Valor total de Pedidos:
          <span style={{ color: 'green' }}> R$ {totalPedidos.toFixed(2)}</span>
        </p>
        <p>
          Resultado final do mês:
          <span style={{ color: resultadoFinal >= 0 ? 'green' : 'red' }}>
            R$ {resultadoFinal.toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Fechamento;

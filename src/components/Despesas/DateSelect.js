import React, { useState } from 'react';
import { MenuItem, FormControl, Select, InputLabel } from '@mui/material';

function DateSelect({ onDateSelect }) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const years = Array.from(
    { length: 8 },
    (_, index) => new Date().getFullYear() - 1 + index,
  );

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    onDateSelect(month, selectedYear); // Envia o mês e ano ao Fechamento
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    onDateSelect(selectedMonth, year); // Envia o mês e ano ao Fechamento
  };

  return (
    <div>
      {/* Seletor de Mês */}
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="month-select-label">Mês</InputLabel>
        <Select
          labelId="month-select-label"
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
          label="Mês"
        >
          {months.map((month, index) => (
            <MenuItem key={index} value={index + 1}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Seletor de Ano */}
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="year-select-label">Ano</InputLabel>
        <Select
          labelId="year-select-label"
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
          label="Ano"
        >
          {years.map((year, index) => (
            <MenuItem key={index} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default DateSelect;

import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrencyINR } from '../../utils/currency.js';

function IncomeExpenseChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `₹${value / 1000}k`} />
        <Tooltip formatter={(value) => formatCurrencyINR(value)} />
        <Legend iconType="circle" />
        <Line type="monotone" dataKey="income" stroke="#22C55E" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default IncomeExpenseChart;

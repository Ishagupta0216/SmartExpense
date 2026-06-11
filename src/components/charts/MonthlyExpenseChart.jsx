import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrencyINR } from '../../utils/currency.js';

function MonthlyExpenseChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `₹${value / 1000}k`} />
        <Tooltip formatter={(value) => formatCurrencyINR(value)} cursor={{ fill: '#f4f3ff' }} />
        <Bar dataKey="expenses" fill="#6C63FF" radius={[12, 12, 4, 4]} barSize={34} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyExpenseChart;

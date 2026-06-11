import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrencyINR } from '../../utils/currency.js';
import styles from './CategoryPieChart.module.css';

const colors = ['#6C63FF', '#22C55E', '#EF4444', '#F59E0B', '#111827'];

function CategoryPieChart({ data }) {
  return (
    <div className={styles.wrap}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrencyINR(value)} />
        </PieChart>
      </ResponsiveContainer>
      <div className={styles.legend}>
        {data.map((item, index) => (
          <div key={item.name}>
            <span style={{ background: colors[index % colors.length] }} />
            <p>{item.name}</p>
            <strong>{formatCurrencyINR(item.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPieChart;

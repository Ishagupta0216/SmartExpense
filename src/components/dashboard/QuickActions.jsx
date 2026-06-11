import React from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp } from 'lucide-react';
import styles from './QuickActions.module.css';

const actions = [
  { label: 'Add Expense', icon: Plus, tone: 'primary', handler: 'onAddExpense' },
  { label: 'Add Income', icon: TrendingUp, tone: 'success', handler: 'onAddIncome' },
];

function QuickActions({ onAddExpense, onAddIncome }) {
  const handlers = { onAddExpense, onAddIncome };

  return (
    <motion.section className={styles.card} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, delay: 0.08 }}>
      <h3>Quick Actions</h3>
      <div className={styles.grid}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              type="button"
              className={`${styles.action} ${styles[action.tone]}`}
              onClick={handlers[action.handler]}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={18} />
              <span>{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}

export default QuickActions;

import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/currency.js';
import styles from './BudgetProgress.module.css';

function BudgetProgress({ budget, onSetBudget }) {
  const progress = budget.monthly > 0 ? Math.min(Math.round((budget.spent / budget.monthly) * 100), 100) : 0;

  return (
    <motion.section className={styles.card} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} transition={{ duration: 0.3 }}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <Target size={20} />
        </div>
        <div>
          <h3>Monthly Budget</h3>
          <p>{formatCurrencyINR(budget.monthly)}</p>
        </div>
      </div>
      <div className={styles.progressMeta}>
        <span>Amount Spent {formatCurrencyINR(budget.spent)}</span>
        <strong>{progress}%</strong>
      </div>
      <div className={styles.track}>
        <div style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.footer}>
        <div>
          <span>Remaining Budget</span>
          <strong>{formatCurrencyINR(budget.remaining)}</strong>
        </div>
        <button type="button" onClick={onSetBudget}>
          Set Budget
        </button>
      </div>
    </motion.section>
  );
}

export default BudgetProgress;

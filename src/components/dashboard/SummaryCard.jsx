import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, IndianRupee } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/currency.js';
import styles from './SummaryCard.module.css';

function SummaryCard({ label, value, delta, tone, index = 0 }) {
  const positive = !delta.startsWith('-');

  return (
    <motion.article
      className={`${styles.card} ${styles[tone]}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.28, delay: index * 0.06 }}
    >
      <div className={styles.icon}>
        <IndianRupee size={20} />
      </div>
      <div>
        <p>{label}</p>
        <h2>{formatCurrencyINR(value)}</h2>
      </div>
      <span className={`${styles.delta} ${positive ? styles.good : styles.bad}`}>
        {positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {delta}
      </span>
    </motion.article>
  );
}

export default SummaryCard;

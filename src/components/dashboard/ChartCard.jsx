import React from 'react';
import { motion } from 'framer-motion';
import styles from './ChartCard.module.css';

function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <motion.section className={`${styles.card} ${className}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}>
      <div className={styles.header}>
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      <div className={styles.body}>{children}</div>
    </motion.section>
  );
}

export default ChartCard;

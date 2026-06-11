import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, LayoutDashboard, Sparkles, WalletCards } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Transactions', icon: WalletCards, to: '/transactions' },
];

function Sidebar({ collapsed, onToggle }) {
  return (
    <motion.aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`} animate={{ width: collapsed ? 88 : 260 }} transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Sparkles size={20} />
        </div>
        <span>SmartExpense</span>
      </div>
      <nav className={styles.nav}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.label} to={item.to} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <button className={styles.toggle} onClick={onToggle} aria-label="Toggle sidebar">
        <ChevronLeft size={18} />
      </button>
    </motion.aside>
  );
}

export default Sidebar;

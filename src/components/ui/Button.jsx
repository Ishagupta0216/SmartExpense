import React from 'react';
import styles from './Button.module.css';

function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;

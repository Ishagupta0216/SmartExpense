import React, { useId } from 'react';
import styles from './Input.module.css';

function Input({ label, ...props }) {
  const inputId = useId();

  return (
    <div className={styles.field}>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} {...props} />
    </div>
  );
}

export default Input;

import React from 'react';
import styles from './FilterDropdown.module.css';

function FilterDropdown({ value, onChange, options, label = 'Filter options' }) {
  return (
    <select className={styles.select} value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default FilterDropdown;

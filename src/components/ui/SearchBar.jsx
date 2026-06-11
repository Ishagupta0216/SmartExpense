import React from 'react';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

function SearchBar({ value, onChange, placeholder, label = placeholder }) {
  return (
    <label className={styles.search}>
      <Search size={17} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={label} />
    </label>
  );
}

export default SearchBar;

import React, { useEffect, useId, useState } from 'react';
import { transactionCategories } from '../../data/transactions.js';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import styles from './TransactionForm.module.css';

function getEmptyForm(defaultType = 'Expense') {
  return {
    date: new Date().toISOString().slice(0, 10),
    category: defaultType === 'Income' ? 'Income' : 'Food',
    description: '',
    amount: '',
    type: defaultType,
  };
}

function TransactionForm({ transaction, defaultType = 'Expense', onSubmit, onCancel }) {
  const [form, setForm] = useState(() => getEmptyForm(defaultType));
  const typeId = useId();
  const categoryId = useId();

  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date,
        category: transaction.category,
        description: transaction.description,
        amount: String(transaction.amount),
        type: transaction.type,
      });
      return;
    }

    setForm(getEmptyForm(defaultType));
  }, [defaultType, transaction]);

  function updateField(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === 'type' && value === 'Income') {
        next.category = 'Income';
      }

      if (field === 'type' && value === 'Expense' && current.category === 'Income') {
        next.category = 'Food';
      }

      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
  }

  const availableCategories = form.type === 'Income' ? ['Income'] : transactionCategories.filter((category) => category !== 'Income');

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.twoColumn}>
        <div className={styles.field}>
          <label htmlFor={typeId}>Type</label>
          <select id={typeId} value={form.type} onChange={(event) => updateField('type', event.target.value)}>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>
        <Input label="Date" type="date" value={form.date} onChange={(event) => updateField('date', event.target.value)} required />
      </div>

      <div className={styles.field}>
        <label htmlFor={categoryId}>Category</label>
        <select id={categoryId} value={form.category} onChange={(event) => updateField('category', event.target.value)}>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <Input label="Description" value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Example: Swiggy dinner order" required />
      <Input label="Amount" type="number" min="1" value={form.amount} onChange={(event) => updateField('amount', event.target.value)} placeholder="450" required />

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{transaction ? 'Save Changes' : 'Add Transaction'}</Button>
      </div>
    </form>
  );
}

export default TransactionForm;

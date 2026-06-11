import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import TransactionForm from '../components/transactions/TransactionForm.jsx';
import TransactionTable from '../components/transactions/TransactionTable.jsx';
import Button from '../components/ui/Button.jsx';
import FilterDropdown from '../components/ui/FilterDropdown.jsx';
import Modal from '../components/ui/Modal.jsx';
import SearchBar from '../components/ui/SearchBar.jsx';
import { transactionCategories } from '../data/transactions.js';
import { useTransactions } from '../hooks/useTransactions.js';
import { formatCurrencyINR } from '../utils/currency.js';
import styles from './Transactions.module.css';

const categoryOptions = ['All', ...transactionCategories];
const sortOptions = ['Newest First', 'Oldest First', 'Amount High to Low', 'Amount Low to High'];

function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, isLoading, error } = useTransactions();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Newest First');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'Income') {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }

        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [transactions]);

  const visibleTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      const matchesCategory = category === 'All' || transaction.category === category;
      const searchText = `${transaction.category} ${transaction.description} ${transaction.type}`.toLowerCase();
      return matchesCategory && searchText.includes(query.toLowerCase());
    });

    return [...filtered].sort((first, second) => {
      if (sort === 'Oldest First') {
        return new Date(first.date) - new Date(second.date);
      }

      if (sort === 'Amount High to Low') {
        return second.amount - first.amount;
      }

      if (sort === 'Amount Low to High') {
        return first.amount - second.amount;
      }

      return new Date(second.date) - new Date(first.date);
    });
  }, [category, query, sort, transactions]);

  function openCreateModal() {
    setEditingTransaction(null);
    setModalOpen(true);
  }

  function openEditModal(transaction) {
    setEditingTransaction(transaction);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTransaction(null);
  }

  async function handleSubmit(form) {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, form);
      } else {
        await addTransaction(form);
      }

      closeModal();
      toast.success(editingTransaction ? 'Transaction updated' : 'Transaction added');
    } catch (submitError) {
      toast.error(submitError.message);
    }
  }

  function handleDelete(transactionId) {
    toast((toastInstance) => (
      <div className={styles.deleteToast}>
        <span>Delete this transaction?</span>
        <div>
          <button type="button" onClick={() => toast.dismiss(toastInstance.id)}>
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
              toast.dismiss(toastInstance.id);
              try {
                await deleteTransaction(transactionId);
                toast.success('Transaction deleted');
              } catch (deleteError) {
                toast.error(deleteError.message);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  }

  return (
    <motion.div className={styles.page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}>
      <section className={styles.header}>
        <div>
          <p>Transactions</p>
          <h2>Track every rupee with clarity.</h2>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={18} />
          Add Transaction
        </Button>
      </section>

      <section className={styles.stats}>
        <article>
          <span>Total Income</span>
          <strong>{formatCurrencyINR(totals.income)}</strong>
        </article>
        <article>
          <span>Total Expenses</span>
          <strong>{formatCurrencyINR(totals.expense)}</strong>
        </article>
        <article>
          <span>Net Flow</span>
          <strong>{formatCurrencyINR(totals.income - totals.expense)}</strong>
        </article>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3>All Transactions</h3>
            <p>{error || `${visibleTransactions.length} records found`}</p>
          </div>
          <div className={styles.controls}>
            <SearchBar value={query} onChange={setQuery} placeholder="Search transactions" label="Search transactions" />
            <FilterDropdown value={category} onChange={setCategory} options={categoryOptions} label="Filter transactions by category" />
            <FilterDropdown value={sort} onChange={setSort} options={sortOptions} label="Sort transactions" />
          </div>
        </div>
        <TransactionTable transactions={visibleTransactions} onEdit={openEditModal} onDelete={handleDelete} isLoading={isLoading} />
      </section>

      <Modal title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'} open={modalOpen} onClose={closeModal}>
        <TransactionForm transaction={editingTransaction} onSubmit={handleSubmit} onCancel={closeModal} />
      </Modal>
    </motion.div>
  );
}

export default Transactions;

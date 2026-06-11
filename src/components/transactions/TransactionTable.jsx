import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/currency.js';
import styles from './TransactionTable.module.css';

function TransactionTable({ transactions, onEdit, onDelete, isLoading = false }) {
  const hasActions = Boolean(onEdit || onDelete);
  const columnCount = hasActions ? 6 : 5;

  return (
    <div className={styles.tableWrap} aria-busy={isLoading}>
      <table className={styles.table}>
        <caption className={styles.caption}>Transaction history</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
            <th scope="col">Amount</th>
            <th scope="col">Type</th>
            {hasActions ? <th scope="col">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td colSpan={columnCount}>
                    <div className={styles.skeletonRow} />
                  </td>
                </tr>
              ))
            : transactions.map((transaction) => {
                const income = transaction.type === 'Income';
                return (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td>
                      <span className={styles.category}>{transaction.category}</span>
                    </td>
                    <td>{transaction.description}</td>
                    <td className={income ? styles.income : styles.expense}>{formatCurrencyINR(transaction.amount)}</td>
                    <td>
                      <span className={`${styles.type} ${income ? styles.incomeBadge : styles.expenseBadge}`}>
                        {income ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        {transaction.type}
                      </span>
                    </td>
                    {hasActions ? (
                      <td>
                        <div className={styles.actions}>
                          {onEdit ? (
                            <button onClick={() => onEdit(transaction)} aria-label={`Edit ${transaction.description}`}>
                              <Pencil size={15} />
                            </button>
                          ) : null}
                          {onDelete ? (
                            <button className={styles.delete} onClick={() => onDelete(transaction.id)} aria-label={`Delete ${transaction.description}`}>
                              <Trash2 size={15} />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
        </tbody>
      </table>
      {!isLoading && transactions.length === 0 ? (
        <div className={styles.empty} role="status">
          <strong>No transactions yet</strong>
          <span>Add your first income or expense to start tracking your money.</span>
        </div>
      ) : null}
    </div>
  );
}

export default TransactionTable;

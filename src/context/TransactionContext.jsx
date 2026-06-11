import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { supabase } from '../lib/supabase.js';

export const TransactionContext = createContext(null);

function normalizeTransaction(transaction) {
  return {
    id: transaction.id,
    date: transaction.date,
    category: transaction.category,
    description: transaction.description,
    amount: Number(transaction.amount),
    type: transaction.type,
  };
}

export function TransactionProvider({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchTransactions() {
      if (!user) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('id,date,category,description,amount,type')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (!isMounted) {
        return;
      }

      if (fetchError) {
        setError(fetchError.message);
        setTransactions([]);
      } else {
        setTransactions((data ?? []).map(normalizeTransaction));
      }

      setIsLoading(false);
    }

    fetchTransactions();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const addTransaction = useCallback(async (transaction) => {
    if (!user) {
      return;
    }

    const payload = {
      ...transaction,
      user_id: user.id,
      amount: Number(transaction.amount),
    };

    const { data, error: insertError } = await supabase.from('transactions').insert(payload).select('id,date,category,description,amount,type').single();

    if (insertError) {
      setError(insertError.message);
      throw insertError;
    }

    setTransactions((current) => [normalizeTransaction(data), ...current]);
  }, [user]);

  const updateTransaction = useCallback(async (transactionId, updates) => {
    if (!user) {
      return;
    }

    const payload = {
      ...updates,
      amount: Number(updates.amount),
    };

    const { data, error: updateError } = await supabase
      .from('transactions')
      .update(payload)
      .eq('id', transactionId)
      .eq('user_id', user.id)
      .select('id,date,category,description,amount,type')
      .single();

    if (updateError) {
      setError(updateError.message);
      throw updateError;
    }

    setTransactions((current) =>
      current.map((transaction) => (transaction.id === transactionId ? normalizeTransaction(data) : transaction)),
    );
  }, [user]);

  const deleteTransaction = useCallback(async (transactionId) => {
    if (!user) {
      return;
    }

    const { error: deleteError } = await supabase.from('transactions').delete().eq('id', transactionId).eq('user_id', user.id);

    if (deleteError) {
      setError(deleteError.message);
      throw deleteError;
    }

    setTransactions((current) => current.filter((transaction) => transaction.id !== transactionId));
  }, [user]);

  const value = useMemo(
    () => ({
      transactions,
      isLoading,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    }),
    [addTransaction, deleteTransaction, error, isLoading, transactions, updateTransaction],
  );

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}

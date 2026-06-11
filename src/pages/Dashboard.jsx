import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import BudgetProgress from '../components/dashboard/BudgetProgress.jsx';
import ChartCard from '../components/dashboard/ChartCard.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import SummaryCard from '../components/dashboard/SummaryCard.jsx';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart.jsx';
import MonthlyExpenseChart from '../components/charts/MonthlyExpenseChart.jsx';
import TransactionForm from '../components/transactions/TransactionForm.jsx';
import TransactionTable from '../components/transactions/TransactionTable.jsx';
import Button from '../components/ui/Button.jsx';
import FilterDropdown from '../components/ui/FilterDropdown.jsx';
import Input from '../components/ui/Input.jsx';
import Modal from '../components/ui/Modal.jsx';
import SearchBar from '../components/ui/SearchBar.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useTransactions } from '../hooks/useTransactions.js';
import { supabase } from '../lib/supabase.js';
import styles from './Dashboard.module.css';

const monthFormatter = new Intl.DateTimeFormat('en-IN', { month: 'short' });

function getMonthKey(date) {
  return new Date(date).toISOString().slice(0, 7);
}

function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return monthFormatter.format(new Date(year, month - 1, 1));
}

function Dashboard() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [budget, setBudget] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [isBudgetSaving, setIsBudgetSaving] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [defaultTransactionType, setDefaultTransactionType] = useState('Expense');
  const { user } = useAuth();
  const { transactions, addTransaction, isLoading } = useTransactions();

  const fetchBudget = useCallback(async () => {
    if (!user) {
      setBudget(null);
      return;
    }

    const { data, error } = await supabase.from('budgets').select('id,monthly_budget').eq('user_id', user.id).maybeSingle();

    if (error) {
      toast.error(error.message);
      return;
    }

    setBudget(data ? { id: data.id, monthlyBudget: Number(data.monthly_budget) } : null);
  }, [user]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  const dashboardData = useMemo(() => {
    const totals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'Income') {
          acc.income += transaction.amount;
        } else {
          acc.expenses += transaction.amount;
        }

        return acc;
      },
      { income: 0, expenses: 0 },
    );

    const savings = totals.income - totals.expenses;
    const monthlyBudget = budget?.monthlyBudget ?? 0;
    const remainingBudget = monthlyBudget > 0 ? Math.max(monthlyBudget - totals.expenses, 0) : 0;
    const categoryTotals = new Map();
    const monthlyTotals = new Map();

    transactions.forEach((transaction) => {
      const monthKey = getMonthKey(transaction.date);
      const currentMonth = monthlyTotals.get(monthKey) ?? { month: getMonthLabel(monthKey), income: 0, expenses: 0 };

      if (transaction.type === 'Income') {
        currentMonth.income += transaction.amount;
      } else {
        currentMonth.expenses += transaction.amount;
        categoryTotals.set(transaction.category, (categoryTotals.get(transaction.category) ?? 0) + transaction.amount);
      }

      monthlyTotals.set(monthKey, currentMonth);
    });

    const monthlyTrend = [...monthlyTotals.entries()]
      .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
      .map(([, value]) => value);

    return {
      budget: {
        monthly: monthlyBudget,
        spent: totals.expenses,
        remaining: remainingBudget,
      },
      budgetHealth: monthlyBudget > 0 ? Math.round((remainingBudget / monthlyBudget) * 100) : 0,
      categoryBreakdown: [...categoryTotals.entries()].map(([name, value]) => ({ name, value })),
      incomeExpenseTrend: monthlyTrend,
      monthlyExpenses: monthlyTrend.map(({ month, expenses }) => ({ month, expenses })),
      summaryMetrics: [
        {
          label: 'Total Balance',
          value: savings,
          delta: savings >= 0 ? '+0.0%' : '-0.0%',
          tone: 'primary',
        },
        {
          label: 'Monthly Income',
          value: totals.income,
          delta: '+0.0%',
          tone: 'success',
        },
        {
          label: 'Monthly Expenses',
          value: totals.expenses,
          delta: totals.expenses > 0 ? '-0.0%' : '+0.0%',
          tone: 'danger',
        },
        {
          label: 'Savings',
          value: savings,
          delta: savings >= 0 ? '+0.0%' : '-0.0%',
          tone: 'success',
        },
      ],
    };
  }, [budget, transactions]);

  const categories = useMemo(() => {
    const transactionCategories = transactions.map((transaction) => transaction.category);
    return ['All', ...new Set(transactionCategories)];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesCategory = category === 'All' || transaction.category === category;
      const searchText = `${transaction.category} ${transaction.description} ${transaction.type}`.toLowerCase();
      return matchesCategory && searchText.includes(query.toLowerCase());
    });
  }, [category, query, transactions]);

  function openBudgetModal() {
    setBudgetAmount(budget?.monthlyBudget ? String(budget.monthlyBudget) : '');
    setBudgetModalOpen(true);
  }

  function closeBudgetModal() {
    setBudgetModalOpen(false);
    setBudgetAmount('');
  }

  function openTransactionModal(type) {
    setDefaultTransactionType(type);
    setTransactionModalOpen(true);
  }

  function closeTransactionModal() {
    setTransactionModalOpen(false);
  }

  async function handleTransactionSubmit(form) {
    try {
      await addTransaction(form);
      closeTransactionModal();
      toast.success('Transaction added');
    } catch (submitError) {
      toast.error(submitError.message);
    }
  }

  async function handleBudgetSubmit(event) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const monthlyBudget = Number(budgetAmount);

    if (!Number.isFinite(monthlyBudget) || monthlyBudget < 0) {
      toast.error('Enter a valid monthly budget.');
      return;
    }

    setIsBudgetSaving(true);

    const { data, error } = await supabase
      .from('budgets')
      .upsert({ user_id: user.id, monthly_budget: monthlyBudget }, { onConflict: 'user_id' })
      .select('id,monthly_budget')
      .single();

    setIsBudgetSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setBudget({ id: data.id, monthlyBudget: Number(data.monthly_budget) });
    closeBudgetModal();
    toast.success('Budget saved');
  }

  return (
    <motion.div className={styles.dashboard} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}>
      <section className={styles.hero}>
        <div>
          <p>June overview</p>
          <h2>Your money, beautifully under control.</h2>
        </div>
        <div className={styles.heroActions}>
          <Button type="button" variant="secondary" onClick={openBudgetModal}>
            Set Budget
          </Button>
          <div className={styles.heroStats}>
            <span>Budget health</span>
            <strong>{dashboardData.budgetHealth}%</strong>
          </div>
        </div>
      </section>

      <section className={styles.summaryGrid}>
        {dashboardData.summaryMetrics.map((metric, index) => (
          <SummaryCard key={metric.label} index={index} {...metric} />
        ))}
      </section>

      <section className={styles.analyticsGrid}>
        <ChartCard title="Monthly Expense" subtitle="Spending trend across recent months">
          <MonthlyExpenseChart data={dashboardData.monthlyExpenses} />
        </ChartCard>
        <ChartCard title="Income vs Expense" subtitle="Cashflow stability at a glance">
          <IncomeExpenseChart data={dashboardData.incomeExpenseTrend} />
        </ChartCard>
      </section>

      <section className={styles.lowerGrid}>
        <div className={styles.leftColumn}>
          <ChartCard title="Category Wise Spend" subtitle="Where your money went this month">
            <CategoryPieChart data={dashboardData.categoryBreakdown} />
          </ChartCard>

          <section className={styles.transactionsCard}>
            <div className={styles.tableHeader}>
              <div>
                <h3>Recent Transactions</h3>
                <p>Search and filter your latest money movement</p>
              </div>
              <div className={styles.controls}>
                <SearchBar value={query} onChange={setQuery} placeholder="Search transactions" label="Search recent transactions" />
                <FilterDropdown value={category} onChange={setCategory} options={categories} label="Filter recent transactions by category" />
              </div>
            </div>
            <TransactionTable transactions={filteredTransactions.slice(0, 8)} isLoading={isLoading} />
          </section>
        </div>

        <aside className={styles.sideColumn}>
          <BudgetProgress budget={dashboardData.budget} onSetBudget={openBudgetModal} />
          <QuickActions onAddExpense={() => openTransactionModal('Expense')} onAddIncome={() => openTransactionModal('Income')} />
        </aside>
      </section>

      <Modal title={`Add ${defaultTransactionType}`} open={transactionModalOpen} onClose={closeTransactionModal}>
        <TransactionForm defaultType={defaultTransactionType} onSubmit={handleTransactionSubmit} onCancel={closeTransactionModal} />
      </Modal>

      <Modal title="Set Monthly Budget" open={budgetModalOpen} onClose={closeBudgetModal}>
        <form className={styles.budgetForm} onSubmit={handleBudgetSubmit}>
          <Input label="Monthly Budget" type="number" min="0" step="1" value={budgetAmount} onChange={(event) => setBudgetAmount(event.target.value)} placeholder="50000" required />
          <div className={styles.budgetActions}>
            <Button type="button" variant="secondary" onClick={closeBudgetModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isBudgetSaving}>
              {isBudgetSaving ? 'Saving...' : 'Save Budget'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}

export default Dashboard;

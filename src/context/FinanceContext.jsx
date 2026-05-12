import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children, user }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('finance_token');

  useEffect(() => {
    if (user && token) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTransactions(data);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transaction)
      });
      const newTransaction = await res.json();
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const updateTransaction = async (id, updatedData) => {
    // Note: Update route not implemented in backend yet, just updating local state for now
    setTransactions(prev => prev.map(t => t._id === id ? { ...t, ...updatedData } : t));
  };

  const summary = {
    balance: transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0),
    income: transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
    expense: transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  };

  return (
    <FinanceContext.Provider value={{ transactions, addTransaction, deleteTransaction, updateTransaction, summary, isLoading, user }}>
      {children}
    </FinanceContext.Provider>
  );
};

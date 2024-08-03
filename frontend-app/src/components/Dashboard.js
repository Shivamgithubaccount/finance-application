import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import { useNavigate, Link } from 'react-router-dom';
import { DELETE_TRANSACTION } from '../graphql/mutations';
import './styles/Dashboard.css';

const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('dateDesc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    update(cache, { data: { deleteTransaction } }) {
      const { transactions } = cache.readQuery({ query: GET_DASHBOARD_DATA });
      cache.writeQuery({
        query: GET_DASHBOARD_DATA,
        data: {
          transactions: transactions.filter(tx => tx.id !== deleteTransaction.id),
        },
      });
    },
    refetchQueries: [{ query: GET_DASHBOARD_DATA }],
  });

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const { totalBalance, totalIncome, totalExpenses, categories, transactions } = data;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const handleEdit = (id) => {
    navigate('/transactions/edit/${id}');
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction({ variables: { id } });
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  const handleSort = (transactions) => {
    return transactions.sort((a, b) => {
      if (sortOrder === 'amountAsc') return a.amount - b.amount;
      if (sortOrder === 'amountDesc') return b.amount - a.amount;
      if (sortOrder === 'dateAsc') return new Date(a.date) - new Date(b.date);
      return new Date(b.date) - new Date(a.date);
    });
  };

  const filteredTransactions = transactions
    .filter(tx => 
      (selectedCategory === 'All' || tx.category === selectedCategory) &&
      (
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.amount.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatDate(tx.date).includes(searchQuery.toLowerCase())
      ) &&
      (startDate === '' || new Date(tx.date) >= new Date(startDate)) &&
      (endDate === '' || new Date(tx.date) <= new Date(endDate))
    );

  const sortedTransactions = handleSort(filteredTransactions);

  const paginatedTransactions = sortedTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="dashboard-container">
      <header className="top-bar">
        <h1>Dashboard</h1>
        <div className="top-bar-buttons">
          <Link to="/transactions/add" className="button add-transaction-button">
            Add New Transaction
          </Link>
          <button onClick={handleLogout} className="button logout-button">
            Logout
          </button>
        </div>
      </header>
      <div className="balance-summary">
        <div className="balance-item">
          <h2>Total Balance</h2>
          <p>${totalBalance}</p>
        </div>
        <div className="balance-item">
          <h2>Income</h2>
          <p>${totalIncome}</p>
        </div>
        <div className="balance-item">
          <h2>Expenses</h2>
          <p>${totalExpenses}</p>
        </div>
      </div>
      <div className="categories-section">
        <h2>Categories</h2>
        <div className="category-list">
          {categories.map((category) => (
            <p key={category} className="category-item">{category}</p>
          ))}
        </div>
      </div>
      <div className="transaction-filter-section">
        <div className="filter-group">
          <label htmlFor="category-filter">Filter by Category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="search-query">Search</label>
          <input
            id="search-query"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="start-date">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="end-date">End Date</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="sort-order">Sort By</label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="dateDesc">Date (Newest First)</option>
            <option value="dateAsc">Date (Oldest First)</option>
            <option value="amountDesc">Amount (High to Low)</option>
            <option value="amountAsc">Amount (Low to High)</option>
          </select>
        </div>
      </div>
      <div className="transaction-list-section">
        <h2>Transaction List</h2>
        <div className="transaction-list">
          {paginatedTransactions.map((tx, index) => (
            <div key={tx.id} className="transaction-item">
              <p>
                <strong>{index + 1}. Category:</strong> {tx.category} <br/>
                <strong>Amount:</strong> ${tx.amount} <br/>
                <strong>Type:</strong> {tx.type} <br/>
                <strong>Date:</strong> {formatDate(tx.date)}
              </p>
              <div className="transaction-actions">
                <button onClick={() => handleEdit(tx.id)} className="button edit-button">
                  Edit
                </button>
                <button onClick={() => handleDelete(tx.id)} className="button delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
            Previous
          </button>
          <span>Page {page + 1}</span>
          <button onClick={() => setPage(page + 1)} disabled={paginatedTransactions.length < rowsPerPage}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
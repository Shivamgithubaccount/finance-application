import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Button, MenuItem, Select, FormControl, InputLabel, CircularProgress, IconButton, Paper, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const { totalBalance, totalIncome, totalExpenses, categories, transactions } = data;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const handleEdit = (id) => {
    navigate(`/transactions/edit/${id}`);
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

  const handleOpenModal = (transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedTransaction(null);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTransactions = sortedTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="lg" className="dashboard-container">
      <Box className="top-bar">
        <Typography variant="h4" component="h1">Dashboard</Typography>
        <Box className="top-bar-buttons">
          <Button
            component={Link}
            to="/transactions/add"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            className="add-transaction-button"
          >
            Add New Transaction
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            className="logout-button"
          >
            Logout
          </Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper className="balance-summary">
            <Typography variant="h6">Total Balance</Typography>
            <Typography variant="h4">${totalBalance}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={4}>
          <Paper className="balance-summary">
            <Typography variant="h6">Income</Typography>
            <Typography variant="h4">${totalIncome}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={4}>
          <Paper className="balance-summary">
            <Typography variant="h6">Expenses</Typography>
            <Typography variant="h4">${totalExpenses}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Paper className="categories-section">
        <Typography variant="h5">Categories</Typography>
        <Divider />
        <Box className="category-list">
          {categories.map((category) => (
            <Typography key={category} variant="body1" className="category-item">{category}</Typography>
          ))}
        </Box>
      </Paper>
      <Paper className="transaction-filter-section">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel htmlFor="category-filter">Filter by Category</InputLabel>
              <Select
                label="Filter by Category"
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Start Date"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="End Date"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel htmlFor="sort-order">Sort By</InputLabel>
              <Select
                label="Sort By"
                id="sort-order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value="dateDesc">Date (Newest First)</MenuItem>
                <MenuItem value="dateAsc">Date (Oldest First)</MenuItem>
                <MenuItem value="amountDesc">Amount (High to Low)</MenuItem>
                <MenuItem value="amountAsc">Amount (Low to High)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      <Paper className="transaction-list-section">
        <Typography variant="h5">Transaction List</Typography>
        <Divider />
        <Box className="transaction-list">
          {filteredTransactions.map((tx, index) => (
            <Box key={tx.id} className="transaction-item">
              <Typography variant="body1">
                <strong>{index + 1}. Category:</strong> {tx.category} <br/>
                <strong>Amount:</strong> ${tx.amount} <br/>
                <strong>Type:</strong> {tx.type} <br/>
                <strong>Date:</strong> {formatDate(tx.date)}
              </Typography>
              <Box className="transaction-actions">
                <IconButton color="primary" onClick={() => handleEdit(tx.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDelete(tx.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
      </Container>
  );
};

export default Dashboard;
     

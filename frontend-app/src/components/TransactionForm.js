import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TRANSACTION, UPDATE_TRANSACTION } from '../graphql/mutations';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import './styles/TransactionForm.css';

const TransactionForm = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('income'); 
  const navigate = useNavigate();
  const { id } = useParams(); 

  const { loading, data } = useQuery(GET_DASHBOARD_DATA);

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [{ query: GET_DASHBOARD_DATA }] 
  });

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION);

  useEffect(() => {
    if (id && data) {
      const transaction = data.transactions.find(tx => tx.id === id);
      if (transaction) {
        setDescription(transaction.description);
        setAmount(transaction.amount);
        setCategory(transaction.category);
        setType(transaction.type);
      }
    }
  }, [id, data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateTransaction({
          variables: { id, description, amount: parseFloat(amount), category, type },
        });
      } else {
         await addTransaction({
          variables: { description, amount: parseFloat(amount), category, type },
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };
  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) return <CircularProgress />;

  return (
    <div style={{width:"100%",height:"100%"}}>
    <div className="transaction-form-container">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="Salary">Salary</MenuItem>
            <MenuItem value="Rent">Rent</MenuItem>
            <MenuItem value="Groceries">Groceries</MenuItem>
            <MenuItem value="Utilities">Utilities</MenuItem>
            <MenuItem value="Entertainment">Entertainment</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"15px"}}><Button type="submit" variant="contained" color="primary" className="submit-button">Add</Button>
        <Button variant="contained" color="primary" className="submit-button" onClick={handleCancel}>Cancel</Button>
        </div>
      
      </form>
    </div>
    </div>
  );
};

export default TransactionForm;
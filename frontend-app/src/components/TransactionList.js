import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_DASHBOARD_DATA, GET_TRANSACTION } from '../graphql/queries';
import { ADD_TRANSACTION, UPDATE_TRANSACTION } from '../graphql/mutations';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import './styles/TransactionList.css'; 

const TransactionList = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_TRANSACTION, {
    variables: { id },
    skip: !id, 
  });

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [{ query: GET_DASHBOARD_DATA }],
  });

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: [{ query: GET_DASHBOARD_DATA }],
  });

  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (data && data.transaction) {
      const { description, amount, category, type } = data.transaction;
      setDescription(description);
      setAmount(amount);
      setCategory(category);
      setType(type);
    }
  }, [data]);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="transaction-form-container">
      <h2>Edit Transaction'</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"15px"}}><Button type="submit" variant="contained" color="primary" className="submit-button">Update</Button>
        <Button variant="contained" color="primary" className="submit-button" onClick={handleCancel}>Cancel</Button>
        </div>
      </form>
      
    </div>
  );
};

export default TransactionList;
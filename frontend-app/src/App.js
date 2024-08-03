import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import Dashboard from './components/Dashboard.js';
import TransactionList from './components/TransactionList.js';
import SignIn from './components/SignIn.js';
import SignUp from './components/SignUp.js';
import TransactionForm from './components/TransactionForm.js';


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path = "/signup" element={<SignUp/>}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions/edit/:id" element={<TransactionList />} />
          <Route path="/transactions/add" element={<TransactionForm />} />
          <Route path="/" element={<SignIn />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;

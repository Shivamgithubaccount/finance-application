const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    totalBalance: Float
    totalIncome: Float
    totalExpenses: Float
    categories: [String]
    getTransactions: [Transaction!]!
    getTransaction(id: ID!): Transaction
    transactions: [Transaction!]!
    transaction(id: ID!): Transaction
  }

  type Mutation {
    registerUser(username: String!, password: String!): AuthPayload
    loginUser(username: String!, password: String!): AuthPayload
    addTransaction(description: String!, amount: Float!, category: String!, type: String!): Transaction
    updateTransaction(id: ID!, description: String, amount: Float, category: String, type: String): Transaction
    deleteTransaction(id: ID!): Transaction
  }

  type Transaction {
    id: ID!
    description: String!
    amount: Float!
    category: String!
    type: String!
    date: String
  
    user: ID!
  }

  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    token: String!
  }
`;

module.exports = typeDefs;

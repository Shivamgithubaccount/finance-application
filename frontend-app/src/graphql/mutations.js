
import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $password: String!) {
    registerUser(username: $username, password: $password) {
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
    }
  }
`;

export const ADD_TRANSACTION = gql`
  mutation AddTransaction($description: String!, $amount: Float!, $category: String!, $type: String!) {
    addTransaction(description: $description, amount: $amount, category: $category, type: $type) {
      id
      description
      amount
      category
      type
    }
  }
`;



export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $description: String, $amount: Float, $category: String, $type: String) {
    updateTransaction(id: $id, description: $description, amount: $amount, category: $category, type: $type) {
      id
      description
      amount
      category
      type
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      id
    }
  }
`;


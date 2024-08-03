import { gql } from '@apollo/client';

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    totalBalance
    totalIncome
    totalExpenses
    categories
    transactions {
      id
      description
      amount
      category
      type
      date
      
      
    }
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($id: ID!) {
    transaction(id: $id) {
      id
      description
      amount
      category
      type
      
    }
  }
`;



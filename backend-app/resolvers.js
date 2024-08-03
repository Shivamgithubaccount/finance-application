const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

const SECRET = process.env.JWT_SECRET;

const resolvers = {
  Query: {
    async totalBalance(_, __, { user }) {
      if (!user) throw new Error('Not authenticated');
      
      const transactions = await Transaction.find({ user: user.id });
      
      let totalIncome = 0;
      let totalExpenses = 0;

      transactions.forEach(transaction => {
        if (transaction.type === 'income') {
          totalIncome += transaction.amount;
        } else if (transaction.type === 'expense') {
          totalExpenses += transaction.amount;
        }
      });

      const totalBalance = totalIncome - totalExpenses;
      return totalBalance;
    },
    async totalIncome(_, __, { user }) {
      if (!user) throw new Error('Not authenticated');
      const transactions = await Transaction.find({ user: user.id, type: 'income' });
      return transactions.reduce((acc, t) => acc + t.amount, 0);
    },
    async totalExpenses(_, __, { user }) {
      if (!user) throw new Error('Not authenticated');
      const transactions = await Transaction.find({ user: user.id, type: 'expense' });
      return transactions.reduce((acc, t) => acc + t.amount, 0);
    },
    getTransactions: async () => {
      return await Transaction.find();
    },
    getTransaction: async (_, { id }) => {
      return await Transaction.findById(id);
    },
    async categories() {
      return ['Salary', 'Rent', 'Groceries', 'Utilities', 'Entertainment'];
    },
    async transactions(_, __, { user }) {
      if (!user) throw new Error('Not authenticated');
      return await Transaction.find({ user: user.id });
    },
    async transaction(_, { id }, { user }) {
      if (!user) throw new Error('Not authenticated');
      return await Transaction.findById(id);
    }
  },
  Mutation: {
    async registerUser(_, { username, password }) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashedPassword });
      const token = jwt.sign({ userId: user.id }, SECRET);
      return { token };
    },
    async loginUser(_, { username, password }) {
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ userId: user.id }, SECRET);
      return { token };
    },
    async addTransaction(_, { description, amount, category, type }, { user }) {
      if (!user) throw new Error('Not authenticated');
      if (!type) throw new Error('Type is required');
      const newTransaction = new Transaction({
        description,
        amount,
        category,
        type,
        user: user.id
      });
      return await newTransaction.save();
    },
    async updateTransaction(_, { id, description, amount, category, type }) {
      console.log('Updating transaction with:', { id, description, amount, category, type });
      return await Transaction.findByIdAndUpdate(id, { description, amount, category, type }, { new: true });
    },
async deleteTransaction(_, { id }) {
  return await Transaction.findByIdAndDelete(id);
}
}
};

module.exports = resolvers;
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers.js');
const jwt = require('jsonwebtoken');


const SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('MONGO_URI:', process.env.MONGO_URI);


if (!SECRET) {
  console.error('Error: JWT_SECRET is not defined');
  process.exit(1);
}

// Initialize Express
const app = express();

// Middleware for authentication
app.use(async (req, res, next) => {
  const token = req.headers.authorization || '';
  if (token) {
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET);
      req.user = decoded;
    } catch (e) {
      console.error('Invalid token', e);
    }
  }
  next();
});

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ user: req.user })
});

// Start Apollo Server
const startServer = async () => {
  await server.start(); 
  server.applyMiddleware({ app });

  // Connect to MongoDB
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  // Start Express server
  app.listen({ port: 4000 }, () =>
    console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();

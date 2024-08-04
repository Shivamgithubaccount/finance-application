# Finance Management Application
The Finance Management application is created to manage personal finances by having a dashboard ,adding, editing, and deleting transactions features.
This application is built using React, GraphQL, Node.js, and MongoDB.

## Tech Stack

- **Frontend**: React, styled component, Apollo Client
- **Backend**: Node.js, Apollo Server, GraphQL
- **Database**: MongoDB

- 
## Features

- **User Authentication**: Register and log in to access personal finance data.
- **Dashboard**: View total balance, income, and expenses at a glance.
- **Transaction Management**: Add, edit, and delete transactions.
- **Category Management**: Organize transactions by categories.
- **Filtering and Search**: Filter transactions by category and search through them.
- **Responsive Design**: Optimized for various screen sizes.



## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Clone the Repository

git clone (https://github.com/kajamal/Finance-manganment-app.git 
cd Finance-manganment-app

### Setup Environment Variables:

Create a .env file in the server directory with the following variables:
MONGO_URI=mongodb://localhost:27017/your-db-name
JWT_SECRET=your_jwt_secret
PORT=4000

### Run the Application
Start the Backend Server
cd Backend
npm start

### Start the Frontend Development Server
cd frontend
npm start

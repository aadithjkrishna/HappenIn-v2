# College Resource Management System

## Requirements
- Node.js (v18+ recommended)
- MongoDB installed & running locally, or a MongoDB Atlas connection URL

## Installation
1. Download or clone this repository.
2. Open a terminal in the project root.
3. Install dependencies:
   npm install

// This step is not necessary since i have added the .env for development reasons but it should be created by each user and should not be shared
4. Create a `.env` file in the root directory with the following variables:
   MONGO_URI=<your-mongodb-connection-string>
   PORT=5000
   (Add any other environment variables your app requires)

## Running the application
do
   npm run dev
or:
   npm start

## Accessing the site
Once the server is running:
   http://localhost:5000/


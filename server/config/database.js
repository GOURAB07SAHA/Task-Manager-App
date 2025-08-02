const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () = {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB in-memory server connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

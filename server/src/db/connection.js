const mongoose = require('mongoose');

module.exports = async function connectDb(){
  try {
    const mongodbInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected !',mongodbInstance.connection.host);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

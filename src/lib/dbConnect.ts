import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
}; // injecting typescript type for connection object

const connection: ConnectionObject = {}; // connection is a variable of type ConnectionObject and intally empty

async function dbConnect(): Promise<void> { // db connect hone ke baad return m milega kuch, to uska type promise hoga, now what comes inside the promise, we don't care, so we use void
// this void and cpp void is different, cpp void means nothing, but here it means we don't care what data comes

  // Check if we have a connection to the database or 4if it's currently connecting
  if (connection.isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    // Attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {}); // you can pass options as the second argument, but here we are not passing any options, so we pass an empty object

    connection.isConnected = db.connections[0].readyState;

    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);

    // Graceful exit in case of a connection error
    process.exit(1);
  }
}

export default dbConnect;
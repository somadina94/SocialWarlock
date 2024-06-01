process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

const server = app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

const connectDB = async () => {
  try {
    const database = await mongoose.connect(DB);
    if (database.STATES.connected === 1) console.log('DB connected successfully!!!');
  } catch (error) {
    console.log(error);
  }
};

connectDB();

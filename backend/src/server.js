require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const start = async () => {
  await connectDB();
  app.listen(process.env.PORT || 5000, () => console.log('API running'));
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});

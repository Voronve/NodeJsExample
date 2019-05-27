import mongoose from 'mongoose';

require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }).catch((err) => {
  console.error(`🙅  🚫   🙅  🚫   🙅  🚫   🙅  🚫   ➞ ➞ ➞  ${err.message}`);
  throw err;
});
mongoose.Promise = global.Promise;

import mongoose from 'mongoose';

// Try standard connection string instead of SRV
const uri = 'mongodb://erpawan459_db_user:alhFC6pCako72e3n@helpdesk-cluster.hlw9wff.mongodb.net:27017/portfoliobuilder?retryWrites=true&w=majority';

console.log('Testing MongoDB connection with standard format...');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 15000,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  console.log('Host:', mongoose.connection.host);
  console.log('Database:', mongoose.connection.name);
  process.exit(0);
})
.catch((error) => {
  console.error('❌ MongoDB Connection Failed!');
  console.error('Error:', error.message);
  console.error('\nTrying to ping DNS...');
  process.exit(1);
});

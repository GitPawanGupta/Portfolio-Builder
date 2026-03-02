import mongoose from 'mongoose';

const uri = 'mongodb+srv://erpawan459_db_user:alhFC6pCako72e3n@helpdesk-cluster.hlw9wff.mongodb.net/portfoliobuilder';

console.log('Testing MongoDB connection...');
console.log('URI:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 15000,
  retryWrites: true,
  w: 'majority',
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
  console.error('Error Code:', error.code);
  console.error('\nPossible solutions:');
  console.error('1. Check MongoDB Atlas Network Access - Add IP: 0.0.0.0/0');
  console.error('2. Verify credentials are correct');
  console.error('3. Check if firewall/antivirus is blocking connection');
  console.error('4. Try disabling VPN if active');
  process.exit(1);
});

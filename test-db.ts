// Script untuk test koneksi database
// Jalankan dengan: node --loader ts-node/esm test-db.ts
// atau: npx tsx test-db.ts

import { initializeDatabase } from './src/lib/db/index';

async function testConnection() {
  console.log('🔄 Testing database connection...\n');
  
  try {
    const success = await initializeDatabase();
    
    if (success) {
      console.log('\n✅ Database connection test SUCCESSFUL!');
      console.log('✅ Tables have been created/updated successfully.');
      console.log('\nYou can now start using the authentication endpoints:');
      console.log('  - POST /api/auth/register');
      console.log('  - POST /api/auth/login');
      console.log('  - POST /api/auth/logout');
      console.log('  - GET  /api/auth/me');
    } else {
      console.log('\n❌ Database connection test FAILED!');
      console.log('Please check your database configuration in .env.local');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during database test:', error);
    process.exit(1);
  }
}

testConnection();

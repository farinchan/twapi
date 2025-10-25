import sequelize from './config';
import User from './models/User';

// Fungsi untuk menginisialisasi database
export async function initializeDatabase() {
  try {
    // Test koneksi
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');

    // Sync semua model (buat tabel jika belum ada)
    await sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully.');
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
}

// Export models untuk digunakan di tempat lain
export { User };
export default sequelize;

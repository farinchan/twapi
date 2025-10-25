import sequelize from './config';
import User from './models/User';
import WhatsappSession from './models/WhatsappSession';
import WhatsappContact from './models/WhatsappContact';
import WhatsappMessage from './models/WhatsappMessage';

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

User.hasMany(WhatsappSession, { foreignKey: 'userId' });
WhatsappSession.belongsTo(User, { foreignKey: 'userId' });

WhatsappSession.hasMany(WhatsappContact, { foreignKey: 'sessionId' });
WhatsappContact.belongsTo(WhatsappSession, { foreignKey: 'sessionId' });

WhatsappContact.hasMany(WhatsappMessage, { foreignKey: 'whatsappContactId' });
WhatsappMessage.belongsTo(WhatsappContact, { foreignKey: 'whatsappContactId' });

// Export models untuk digunakan di tempat lain
export { User, WhatsappSession, WhatsappContact, WhatsappMessage };
export default sequelize;

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config';

// Interface untuk atribut WhatsappContact
interface WhatsappContactAttributes {
  id: number;
  remoteJid: string;
  sessionId: number; // Changed to number (references whatsapp_sessions.id)
  profilePictureUrl: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface untuk membuat WhatsappContact baru (id bersifat opsional karena auto-increment)
interface WhatsappContactCreationAttributes extends Optional<WhatsappContactAttributes, 'id'> {}

// Model WhatsappContact
class WhatsappContact extends Model<WhatsappContactAttributes, WhatsappContactCreationAttributes> implements WhatsappContactAttributes {
  public id!: number;
  public remoteJid!: string;
  public sessionId!: number; // Changed to number
  public profilePictureUrl!: string;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;


}

// Inisialisasi model WhatsappContact
WhatsappContact.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    remoteJid: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sessionId: {
      type: DataTypes.INTEGER.UNSIGNED, // Changed to INTEGER
      allowNull: false,
      references: {
        model: 'whatsapp_sessions',
        key: 'id', // Reference to id column, not sessionId
      },
    },
    profilePictureUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'whatsapp_contacts',
    timestamps: true,
   
  }
);

export default WhatsappContact;

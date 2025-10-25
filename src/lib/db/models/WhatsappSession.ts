import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config';

// Interface untuk atribut WhatsappSession
interface WhatsappSessionAttributes {
  id: number;
  userId: number;
  sessionId: string;
  whatsAppNumber: string;
  webhookUrl: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface untuk membuat WhatsappSession baru (id bersifat opsional karena auto-increment)
interface WhatsappSessionCreationAttributes extends Optional<WhatsappSessionAttributes, 'id'> {}

// Model WhatsappSession
class WhatsappSession extends Model<WhatsappSessionAttributes, WhatsappSessionCreationAttributes> implements WhatsappSessionAttributes {
  public id!: number;
  public userId!: number;
  public sessionId!: string;
  public whatsAppNumber!: string;
  public webhookUrl!: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;


}

// Inisialisasi model WhatsappSession
WhatsappSession.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    references: {
        model: 'users',
        key: 'id',
      },
    },
    sessionId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    whatsAppNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    webhookUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'whatsapp_sessions',
    timestamps: true,
   
  }
);

export default WhatsappSession;

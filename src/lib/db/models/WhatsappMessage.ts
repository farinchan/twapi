import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config';

// Interface untuk atribut WhatsappMessage
interface WhatsappMessageAttributes {
  id: number;
  whatsappContactId: number;
  type: string;
  name: string;
  message: string;
  media_image : string;
  media_video : string;
  media_document : string;
  media_audio : string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface untuk membuat WhatsappMessage baru (id bersifat opsional karena auto-increment)
interface WhatsappMessageCreationAttributes extends Optional<WhatsappMessageAttributes, 'id'> {}

// Model WhatsappMessage
class WhatsappMessage extends Model<WhatsappMessageAttributes, WhatsappMessageCreationAttributes> implements WhatsappMessageAttributes {
  public id!: number;
  public whatsappContactId!: number;
  public type!: string;
  public name!: string;
  public message!: string;
  public media_image!: string;
  public media_video!: string;
  public media_document!: string;
  public media_audio!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;


}

// Inisialisasi model WhatsappMessage
WhatsappMessage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    whatsappContactId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'whatsapp_contacts',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    media_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    media_video: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    media_document: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    media_audio: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'whatsapp_messages',
    timestamps: true,
   
  }
);

export default WhatsappMessage;

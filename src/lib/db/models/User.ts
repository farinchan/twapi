import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config';
import bcrypt from 'bcryptjs';

// Interface untuk atribut User
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface untuk membuat User baru (id bersifat opsional karena auto-increment)
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Model User
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;


}

// Inisialisasi model User
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      // Hash password sebelum menyimpan
      beforeCreate: async (user: User) => {
        console.log('beforeCreate hook triggered for user:', user.email);
        if (user.password) {
          console.log('Hashing password...');
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          console.log('Password hashed successfully');
        } else {
          console.log('No password to hash');
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          console.log('beforeUpdate hook: Hashing password...');
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          console.log('Password hashed successfully');
        }
      },
    },
  }
);

export default User;

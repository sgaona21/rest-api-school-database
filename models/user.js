'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "First Name is REQUIRED."
        },
        notEmpty: {
          msg: "First Name cannot be empty."
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Last Name is REQUIRED."
        },
        notEmpty: {
          msg: "Last Name cannot be empty."
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email already exists'
      },
      validate: {
        notNull: {
          msg: 'An EMAIL is required'
        },
        isEmail: {
          msg: 'Please provide a VALID email'
        }
      }  
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A PASSWORD is required'
        },
        notEmpty: {
          msg: 'Password cannot be empty'
        },
        len: {
          args: [5, 20],
          msg: 'passwrod must be between 5-20 characters.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = (models) => {
    User.hasMany(models.Course, { 
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      } 
    });
  };

  return User;
};
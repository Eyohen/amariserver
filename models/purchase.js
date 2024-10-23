'use strict';


const {Model, UUIDV4} = require('sequelize');



module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model{
   
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

 
    static associate(models) {
      // define association here
      Purchase.belongsTo(models.User, { foreignKey: 'userId' });
      Purchase.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  Purchase.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
      // autoIncrement: true
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: true
      },
    email: {
        type: DataTypes.STRING,
        allowNull: true
      },
    title: {
        type: DataTypes.STRING,
        allowNull: false
      },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
    description: {
          type: DataTypes.STRING,
          allowNull: false
        },
    imageUrl: {
          type: DataTypes.STRING,
          allowNull: true
        },
    color: {
          type: DataTypes.STRING,
          allowNull: true
        },
    size: {
          type: DataTypes.STRING,
          allowNull: true
        },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: true
          },
    totalPrice:{
        type:DataTypes.FLOAT,
        allowNull: true
    }
    //   quantity: {
    //     type: DataTypes.ARRAY(DataTypes.FLOAT), // array of numbers
    //     allowNull:true,
    //   }
      // category: {
      //     type: DataTypes.STRING,
      //     allowNull: false
      //   },
    // menu: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    //   },

  }, {
    sequelize,
    modelName: 'Purchase',
  });
  return Purchase;
};
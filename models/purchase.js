// 'use strict';


// const {Model, UUIDV4} = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//   class Purchase extends Model{
   
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */

 
//     static associate(models) {
//       // define association here
//       Purchase.belongsTo(models.User, { foreignKey: 'userId' });
//       Purchase.belongsTo(models.Product, { foreignKey: 'productId' });
//     }
//   }
//   Purchase.init({
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: UUIDV4,
//       allowNull: false,
//       primaryKey: true,
//       // autoIncrement: true
//     },
//     fname: {
//         type: DataTypes.STRING,
//         allowNull: true
//       },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: true
//       },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false
//       },
//     price: {
//         type: DataTypes.FLOAT,
//         allowNull: false
//       },
//     discount: {
//         type: DataTypes.FLOAT,
//         allowNull: true
//       },
//     description: {
//           type: DataTypes.STRING,
//           allowNull: false
//         },

//     color: {
//           type: DataTypes.STRING,
//           allowNull: true
//         },
//     size: {
//           type: DataTypes.STRING,
//           allowNull: true
//         },
//     quantity: {
//         type: DataTypes.FLOAT,
//         allowNull: true
//           },
//     totalPrice:{
//         type:DataTypes.FLOAT,
//         allowNull: true
//     },
//     totalAmount:{
//       type:DataTypes.FLOAT,
//       allowNull: true
//   },


//   }, {
//     sequelize,
//     modelName: 'Purchase',
//   });
//   return Purchase;
// };

'use strict';
const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    static associate(models) {
      Purchase.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  
  Purchase.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    items: {
      type: DataTypes.JSON,  // This will store the array of items
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'completed'
    }
  }, {
    sequelize,
    modelName: 'Purchase',
  });
  
  return Purchase;
};
// 'use strict';


// const {Model, UUIDV4} = require('sequelize');



// module.exports = (sequelize, DataTypes) => {
//   class Product extends Model{
   
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */

 
//     static associate(models) {
//       // define association here
//       Product.hasMany(models.Review, { foreignKey: 'productId', as:'Review' });
//       Product.hasMany(models.Purchase, { foreignKey: 'productId', as:'Purchase' });
//       Product.belongsTo(models.Category, {foreignKey:'categoryId', onDelete:'SET NULL', onUpdate:'CASCADE', as:'Category'})
//     }
//   }
//   Product.init({
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       allowNull: false,
//       primaryKey: true,
//       // unique: true,
//       // autoIncrement: true
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false
//       },
//       price: {
//         type: DataTypes.FLOAT,
//         allowNull: false
//       },
//       discount: {
//         type: DataTypes.FLOAT,
//         allowNull: true
//       },
//       description: {
//           type: DataTypes.STRING,
//           allowNull: false
//         },
//       imageUrl: {
//           type: DataTypes.STRING,
//           allowNull: true
//         },
//       color: {
//           type: DataTypes.STRING,
//           allowNull: true
//         },
//       size: {
//           type: DataTypes.STRING,
//           allowNull: true
//         },
//       categoryId: {
//           type: DataTypes.UUID,
//           // defaultValue: UUIDV4,
//           allowNull: true,
//           references: {
//             model: 'Categories',
//             key: 'id'
//           }
//         },


//   }, {
//     sequelize,
//     modelName: 'Product',
//   });
//   return Product;
// };

// Product model
'use strict';
const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {

      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        // onDelete: 'SET NULL',
        // onUpdate: 'CASCADE',
        as: 'Category'
      });
    }
  }

  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false
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
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
     
    }
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};

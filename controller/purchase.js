const { Request, Response } = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const { uploadtocloudinary, uploadType } = require("../middleware/cloudinary");
const db = require("../models");
const { totalmem } = require("os");
const { Purchase, User, Product, Cart } = db;
const { Op } = require('sequelize');
const sendEmail = require('../utils/sendEmail.js')
const sequelize = db.sequelize;


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});


// const create = async (req, res) => {
// 	try {
// 	  const { email, fname, userId, totalAmount, items } = req.body;
  
// 	  if (!items || !Array.isArray(items) || items.length === 0) {
// 		return res.status(400).json({ msg: "No items provided for purchase" });
// 	  }
  
// 	  // Create purchases for each item
// 	  const purchasePromises = items.map(async (item) => {
// 		// Validate product exists and get current price
// 		const cart = await Cart.findByPk(item.cartId);
// 		if (!cart) {
// 		  throw new Error(`Product not found for ID: ${item.cartId}`);
// 		}
  
// 		// Calculate final price considering discount
// 		const finalPrice = item.discount && item.discount > 0 ? item.discount : item.price;
  
// 		return Purchase.create({
// 		  id: uuidv4(), // Make sure you have uuidv4 imported
// 		  email,
// 		  fname,
// 		  userId,
// 		  cartId: item.cartId,
// 		  title: item.title,
// 		  description: item.description,
// 		  price: finalPrice,
// 		  discount: item.discount,
// 		  color: item.color,
// 		  size: item.size,
// 		  quantity: item.quantity,
// 		  totalPrice: finalPrice * item.quantity,
// 		  totalAmount
// 		});
// 	  });
  
// 	  // Wait for all purchases to be created
// 	  const purchases = await Promise.all(purchasePromises);
  
// 	  // Send email confirmation
// 	  await sendEmail(
// 		"henry.eyo2@gmail.com",
// 		email,
// 		"Order Confirmation",
// 		"Order Confirmed!",
// 		fname,
// 		purchases.map(p => p.title).join(', '),
// 		purchases.reduce((sum, p) => sum + p.quantity, 0),
// 		purchases.reduce((sum, p) => sum + p.price, 0),
// 		totalAmount
// 	  );
  
// 	  return res.status(200).json({
// 		purchases,
// 		msg: "Successfully created purchases, check your email to see your receipt"
// 	  });
// 	} catch (error) {
// 	  console.error("Purchase creation error:", error);
// 	  return res.status(500).json({
// 		msg: "Failed to create purchase",
// 		error: error.message
// 	  });
// 	}
//   };


const create = async (req, res) => {
	const transaction = await sequelize.transaction();
  
	try {
	  const { email, fname, userId, totalAmount, items } = req.body;
  
	  if (!items || !Array.isArray(items) || items.length === 0) {
		return res.status(400).json({ msg: "No items provided for purchase" });
	  }
  
	  // Validate all cart items exist before proceeding
	  for (const item of items) {
		const cart = await Cart.findByPk(item.cartId);
		if (!cart) {
		  await transaction.rollback();
		  return res.status(404).json({ msg: `Cart item not found for ID: ${item.cartId}` });
		}
	  }
  
	  // Create a single purchase with all items
	  const purchase = await Purchase.create({
		id: uuidv4(),
		email,
		fname,
		userId,
		items: items.map(item => ({
		  cartId: item.cartId,
		  title: item.title,
		  description: item.description,
		  price: item.discount || item.price,
		  discount: item.discount,
		  color: item.color,
		  size: item.size,
		  quantity: item.quantity,
		  totalPrice: item.totalPrice
		})),
		totalAmount,
		status: 'completed'
	  }, { transaction });
  
	  await transaction.commit();
  
	  // Send email confirmation
	  await sendEmail(
		"henry.eyo2@gmail.com",
		email,
		"Order Confirmation",
		"Order Confirmed!",
		fname,
		`Order ID: ${purchase.id}`,
		purchase.items.reduce((sum, item) => sum + item.quantity, 0),
		totalAmount,
		totalAmount
	  );
  
	  return res.status(200).json({
		purchase,
		msg: "Successfully created purchase, check your email to see your receipt"
	  });
	} catch (error) {
	  await transaction.rollback();
	  console.error("Purchase creation error:", error);
	  return res.status(500).json({
		msg: "Failed to create purchase",
		error: error.message
	  });
	}
  };
  
	

	const readall = async (req, res) => {
		try {
			const limit = req.query.limit || 10;
			const offset = req.query.offset;

			const records = await Purchase.findAll({
				// include:[{model:Payment, as: 'Payment'},{model:User, as: 'User'}]
			});
			return res.json(records);
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500, route: "/read" });
		}
	}

	const readId = async (req, res) => {
		try {
			const { id } = req.params;
			const record = await Purchase.findOne({ where: { id } });
			return res.json(record);
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500, route: "/read/:id" });
		}
	}

	const readByUserId = async (req, res) => {
		try {
			const { userId } = req.params;
			const communities = await Purchase.findAll({ where: { user: userId } });
			return res.json(communities);
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500, route: "/read/user/:userId" });
		}
	}

	const update = async (req, res) => {
		try {
			// const { title, content } = req.body;
			const updated = await Purchase.update({ ...req.body }, { where: { id: req.params.id } });
			if (updated) {
				const updatedPurchase = await Purchase.findByPk(req.params.id);
				res.status(200).json(updatedPurchase);
			} else {
				res.status(404).json({ message: 'Purchase not found' });
			}
		} catch (error) {
			res.status(500).json({ message: 'Error updating the Purchase', error });
		}
	}

	const deleteId = async (req, res) => {
		try {
			const { id } = req.params;
			const record = await Purchase.findOne({ where: { id } });

			if (!record) {
				return res.json({ msg: "Can not find existing record" });
			}

			const deletedRecord = await record.destroy();
			return res.json({ record: deletedRecord });
		} catch (e) {
			return res.json({
				msg: "fail to read",
				status: 500,
				route: "/delete/:id",
			});
		}
	}


module.exports = {create, readall, readId, update, deleteId, readByUserId};
const { Request, Response } = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const { uploadtocloudinary, uploadType } = require("../middleware/cloudinary");
const db = require("../models");
const { totalmem } = require("os");
const { Purchase, User, Product } = db;
const { Op } = require('sequelize');
const sendEmail = require('../utils/sendEmail.js')


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});


	const create = async (req, res) => {
		try {
			// if (!req.body.user) {
			// 	return res.status(404).json({ msg: "User not found" });
			// }

			const {email, fname, title, price, discount, description, color, size, imageUrl, quantity, totalPrice, productId } = req.body;

			// fetch the product from the database
			const product = await Product.findByPk(productId);
			if(!product){
				return res.status(404).json({msg:"Product not found"});
			}

			// Calculate the final price considering the discount
			let finalPrice = product.price;
			if(product.discount && product.discount > 0 && product.discount < product.price){
				finalPrice = product.discount;
			}

			

			// Check if image was uploaded
			let imageurl = '';
			if (req.file) {
				console.log(req.file);
				// Upload image to Cloudinary
				const uploadresult = await uploadtocloudinary(req.file.buffer);
				if (uploadresult.message === "error") {
					throw new Error(uploadresult.error.message);
				}
				imageurl = uploadresult.url;
			}

            // let user = await Purchase.findOne({email:req.body.email});


     

			// create Purchase record in the database
			const record = await Purchase.create({email:req.body.email, imageUrl: imageurl, fname, title, price:finalPrice, quantity, totalPrice:finalPrice * quantity, ...req.body });

            await sendEmail( "henry.eyo2@gmail.com", record.email, "Order Confirmation",
                 "Order Confirmed!", record.fname, record.title, record.quantity, record.price, record.totalPrice);
            
            // await sendEmail( "henry.eyo2@gmail.com", "henry.eyo2@gmail.com", "Order Confirmation",
            //     "Heres you receipt!");


			return res.status(200).json({ record, msg: "Successfully create Purchase, check your email to see your receipt" });
		} catch (error) {
			console.log("henry", error);
			return res.status(500).json({ msg: "fail to create", error });
		}
	}

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
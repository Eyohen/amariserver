const nodemailer = require('nodemailer')
const dotenv=require('dotenv')



module.exports = async (from, email, subject, text, fname, title, quantity, price, totalPrice) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			secure: false,
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

	

		await transporter.sendMail({
			from: from,
			to: email,
			subject: subject,
			text: text,
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #333;
        }
        .details {
            margin-bottom: 20px;
        }
        .details p {
            margin: 5px 0;
        }
        .items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .items th, .items td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .items th {
            background-color: #87CEEB;
        }
        .summary {
            margin-bottom: 20px;
        }
        .summary p {
            margin: 5px 0;
        }
        .address {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${text}</h1>
        </div>
        <div class="details">
            <p>Hello ${fname},</p>
            <p style="color: #818589;">Thanks for placing your order with us. Below are the details of your order. If you have any queries, feel free to get in touch with us at demo@gmail.com.</p>
            <p style="color:#818589; margin-top:10px;"><span>Order ID:</span> #45534522</p>
            <p style="color:#818589; margin-top:10px;"><span>Order Date:</span> date</p>
              <p style="margin-top:10px;"><span>Estimated Time of Delivery:</span> 2 days</p>
        </div>
        <table class="items" >
            <tr style="background-color:#87CEEB;">
                <th>Product Name</th>     
                <th>Quantity</th>
                <th>Price</th>
            </tr>
            <tr>
                <td>${title}</td>
                <td>${quantity}</td>
                <td>₦${price}</td>
            </tr>
          
            <!-- Add more products as needed -->
        </table>
        <div class="summary">
            <p><strong>Shipping:</strong> ₦150</p>
            <p><strong>Taxes:</strong> ₦230</p>
            <p><strong>Total Price:</strong> ₦${totalPrice}</p>
        </div>
        <div class="address">
            <p><strong>Delivery Address:</strong></p>
            <p style="color:#818589;">No.17 Ademola Asinka Avenue</p>
        </div>
    </div>
</body>
</html>`
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};

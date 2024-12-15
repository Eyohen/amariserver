const express = require('express');
const db = require ('./models');
const user = require("./route/user");
const auth =  require("./route/auth");
const product =  require('./route/product');
const purchase =  require('./route/purchase');
const category =  require('./route/category');
const review = require('./route/review');
const blog = require('./route/blog');
const cart = require('./route/cart');
const deliveryRate = require('./route/deliveryRate');



// import crockery from './route/crockery';
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');


const app = express();
const port = process.env.API_PORT;


app.use(morgan('dev'))
app.use(helmet());
app.use(express.json());
app.use(cors());

db.sequelize
    .authenticate()
    .then(() => {
        console.log(`postgres connection has been established successfully... ${process.env.NODE_ENV}`)
    })
    .catch((err) => {
        console.log(`unable to connect to the databse ${err.message}`)
        if(
            err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefuseError'
        ){
            console.log('the databse is disconnected please check the connection and try again')
        }
        else{
            console.log(`An error occured while connecting to the database: ${err.message}`)
        }
    })
    

app.use((req, res, next)=>{
    console.log(`incoming request... ${req.method} ${req.path}`)
    next()
})

app.use("/api/auth", auth);
app.use("/api/users", user);
app.use("/api/products", product);
app.use("/api/purchases", purchase);
app.use("/api/categories", category);
app.use("/api/reviews", review);
app.use("/api/posts", blog);
app.use("/api/cart", cart);
app.use("/api/deliveryrates", deliveryRate)



if (process.env.NODE_ENV === 'development') {
    // PORT = process.env.TEST_PORT;
    drop = { force: true };
}

db.sequelize.sync({alter:true}).then(() => {
    console.log('All models were synchronized successfully')
    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
})
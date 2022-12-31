require('dotenv').config();
const connectDB = require('./db/connect');
const Product = require('./models/product');
const jsonProducts = require('./products.json');

/* this files is made to populate the database
 * and start working with the features of the
 * project */

const start = async(url)=>{
  try {
    await connectDB(url);
    await Product.deleteMany({});
    await Product.create(jsonProducts);
    process.exit(0);

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

start(process.env.MONGO_URI);

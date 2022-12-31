require('dotenv').config(); // set the environment variables
//async errors
require('express-async-errors');

const express = require('express');
const app = express();

const {
  BAD_REQ,
  SUCCESS,
  NOT_FOUND,
  TOO_MANY_REQ
} = require('./http-codes');

const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');

app.use(express.json());
app.use('/api/v1/products',productsRouter);

app.get('/',(request,response)=>{
  response
    .status(SUCCESS)
    .send('<h1>Store Api</h1><a href="/api/v1/products">products route</a>')
});

app.use([notFound,errorHandler])

const start = async (url)=>{
  try {
    await connectDB(url);
    app.listen(PORT,()=>{
      console.log(`listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start(mongoURI);

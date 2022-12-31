const express = require('express');
const router = express.Router();
const {SUCCESS} = require('../http-codes');
const {
  getAllProducts,
  getAllProductsStatic
} = require('../controllers/products');

router
  .route(':?')
  .get(getAllProducts)

router.route('/static').get(getAllProductsStatic)

module.exports = router;

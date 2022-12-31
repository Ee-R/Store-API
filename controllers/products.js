const {
  SUCCESS,
  NOT_FOUND
} = require('../http-codes');
const Product = require('../models/product');
const CustomError = require('../errors/custom-error');

const getAllProductsStatic = async (request,response)=>{
  const products = await Product.find({}).select('name');
  response
    .status(SUCCESS)
    .json({
      products,
      nbHits : products.length
    });
}

const getAllProducts = async (request,response)=>{
  const {
    featured:fetchedFeatured,
    company:fetchedCompany,
    name:fetchedName,
    sort:fetchedSortParameter,
    fields:fetchedFields,
    limit:fetchedLimit,
  } = request.query; // the queries are retrieves as strings

  const queryFilter = {};
  let productsQuery;

  //setup the query filter

  if(fetchedFeatured)// if fetched featured propery isn't undefined
    queryFilter.featured = fetchedFeatured === 'true';

  if(fetchedCompany)
    queryFilter.company = fetchedCompany;

  if(fetchedName)
    queryFilter.name = {$regex:`^(${fetchedName})`,$options:'i'};

  productsQuery = Product.find(queryFilter)
  //return a mongoose query

  /* Start chaining methods to the received query if
   * there aren't any in some cases, we'll default them */

  //If there's a specified sorting parameter, chain it on the received query above
  if(fetchedSortParameter){
    productsQuery.sort(fetchedSortParameter.replace(',',' '));
    //changes the commas by spaces so it follows the documentation examples
  }else{
    //if no parameter is specified, sort by creation date
    productsQuery.sort([['createdAt','asc']])
  }

  // if fields are specified, then chain them to the query
  if(fetchedFields)
    productsQuery.select(fetchedFields.split(','));

  // idem with limit
  if(fetchedLimit)
    productsQuery.limit(Number(fetchedLimit));


  productsQuery = await productsQuery;

  if(productsQuery.length < 1)
    throw new CustomError(NOT_FOUND,"Item not found");

  response
    .status(SUCCESS)
    .json({
      productsQuery,
      nbHits:productsQuery.length
      // products amount
    })
}

module.exports={
  getAllProducts,
  getAllProductsStatic
}

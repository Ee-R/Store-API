class CustomErrorApi extends Error{
  constructor(statusCode, errorMessage){
    super(errorMessage);
    this.statusCode = statusCode;
  }
}

module.exports = CustomErrorApi;

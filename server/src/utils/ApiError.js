// FOR STRUCTURING ERROR RESPONSE
class ApiError extends Error{
  constructor(statusCode,message,errors=[],stack = ""){
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if(stack){
        this.stack = stack;
    }else{
        Error.captureStackTrace(this,this.constructor)
    }
  }
}
module.exports = ApiError;
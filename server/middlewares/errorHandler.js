export const asyncErrorHandler = (func) => (req, res, next) => {
  return Promise.resolve(func(req, res, next)).catch(next);
};

export const errorHandlerMiddleware = (err, req, res, next) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;
  console.log(err);

  if (err.name == "ValidationError") {
    for (let i in err.errors) {
      err.errors[i] = err.errors[i].message;
    }

    if (Object.keys(err.errors).length == 1) {
      err.message = err.errors[Object.keys(err.errors)[0]];
    } else {
      err.message = "Please provide all valid fields";
    }

    err.statusCode = 403;
  }

  if (err.name == "CastError") {
    err.statusCode = 409;
    err.message = `No resource found with id ${err.value.path}`;
  }

  if (err.code == 11000) {
    err.statusCode = 403;
    err.message = `Please provide a unique ${Object.keys(err.keyValue)[0]}`;
  }

  console.log(err.message);

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors,
  });
};

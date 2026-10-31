const AppError = require('../utils/AppError');

exports.notFound = (req, res, next) => next(new AppError(`Route not found: ${req.originalUrl}`, 404));

exports.errorHandler = (err, req, res, next) => {
  let { status = 500, message } = err;

  if (err.name === 'CastError') {
    status = 404;
    message = 'Resource not found';
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.code === 11000) {
    status = 409;
    message = 'Already exists';
  }

  if (status >= 500) console.error(err);
  res.status(status).json({ message: status >= 500 ? 'Internal server error' : message });
};

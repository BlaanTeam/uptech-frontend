// Convert port from string to integer

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// create http errors

class createError extends Error {
  constructor(message, code, status) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
    this.code = code;
    this.status = status;
  }
}
module.exports = {
  normalizePort,
  createError,
};

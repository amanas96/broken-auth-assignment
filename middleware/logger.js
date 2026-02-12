const requestLogger = (req, res, next) => {
  const start = Date.now();
  console.log(`${req.method} ${req.url}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.url} -> ${res.statusCode} (${duration}ms)`,
    );
  });
  next(); /*  next() is called to pass control to the next middleware function in the stack. If you don't call next(), the request will be left hanging and the server won't respond to the client. */
};

module.exports = requestLogger;

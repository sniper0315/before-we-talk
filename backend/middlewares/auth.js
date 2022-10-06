const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const authMiddleware = async (req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    try {
      const decode = jwt.verify(req.headers.authorization.split(' ')[1], keys.accessSecret);
      if (!decode) {
        req.user = undefined;
        res.status(500).send({ status: false, message: "Invalid Authorization" });
      }
      else {
        req.user = decode;
        await next();
      }
    }
    catch (error) {
      console.log('error', error);
      res.status(500).send({ status: false, message: "Invalid Authorization" });
    }
  } else {
    res.status(401).send({ message: "Not Authorized" });
  }
};
module.exports = authMiddleware;
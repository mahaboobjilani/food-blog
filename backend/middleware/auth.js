const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"]; // must be lowercase

  if (token) {
    token = token.split(" ")[1]; // remove "Bearer"
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        console.log("Decoded token:", decoded);
        req.user = decoded;
        next();  // ✅ only call next if verified
      }
    });
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = verifyToken;

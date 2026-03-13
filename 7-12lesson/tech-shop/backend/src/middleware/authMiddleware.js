const jwt = require("jsonwebtoken");

const { findUserByEmail } = require("../data/usersStore");

const JWT_SECRET = "access_secret";

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: "Missing or invalid Authorization header",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserByEmail(payload.email);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    req.user = payload;
    req.currentUser = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}

module.exports = { authMiddleware };

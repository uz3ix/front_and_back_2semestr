const jwt = require("jsonwebtoken");

const { findUserByEmail } = require("../data/usersStore");

const JWT_SECRET = "access_secret";

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: "Missing or invalid Authorization header",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await findUserByEmail(payload.email);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.blocked) {
      return res.status(403).json({
        error: "User is blocked",
      });
    }

    req.user = {
      ...payload,
      role: user.role,
    };
    req.currentUser = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}

module.exports = { authMiddleware };

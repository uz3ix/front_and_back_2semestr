const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const { addRefreshToken, hasRefreshToken, removeRefreshToken } = require("../data/refreshTokensStore");
const { addUser, findUserByEmail } = require("../data/usersStore");
const { sanitizeUser } = require("../utils/users");
const {
  normalizeAndValidateLogin,
  normalizeAndValidateRegister,
} = require("../validators/authValidators");

const ACCESS_SECRET = "access_secret";
const REFRESH_SECRET = "refresh_secret";
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";
const PASSWORD_SALT = "tech-shop-static-salt";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password + PASSWORD_SALT).digest("hex");
}

function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    ACCESS_SECRET,
    {
      expiresIn: ACCESS_EXPIRES_IN,
    }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      jti: nanoid(10),
    },
    REFRESH_SECRET,
    {
      expiresIn: REFRESH_EXPIRES_IN,
    }
  );
}

function getRefreshTokenFromHeaders(req) {
  const bodyToken = req.body?.refreshToken;
  if (bodyToken) {
    return String(bodyToken).trim();
  }

  const headerToken = req.headers["x-refresh-token"];
  if (headerToken) {
    return String(headerToken).trim();
  }

  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme === "Bearer" && token) {
    return token;
  }

  return "";
}

async function register(req, res) {
  const { ok, errors, value } = normalizeAndValidateRegister(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  const exists = await findUserByEmail(value.email);
  if (exists) {
    return res.status(409).json({ error: "User with this email already exists" });
  }

  const user = await addUser({
    id: nanoid(8),
    email: value.email,
    first_name: value.first_name,
    last_name: value.last_name,
    password: hashPassword(value.password),
    role: "user",
    blocked: false,
  });

  return res.status(201).json(sanitizeUser(user));
}

async function login(req, res) {
  const { ok, errors, value } = normalizeAndValidateLogin(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  const user = await findUserByEmail(value.email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.blocked) {
    return res.status(403).json({ error: "User is blocked" });
  }

  const isValid = hashPassword(value.password) === user.password;
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await addRefreshToken(refreshToken);

  return res.status(200).json({
    accessToken,
    refreshToken,
  });
}

async function refresh(req, res) {
  const refreshToken = getRefreshTokenFromHeaders(req);

  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken is required" });
  }

  if (!(await hasRefreshToken(refreshToken))) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await findUserByEmail(payload.email);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.blocked) {
      await removeRefreshToken(refreshToken);
      return res.status(403).json({ error: "User is blocked" });
    }

    await removeRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    await addRefreshToken(newRefreshToken);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    await removeRefreshToken(refreshToken);
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
}

function me(req, res) {
  return res.status(200).json(sanitizeUser(req.currentUser));
}

module.exports = {
  login,
  me,
  refresh,
  register,
};

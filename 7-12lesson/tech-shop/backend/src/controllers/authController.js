const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const { addUser, findUserByEmail } = require("../data/usersStore");
const { sanitizeUser } = require("../utils/users");
const {
  normalizeAndValidateLogin,
  normalizeAndValidateRegister,
} = require("../validators/authValidators");

const JWT_SECRET = "access_secret";
const ACCESS_EXPIRES_IN = "15m";

async function register(req, res) {
  const { ok, errors, value } = normalizeAndValidateRegister(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  const exists = findUserByEmail(value.email);
  if (exists) {
    return res.status(409).json({ error: "User with this email already exists" });
  }

  const user = addUser({
    id: nanoid(8),
    email: value.email,
    first_name: value.first_name,
    last_name: value.last_name,
    password: await bcrypt.hash(value.password, 10),
  });

  return res.status(201).json(sanitizeUser(user));
}

async function login(req, res) {
  const { ok, errors, value } = normalizeAndValidateLogin(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  const user = findUserByEmail(value.email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isValid = await bcrypt.compare(value.password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: ACCESS_EXPIRES_IN,
    }
  );

  return res.status(200).json({ accessToken });
}

function me(req, res) {
  return res.status(200).json(sanitizeUser(req.currentUser));
}

module.exports = {
  login,
  me,
  register,
};

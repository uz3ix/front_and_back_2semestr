const { findUserByEmail, findUserById, getAllUsers, updateUser, blockUser } = require("../data/usersStore");
const { sanitizeUser } = require("../utils/users");
const { normalizeAndValidateUserUpdate } = require("../validators/userValidators");

async function getUsers(req, res) {
  const users = await getAllUsers();
  return res.status(200).json(users.map(sanitizeUser));
}

async function getUserById(req, res) {
  const user = await findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(sanitizeUser(user));
}

async function updateUserById(req, res) {
  const user = await findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const { ok, errors, value } = normalizeAndValidateUserUpdate(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  const existingUser = await findUserByEmail(value.email);
  if (existingUser && existingUser.id !== user.id) {
    return res.status(409).json({ error: "User with this email already exists" });
  }

  const updatedUser = await updateUser(user.id, value);
  return res.status(200).json(sanitizeUser(updatedUser));
}

async function blockUserById(req, res) {
  if (req.currentUser.id === req.params.id) {
    return res.status(400).json({ error: "You cannot block yourself" });
  }

  const user = await blockUser(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(sanitizeUser(user));
}

module.exports = {
  blockUserById,
  getUserById,
  getUsers,
  updateUserById,
};

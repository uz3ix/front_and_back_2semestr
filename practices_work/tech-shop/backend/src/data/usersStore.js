const { createJsonStore } = require("./jsonStore");

const defaultUsers = [
  {
    id: "admin001",
    email: "admin@techshop.local",
    first_name: "Админ",
    last_name: "Системы",
    password: "b1e80b2cee1c8cba55b8e4f3f80561e94b60e47161c60d67e787e489152e710d",
    role: "admin",
    blocked: false,
  },
  {
    id: "seller01",
    email: "seller@techshop.local",
    first_name: "Ольга",
    last_name: "Продавец",
    password: "b92852b7f5483244f89cbd9c47239988083cb0f142522f9bfd08440f8f51bd0e",
    role: "seller",
    blocked: false,
  },
];

const usersStore = createJsonStore("users.json", defaultUsers);

async function getAllUsers() {
  return usersStore.read();
}

async function findUserByEmail(email) {
  const users = await getAllUsers();
  return users.find((user) => user.email === email) || null;
}

async function findUserById(id) {
  const users = await getAllUsers();
  return users.find((user) => user.id === id) || null;
}

async function addUser(user) {
  const users = await getAllUsers();
  users.push(user);
  await usersStore.write(users);
  return user;
}

async function updateUser(id, payload) {
  const users = await getAllUsers();
  const user = users.find((item) => item.id === id);

  if (!user) {
    return null;
  }

  Object.assign(user, payload);
  await usersStore.write(users);
  return user;
}

async function blockUser(id) {
  return updateUser(id, { blocked: true });
}

module.exports = {
  addUser,
  blockUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  updateUser,
};

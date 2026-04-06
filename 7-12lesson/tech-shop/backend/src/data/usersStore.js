const { createJsonStore } = require("./jsonStore");


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

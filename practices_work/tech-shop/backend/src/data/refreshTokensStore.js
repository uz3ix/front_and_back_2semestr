const { createJsonStore } = require("./jsonStore");

const refreshTokensStore = createJsonStore("refreshTokens.json", []);

async function getAllRefreshTokens() {
  return refreshTokensStore.read();
}

async function addRefreshToken(token) {
  const refreshTokens = await getAllRefreshTokens();

  if (!refreshTokens.includes(token)) {
    refreshTokens.push(token);
    await refreshTokensStore.write(refreshTokens);
  }
}

async function hasRefreshToken(token) {
  const refreshTokens = await getAllRefreshTokens();
  return refreshTokens.includes(token);
}

async function removeRefreshToken(token) {
  const refreshTokens = await getAllRefreshTokens();
  const nextTokens = refreshTokens.filter((item) => item !== token);

  if (nextTokens.length !== refreshTokens.length) {
    await refreshTokensStore.write(nextTokens);
  }
}

module.exports = {
  addRefreshToken,
  hasRefreshToken,
  removeRefreshToken,
};

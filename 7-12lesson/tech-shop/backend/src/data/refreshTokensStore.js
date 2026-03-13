const refreshTokens = new Set();

function addRefreshToken(token) {
  refreshTokens.add(token);
}

function hasRefreshToken(token) {
  return refreshTokens.has(token);
}

function removeRefreshToken(token) {
  refreshTokens.delete(token);
}

module.exports = {
  addRefreshToken,
  hasRefreshToken,
  removeRefreshToken,
};

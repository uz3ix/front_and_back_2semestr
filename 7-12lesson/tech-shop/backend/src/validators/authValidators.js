function normalizeAndValidateRegister(input) {
  const errors = [];

  const email = String(input?.email ?? "").trim().toLowerCase();
  const first_name = String(input?.first_name ?? "").trim();
  const last_name = String(input?.last_name ?? "").trim();
  const password = String(input?.password ?? "");

  if (!email) errors.push("email is required");
  if (!first_name) errors.push("first_name is required");
  if (!last_name) errors.push("last_name is required");
  if (!password) errors.push("password is required");

  if (email && !email.includes("@")) {
    errors.push("email must be valid");
  }

  if (password && password.length < 6) {
    errors.push("password must be at least 6 characters");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: { email, first_name, last_name, password },
  };
}

function normalizeAndValidateLogin(input) {
  const errors = [];

  const email = String(input?.email ?? "").trim().toLowerCase();
  const password = String(input?.password ?? "");

  if (!email) errors.push("email is required");
  if (!password) errors.push("password is required");

  return {
    ok: errors.length === 0,
    errors,
    value: { email, password },
  };
}

module.exports = {
  normalizeAndValidateLogin,
  normalizeAndValidateRegister,
};

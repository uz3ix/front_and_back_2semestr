const ALLOWED_ROLES = ["user", "seller", "admin"];

function normalizeAndValidateUserUpdate(input) {
  const errors = [];

  const email = String(input?.email ?? "").trim().toLowerCase();
  const first_name = String(input?.first_name ?? "").trim();
  const last_name = String(input?.last_name ?? "").trim();
  const role = String(input?.role ?? "").trim().toLowerCase();

  if (!email) errors.push("email is required");
  if (!first_name) errors.push("first_name is required");
  if (!last_name) errors.push("last_name is required");
  if (!role) errors.push("role is required");

  if (email && !email.includes("@")) {
    errors.push("email must be valid");
  }

  if (role && !ALLOWED_ROLES.includes(role)) {
    errors.push("role must be one of: user, seller, admin");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: {
      email,
      first_name,
      last_name,
      role,
    },
  };
}

module.exports = {
  ALLOWED_ROLES,
  normalizeAndValidateUserUpdate,
};

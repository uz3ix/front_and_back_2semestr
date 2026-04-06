function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    const currentRole = req.currentUser?.role;

    if (!currentRole || !allowedRoles.includes(currentRole)) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    return next();
  };
}

module.exports = { roleMiddleware };

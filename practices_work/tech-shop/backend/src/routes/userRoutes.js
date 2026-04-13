const express = require("express");

const {
  blockUserById,
  getUserById,
  getUsers,
  updateUserById,
} = require("../controllers/usersController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware, roleMiddleware(["admin"]));

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", blockUserById);

module.exports = router;

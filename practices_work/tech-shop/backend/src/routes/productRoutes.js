const express = require("express");

const {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  replaceProduct,
} = require("../controllers/productsController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["user", "seller", "admin"]), getProducts);
router.post("/", authMiddleware, roleMiddleware(["seller", "admin"]), createProduct);
router.get("/:id", authMiddleware, roleMiddleware(["user", "seller", "admin"]), getProductById);
router.put("/:id", authMiddleware, roleMiddleware(["seller", "admin"]), replaceProduct);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteProduct);

module.exports = router;

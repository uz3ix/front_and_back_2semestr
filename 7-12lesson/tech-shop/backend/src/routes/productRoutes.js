const express = require("express");

const {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  replaceProduct,
} = require("../controllers/productsController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", authMiddleware, getProductById);
router.put("/:id", authMiddleware, replaceProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;

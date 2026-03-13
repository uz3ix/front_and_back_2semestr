const { nanoid } = require("nanoid");

const {
  addProduct,
  findProductById,
  getAllProducts,
  removeProduct,
  updateProduct,
} = require("../data/productsStore");
const { normalizeAndValidateProduct } = require("../validators/productValidators");

function createProduct(req, res) {
  const { ok, errors, value } = normalizeAndValidateProduct(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  const product = addProduct({
    id: nanoid(6),
    ...value,
  });

  return res.status(201).json(product);
}

function getProducts(req, res) {
  return res.status(200).json(getAllProducts());
}

function getProductById(req, res) {
  const product = findProductById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.status(200).json(product);
}

function replaceProduct(req, res) {
  const product = findProductById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { ok, errors, value } = normalizeAndValidateProduct(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  return res.status(200).json(updateProduct(req.params.id, value));
}

function deleteProduct(req, res) {
  const removed = removeProduct(req.params.id);

  if (!removed) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.status(204).send();
}

module.exports = {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  replaceProduct,
};

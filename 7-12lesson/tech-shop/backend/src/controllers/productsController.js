const { nanoid } = require("nanoid");

const {
  addProduct,
  findProductById,
  getAllProducts,
  removeProduct,
  updateProduct,
} = require("../data/productsStore");
const { normalizeAndValidateProduct } = require("../validators/productValidators");

async function createProduct(req, res) {
  const { ok, errors, value } = normalizeAndValidateProduct(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  const product = await addProduct({
    id: nanoid(6),
    ...value,
  });

  return res.status(201).json(product);
}

async function getProducts(req, res) {
  return res.status(200).json(await getAllProducts());
}

async function getProductById(req, res) {
  const product = await findProductById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.status(200).json(product);
}

async function replaceProduct(req, res) {
  const product = await findProductById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { ok, errors, value } = normalizeAndValidateProduct(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  return res.status(200).json(await updateProduct(req.params.id, value));
}

async function deleteProduct(req, res) {
  const removed = await removeProduct(req.params.id);

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

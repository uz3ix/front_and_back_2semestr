const { createJsonStore } = require("./jsonStore");


const productsStore = createJsonStore("products.json", defaultProducts);

async function getAllProducts() {
  return productsStore.read();
}

async function findProductById(id) {
  const products = await getAllProducts();
  return products.find((product) => product.id === id) || null;
}

async function addProduct(product) {
  const products = await getAllProducts();
  products.push(product);
  await productsStore.write(products);
  return product;
}

async function updateProduct(id, payload) {
  const products = await getAllProducts();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return null;
  }

  Object.assign(product, payload);
  await productsStore.write(products);
  return product;
}

async function removeProduct(id) {
  const products = await getAllProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return false;
  }

  products.splice(index, 1);
  await productsStore.write(products);
  return true;
}

module.exports = {
  addProduct,
  findProductById,
  getAllProducts,
  removeProduct,
  updateProduct,
};

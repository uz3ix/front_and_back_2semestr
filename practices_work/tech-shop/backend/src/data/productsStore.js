const { createJsonStore } = require("./jsonStore");

const defaultProducts = [
  {
    id: "prod001",
    title: "iPhone 15",
    category: "Смартфоны",
    description: "6.1'' OLED, 128GB, A16 Bionic",
    price: 99990,
  },
  {
    id: "prod002",
    title: "Samsung Galaxy S24",
    category: "Смартфоны",
    description: "AMOLED 120Hz, 256GB",
    price: 89990,
  },
  {
    id: "prod003",
    title: "MacBook Air M3",
    category: "Ноутбуки",
    description: "13'', 16GB RAM, 512GB SSD",
    price: 149990,
  },
];

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

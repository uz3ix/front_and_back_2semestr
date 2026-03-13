const { nanoid } = require("nanoid");

const products = [
  {
    id: nanoid(6),
    title: "iPhone 15",
    category: "Смартфоны",
    description: "6.1'' OLED, 128GB, A16 Bionic",
    price: 99990,
  },
  {
    id: nanoid(6),
    title: "Samsung Galaxy S24",
    category: "Смартфоны",
    description: "AMOLED 120Hz, 256GB",
    price: 89990,
  },
  {
    id: nanoid(6),
    title: "MacBook Air M3",
    category: "Ноутбуки",
    description: "13'', 16GB RAM, 512GB SSD",
    price: 149990,
  },
];

function getAllProducts() {
  return products;
}

function findProductById(id) {
  return products.find((product) => product.id === id) || null;
}

function addProduct(product) {
  products.push(product);
  return product;
}

function updateProduct(id, payload) {
  const product = findProductById(id);

  if (!product) {
    return null;
  }

  Object.assign(product, payload);
  return product;
}

function removeProduct(id) {
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return false;
  }

  products.splice(index, 1);
  return true;
}

module.exports = {
  addProduct,
  findProductById,
  getAllProducts,
  removeProduct,
  updateProduct,
};

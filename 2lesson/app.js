const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

let products = [
  { id: 1, title: "Смартфон Pixel 9", price: 79990 },
  { id: 2, title: "Ноутбук Lenovo ThinkPad", price: 129990 },
  { id: 3, title: "Наушники Sony ", price: 34990 },
];

// следующий id
const getNextId = () => {
  const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
  return maxId + 1;
};

// валидация стоимости
const isValidPrice = (value) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

// Главная
app.get("/", (req, res) => {
  res.send("Сайт работает");
});


// READ all
app.get("/products", (req, res) => {
  res.json(products);
});

// READ by id
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Товар не найден" });
  }

  res.json(product);
});

// CREATE
app.post("/products", (req, res) => {
  const { title, price } = req.body;

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ message: "Поле title обязательно (строка)" });
  }

  if (!isValidPrice(price)) {
    return res
      .status(400)
      .json({ message: "Поле price обязательно (число >= 0)" });
  }

  const newProduct = {
    id: getNextId(),
    title: title.trim(),
    price,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// UPDATE 
app.patch("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Товар не найден" });
  }

  const { title, price } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "title должен быть непустой строкой" });
    }
    product.title = title.trim();
  }

  if (price !== undefined) {
    if (!isValidPrice(price)) {
      return res.status(400).json({ message: "price должен быть числом >= 0" });
    }
    product.price = price;
  }

  res.json(product);
});

// DELETE
app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = products.some((p) => p.id === id);

  if (!exists) {
    return res.status(404).json({ message: "Товар не найден" });
  }

  products = products.filter((p) => p.id !== id);
  res.send("Ok");
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

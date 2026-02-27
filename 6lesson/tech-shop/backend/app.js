const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tech Shop API",
      version: "1.0.0",
      description: "API для управления товарами магазина",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          required: ["name", "category", "description", "price", "stock"],
          properties: {
            id: { type: "string", example: "a1b2c3" },
            name: { type: "string", example: "iPhone 15" },
            category: { type: "string", example: "Смартфоны" },
            description: { type: "string", example: "6.1'' OLED, 128GB" },
            price: { type: "number", example: 99990 },
            stock: { type: "number", example: 10 },
            rating: { type: "number", example: 4.8 },
            image: { type: "string", example: "" },
          },
        },
      },
    },
  },
  apis: ["./app.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// CORS для фронтенда на 3001
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`
    );
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      console.log("Body:", req.body);
    }
  });
  next();
});

// 10 товаров
let products = [
  {
    id: nanoid(6),
    name: "iPhone 15",
    category: "Смартфоны",
    description: "6.1'' OLED, 128GB, A16 Bionic",
    price: 99990,
    stock: 12,
    rating: 4.9,
    image: "",
  },
  {
    id: nanoid(6),
    name: "Samsung Galaxy S24",
    category: "Смартфоны",
    description: "AMOLED 120Hz, 256GB",
    price: 89990,
    stock: 8,
    rating: 4.8,
    image: "",
  },
  {
    id: nanoid(6),
    name: "MacBook Air M3",
    category: "Ноутбуки",
    description: "13'', 16GB RAM, 512GB SSD",
    price: 149990,
    stock: 5,
    rating: 4.9,
    image: "",
  },
  {
    id: nanoid(6),
    name: "ASUS ROG Strix",
    category: "Ноутбуки",
    description: "Игровой ноутбук RTX 4060",
    price: 179990,
    stock: 3,
    rating: 4.7,
    image: "",
  },
  {
    id: nanoid(6),
    name: "Sony WH-1000XM5",
    category: "Наушники",
    description: "Беспроводные, шумоподавление",
    price: 34990,
    stock: 20,
    rating: 4.8,
    image: "",
  },
  {
    id: nanoid(6),
    name: "AirPods Pro 2",
    category: "Наушники",
    description: "ANC, MagSafe зарядка",
    price: 24990,
    stock: 17,
    rating: 4.7,
    image: "",
  },
  {
    id: nanoid(6),
    name: "Apple Watch Series 9",
    category: "Смарт-часы",
    description: "GPS, 45mm",
    price: 49990,
    stock: 10,
    rating: 4.7,
    image: "",
  },
  {
    id: nanoid(6),
    name: "Xiaomi Band 8",
    category: "Фитнес-браслеты",
    description: "AMOLED, до 14 дней работы",
    price: 4990,
    stock: 35,
    rating: 4.5,
    image: "",
  },
  {
    id: nanoid(6),
    name: "PlayStation 5",
    category: "Игровые консоли",
    description: "825GB SSD, 4K",
    price: 69990,
    stock: 6,
    rating: 4.9,
    image: "",
  },
  {
    id: nanoid(6),
    name: "LG UltraGear 27''",
    category: "Мониторы",
    description: "2K IPS, 144Hz",
    price: 32990,
    stock: 9,
    rating: 4.6,
    image: "",
  },
];

// Вспомогательные функции
function findProductOr404(id, res) {
  const item = products.find((p) => p.id === id);
  if (!item) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return item;
}

function normalizeAndValidateProduct(input, { partial = false } = {}) {
  const out = {};
  const errors = [];
  const has = (k) => input?.[k] !== undefined;

  if (!partial || has("name")) {
    const v = String(input?.name ?? "").trim();
    if (!v) errors.push("name is required");
    else out.name = v;
  }

  if (!partial || has("category")) {
    const v = String(input?.category ?? "").trim();
    if (!v) errors.push("category is required");
    else out.category = v;
  }

  if (!partial || has("description")) {
    const v = String(input?.description ?? "").trim();
    if (!v) errors.push("description is required");
    else out.description = v;
  }

  if (!partial || has("price")) {
    const v = Number(input?.price);
    if (!Number.isFinite(v) || v < 0) errors.push("price must be a number >= 0");
    else out.price = v;
  }

  if (!partial || has("stock")) {
    const v = Number(input?.stock);
    if (!Number.isFinite(v) || v < 0) errors.push("stock must be a number >= 0");
    else out.stock = v;
  }

  if (has("rating")) {
    const v = Number(input?.rating);
    if (!Number.isFinite(v) || v < 0 || v > 5) errors.push("rating must be 0..5");
    else out.rating = v;
  }

  if (has("image")) {
    out.image = String(input?.image ?? "").trim();
  }

  return { ok: errors.length === 0, errors, value: out };
}



/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get("/api/products", (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Найденный товар
 *       404:
 *         description: Товар не найден
 */
app.get("/api/products/:id", (req, res) => {
  const item = findProductOr404(req.params.id, res);
  if (!item) return;
  res.json(item);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Товар создан
 *       400:
 *         description: Ошибка валидации
 */
app.post("/api/products", (req, res) => {
  const { ok, errors, value } = normalizeAndValidateProduct(req.body, { partial: false });
  if (!ok) return res.status(400).json({ error: "Validation error", details: errors });

  const newItem = { id: nanoid(6), ...value };
  if (newItem.rating === undefined) newItem.rating = 0;
  if (newItem.image === undefined) newItem.image = "";

  products.push(newItem);
  res.status(201).json(newItem);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Товар обновлен
 *       404:
 *         description: Товар не найден
 */
app.patch("/api/products/:id", (req, res) => {
  const item = findProductOr404(req.params.id, res);
  if (!item) return;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const { ok, errors, value } = normalizeAndValidateProduct(req.body, { partial: true });
  if (!ok) return res.status(400).json({ error: "Validation error", details: errors });

  Object.assign(item, value);
  res.json(item);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Товар удален
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const exists = products.some((p) => p.id === id);
  if (!exists) return res.status(404).json({ error: "Product not found" });

  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// 500
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => console.log(`API: http://localhost:${port}`));

const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
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
      description: "API для практической работы: auth + products CRUD",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Локальный сервер",
      },
    ],
    components: {
      schemas: {
        UserRegisterInput: {
          type: "object",
          required: ["email", "first_name", "last_name", "password"],
          properties: {
            email: { type: "string", example: "ivan@example.com" },
            first_name: { type: "string", example: "Иван" },
            last_name: { type: "string", example: "Иванов" },
            password: { type: "string", example: "qwerty123" },
          },
        },
        UserLoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "ivan@example.com" },
            password: { type: "string", example: "qwerty123" },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            id: { type: "string", example: "V1StGXR8" },
            email: { type: "string", example: "ivan@example.com" },
            first_name: { type: "string", example: "Иван" },
            last_name: { type: "string", example: "Иванов" },
          },
        },
        ProductInput: {
          type: "object",
          required: ["title", "category", "description", "price"],
          properties: {
            title: { type: "string", example: "iPhone 15" },
            category: { type: "string", example: "Смартфоны" },
            description: { type: "string", example: "6.1'' OLED, 128GB" },
            price: { type: "number", example: 99990 },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string", example: "a1b2c3" },
            title: { type: "string", example: "iPhone 15" },
            category: { type: "string", example: "Смартфоны" },
            description: { type: "string", example: "6.1'' OLED, 128GB" },
            price: { type: "number", example: 99990 },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Validation error" },
            details: {
              type: "array",
              items: { type: "string" },
              example: ["email is required"],
            },
          },
        },
      },
    },
  },
  apis: ["./app.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

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

let users = [];
let products = [
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

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  };
}

function findUserByEmail(email) {
  return users.find((u) => u.email === email);
}

function findProductOr404(id, res) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

function normalizeAndValidateRegister(input) {
  const errors = [];

  const email = String(input?.email ?? "").trim().toLowerCase();
  const first_name = String(input?.first_name ?? "").trim();
  const last_name = String(input?.last_name ?? "").trim();
  const password = String(input?.password ?? "");

  if (!email) errors.push("email is required");
  if (!first_name) errors.push("first_name is required");
  if (!last_name) errors.push("last_name is required");
  if (!password) errors.push("password is required");

  if (email && !email.includes("@")) {
    errors.push("email must be valid");
  }

  if (password && password.length < 6) {
    errors.push("password must be at least 6 characters");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: { email, first_name, last_name, password },
  };
}

function normalizeAndValidateLogin(input) {
  const errors = [];

  const email = String(input?.email ?? "").trim().toLowerCase();
  const password = String(input?.password ?? "");

  if (!email) errors.push("email is required");
  if (!password) errors.push("password is required");

  return {
    ok: errors.length === 0,
    errors,
    value: { email, password },
  };
}

function normalizeAndValidateProduct(input) {
  const errors = [];

  const title = String(input?.title ?? "").trim();
  const category = String(input?.category ?? "").trim();
  const description = String(input?.description ?? "").trim();
  const price = Number(input?.price);

  if (!title) errors.push("title is required");
  if (!category) errors.push("category is required");
  if (!description) errors.push("description is required");
  if (!Number.isFinite(price) || price < 0) {
    errors.push("price must be a number >= 0");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: { title, category, description, price },
  };
}

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegisterInput'
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Пользователь уже существует
 */
app.post("/api/auth/register", async (req, res) => {
  const { ok, errors, value } = normalizeAndValidateRegister(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  const exists = findUserByEmail(value.email);
  if (exists) {
    return res.status(409).json({ error: "User with this email already exists" });
  }

  const hashedPassword = await bcrypt.hash(value.password, 10);

  const newUser = {
    id: nanoid(8),
    email: value.email,
    first_name: value.first_name,
    last_name: value.last_name,
    password: hashedPassword,
  };

  users.push(newUser);

  res.status(201).json(sanitizeUser(newUser));
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginInput'
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 login:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Неверный пароль
 *       404:
 *         description: Пользователь не найден
 */
app.post("/api/auth/login", async (req, res) => {
  const { ok, errors, value } = normalizeAndValidateLogin(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  const user = findUserByEmail(value.email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isAuthenticated = await bcrypt.compare(value.password, user.password);

  if (!isAuthenticated) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.status(200).json({
    login: true,
    user: sanitizeUser(user),
  });
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 */
app.post("/api/products", (req, res) => {
  const { ok, errors, value } = normalizeAndValidateProduct(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  const newProduct = {
    id: nanoid(6),
    ...value,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список товаров
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
  res.status(200).json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get("/api/products/:id", (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;

  res.status(200).json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Обновить параметры товара
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
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Товар обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Товар не найден
 */
app.put("/api/products/:id", (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;

  const { ok, errors, value } = normalizeAndValidateProduct(req.body);

  if (!ok) {
    return res.status(400).json({ error: "Validation error", details: errors });
  }

  product.title = value.title;
  product.category = value.category;
  product.description = value.description;
  product.price = value.price;

  res.status(200).json(product);
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
  const exists = products.some((p) => p.id === req.params.id);

  if (!exists) {
    return res.status(404).json({ error: "Product not found" });
  }

  products = products.filter((p) => p.id !== req.params.id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`API: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api-docs`);
});
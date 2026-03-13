const swaggerJsdoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tech Shop API",
      version: "1.0.0",
      description: "API для практической работы 8: JWT и защищенные маршруты",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Локальный сервер",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
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
            id: { type: "string", example: "abc12345" },
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
        AccessTokenResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Invalid credentials" },
            details: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Регистрация пользователя",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserRegisterInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Пользователь зарегистрирован",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserResponse" },
                },
              },
            },
            400: { description: "Ошибка валидации" },
            409: { description: "Пользователь уже существует" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Вход и выдача JWT",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserLoginInput" },
              },
            },
          },
          responses: {
            200: {
              description: "JWT access token",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AccessTokenResponse" },
                },
              },
            },
            400: { description: "Ошибка валидации" },
            401: { description: "Неверные учетные данные" },
            404: { description: "Пользователь не найден" },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Текущий пользователь",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Данные текущего пользователя",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserResponse" },
                },
              },
            },
            401: { description: "Токен отсутствует или невалиден" },
            404: { description: "Пользователь не найден" },
          },
        },
      },
      "/api/products": {
        get: {
          tags: ["Products"],
          summary: "Список товаров",
          responses: {
            200: {
              description: "Список товаров",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Products"],
          summary: "Создать товар",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Товар создан",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Product" },
                },
              },
            },
            400: { description: "Ошибка валидации" },
          },
        },
      },
      "/api/products/{id}": {
        get: {
          tags: ["Products"],
          summary: "Получить товар по id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Товар найден",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Product" },
                },
              },
            },
            401: { description: "Токен отсутствует или невалиден" },
            404: { description: "Товар не найден" },
          },
        },
        put: {
          tags: ["Products"],
          summary: "Обновить товар",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductInput" },
              },
            },
          },
          responses: {
            200: { description: "Товар обновлен" },
            400: { description: "Ошибка валидации" },
            401: { description: "Токен отсутствует или невалиден" },
            404: { description: "Товар не найден" },
          },
        },
        delete: {
          tags: ["Products"],
          summary: "Удалить товар",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            204: { description: "Товар удален" },
            401: { description: "Токен отсутствует или невалиден" },
            404: { description: "Товар не найден" },
          },
        },
      },
    },
  },
  apis: [],
});

module.exports = { swaggerSpec };

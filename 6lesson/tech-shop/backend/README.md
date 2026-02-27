# Tech Shop Backend API

Бэкенд-приложение для управления товарами интернет-магазина.
Реализован REST API с поддержкой CRUD-операций и Swagger-документацией.

## Технологии

- Node.js
- Express
- nanoid
- Swagger (swagger-jsdoc, swagger-ui-express)

## Функциональность

Реализованы следующие операции:

- GET /api/products — получить список товаров
- GET /api/products/:id — получить товар по ID
- POST /api/products — создать товар
- PATCH /api/products/:id — обновить товар
- DELETE /api/products/:id — удалить товар

Добавлены:
- Валидация входных данных
- Middleware логирования
- Обработка 404 и 500 ошибок
- Swagger-документация

## Запуск проекта

1. Установить зависимости:

npm install

2. Запустить сервер:

node app.js

Сервер запустится на:

http://localhost:3000

Swagger доступен по адресу:

http://localhost:3000/api-docs

## Тестирование

Тестирование проводилось через:
- Swagger UI
- Postman
- Браузер

Все CRUD-операции работают корректно.
# Структура данных
- id
- title 
- price

<br>

# API Routes
- _GET_ `/` - возвращает информацию о работе сайта

<br>

- _GET_ `/products` - возвращает массив всех товаров <br>
`curl http://localhost:3000/products`

<br>

- _GET_ `/products/:id` - возвращает товар по id <br>
`curl http://localhost:3000/products/1`

<br>

- _POST_ `/products` - добавляет новый товар
``` 
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Видеокарта RTX 4070\",\"price\":69990}"  
```

<br>

- _PATCH_ `/products/:id` - позволяет обновить данные имени или цены товара по его id
```
curl -X PATCH http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d "{\"price\":74990}"
```

<br>

- _DELETE_ `products/:id` - удаляет товар по его id <br>
`curl -X DELETE http://localhost:3000/products/1`


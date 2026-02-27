import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
  const inStock = product.stock > 0;

  return (
    <div className="card">
      <div className="muted">ID: {product.id}</div>
      <img src={product.image} alt={product.name} className="productImage"/>
      <div className="cardTitle">{product.name}</div>
      <div className="muted">Категория: {product.category}</div>

      <div className="desc">{product.description}</div>

      <div className="priceRow">
        <div className="price">{product.price} ₽</div>
        <div className={inStock ? "stock" : "stock stock--zero"}>
          {inStock ? `На складе: ${product.stock}` : "Нет в наличии"}
        </div>
      </div>

      {"rating" in product && (
        <div className="muted">Рейтинг: {product.rating}</div>
      )}

      <div className="actions">
        <button className="btn" onClick={() => onEdit(product)}>
          Редактировать
        </button>
        <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
          Удалить
        </button>
      </div>
    </div>
  );
}

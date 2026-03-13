import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="muted">ID: {product.id}</div>
      <div className="cardTitle">{product.title}</div>
      <div className="muted">Категория: {product.category}</div>

      <div className="desc">{product.description}</div>

      <div className="priceRow">
        <div className="price">{product.price} ₽</div>
      </div>

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

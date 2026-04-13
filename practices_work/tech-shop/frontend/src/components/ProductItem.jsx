import React from "react";

export default function ProductItem({ product, canDelete, canEdit, onView, onEdit, onDelete }) {
  return (
    <article className="productCard">
      <div className="productCard__meta">ID: {product.id}</div>
      <h3>{product.title}</h3>
      <div className="productCard__category">{product.category}</div>
      <p>{product.description}</p>
      <div className="productCard__footer">
        <strong>{product.price} ₽</strong>
      </div>

      <div className="productCard__actions">
        <button type="button" className="secondaryButton" onClick={() => onView(product.id)}>
          Подробнее
        </button>
        {canEdit ? (
          <button type="button" className="secondaryButton" onClick={() => onEdit(product)}>
            Редактировать
          </button>
        ) : null}
        {canDelete ? (
          <button type="button" className="dangerButton" onClick={() => onDelete(product.id)}>
            Удалить
          </button>
        ) : null}
      </div>
    </article>
  );
}

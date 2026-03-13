import React from "react";

import ProductItem from "./ProductItem";

export default function ProductsList({ products, onView, onEdit, onDelete }) {
  if (!products.length) {
    return <div className="emptyState">Товаров пока нет.</div>;
  }

  return (
    <div className="productsGrid">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

import React from "react";

import ProductItem from "./ProductItem";

export default function ProductsList({
  products,
  canDelete,
  canEdit,
  onView,
  onEdit,
  onDelete,
  token,
}) {
  if (!products.length) {
    return <div className="emptyState">Товаров пока нет.</div>;
  }

  return (
    <div className="productsGrid">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          canDelete={canDelete}
          canEdit={canEdit}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          token={token}
        />
      ))}
    </div>
  );
}

import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!open) return;

    setTitle(initialProduct?.title ?? "");
    setCategory(initialProduct?.category ?? "");
    setDescription(initialProduct?.description ?? "");
    setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
  }, [open, initialProduct]);

  if (!open) return null;

  const modalTitle = mode === "edit" ? "Редактирование товара" : "Создание товара";

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: initialProduct?.id,
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      price: Number(price),
    };

    if (!payload.title) return alert("Введите название");
    if (!payload.category) return alert("Введите категорию");
    if (!payload.description) return alert("Введите описание");
    if (!Number.isFinite(payload.price) || payload.price < 0) {
      return alert("Цена должна быть числом >= 0");
    }

    onSubmit(payload);
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <div className="modal__title">{modalTitle}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например, iPhone 15" autoFocus />
          </label>

          <label className="label">
            Категория
            <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Например, Смартфоны" />
          </label>

          <label className="label">
            Описание
            <textarea className="input textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Краткое описание товара" />
          </label>

          <label className="label">
            Цена
            <input className="input" value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" placeholder="Например, 99990" />
          </label>

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

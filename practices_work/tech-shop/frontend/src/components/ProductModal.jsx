import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle(initialProduct?.title ?? "");
    setCategory(initialProduct?.category ?? "");
    setDescription(initialProduct?.description ?? "");
    setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
  }, [initialProduct, open]);

  if (!open) {
    return null;
  }

  const modalTitle = mode === "edit" ? "Редактирование товара" : "Создание товара";

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      id: initialProduct?.id,
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      price: Number(price),
    };

    if (!payload.title) {
      window.alert("Введите название товара.");
      return;
    }

    if (!payload.category) {
      window.alert("Введите категорию.");
      return;
    }

    if (!payload.description) {
      window.alert("Введите описание.");
      return;
    }

    if (!Number.isFinite(payload.price) || payload.price < 0) {
      window.alert("Цена должна быть числом больше или равным 0.");
      return;
    }

    onSubmit(payload);
  };

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <div
        className="modalCard"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modalCard__header">
          <h3>{modalTitle}</h3>
          <button type="button" className="iconButton" onClick={onClose} aria-label="Закрыть">
            x
          </button>
        </div>

        <form className="modalForm" onSubmit={handleSubmit}>
          <label className="modalField">
            Название
            <input
              className="modalInput"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Например, iPhone 15"
              autoFocus
            />
          </label>

          <label className="modalField">
            Категория
            <input
              className="modalInput"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Например, Смартфоны"
            />
          </label>

          <label className="modalField">
            Описание
            <textarea
              className="modalInput modalInput--textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Опишите товар"
            />
          </label>

          <label className="modalField">
            Цена
            <input
              className="modalInput"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              inputMode="numeric"
              placeholder="Например, 99990"
            />
          </label>

          <div className="modalActions">
            <button type="button" className="secondaryButton" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="primaryButton">
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

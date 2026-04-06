import React, { useEffect, useState } from "react";

const ROLE_OPTIONS = [
  { value: "user", label: "Пользователь" },
  { value: "seller", label: "Продавец" },
  { value: "admin", label: "Администратор" },
];

export default function UserModal({ open, user, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (!open || !user) {
      return;
    }

    setEmail(user.email ?? "");
    setFirstName(user.first_name ?? "");
    setLastName(user.last_name ?? "");
    setRole(user.role ?? "user");
  }, [open, user]);

  if (!open || !user) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      window.alert("Заполните email, имя и фамилию.");
      return;
    }

    onSubmit({
      id: user.id,
      email: email.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      role,
    });
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
          <h3>Редактирование пользователя</h3>
          <button type="button" className="iconButton" onClick={onClose} aria-label="Закрыть">
            x
          </button>
        </div>

        <form className="modalForm" onSubmit={handleSubmit}>
          <label className="modalField">
            Email
            <input
              className="modalInput"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoFocus
            />
          </label>

          <label className="modalField">
            Имя
            <input
              className="modalInput"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>

          <label className="modalField">
            Фамилия
            <input
              className="modalInput"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </label>

          <label className="modalField">
            Роль
            <select className="modalInput" value={role} onChange={(event) => setRole(event.target.value)}>
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="modalActions">
            <button type="button" className="secondaryButton" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="primaryButton">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

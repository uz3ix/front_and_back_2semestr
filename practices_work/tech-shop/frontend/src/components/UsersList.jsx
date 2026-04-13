import React from "react";

const ROLE_LABELS = {
  user: "Пользователь",
  seller: "Продавец",
  admin: "Администратор",
};

export default function UsersList({ users, onEdit, onBlock }) {
  if (!users.length) {
    return <div className="emptyState">Пользователи пока не найдены.</div>;
  }

  return (
    <div className="usersGrid">
      {users.map((user) => (
        <article key={user.id} className="userCard">
          <div className="userCard__meta">ID: {user.id}</div>
          <h3>
            {user.first_name} {user.last_name}
          </h3>
          <div className="userCard__email">{user.email}</div>
          <div className="userCard__badges">
            <span className="pill">{ROLE_LABELS[user.role] ?? user.role}</span>
            {user.blocked ? <span className="pill pill--danger">Заблокирован</span> : null}
          </div>

          <div className="userCard__actions">
            <button type="button" className="secondaryButton" onClick={() => onEdit(user)}>
              Редактировать
            </button>
            {!user.blocked ? (
              <button type="button" className="dangerButton" onClick={() => onBlock(user.id)}>
                Заблокировать
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

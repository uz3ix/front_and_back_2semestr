import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
  return output;
}

// Форма напоминания для товара (практика 17)
function ReminderForm({ product, token, onClose }) {
  const [remindAt, setRemindAt] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!remindAt) return;
    try {
      await fetch(`${API_URL}/api/push/reminder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: `${product.id}-${Date.now()}`,
          title: "⏰ Напоминание — TechStore",
          body: `Не забудьте посмотреть: ${product.title}`,
          remindAt,
        }),
      });
      setStatus("Напоминание установлено!");
      setTimeout(onClose, 1500);
    } catch {
      setStatus("Ошибка при создании напоминания");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "0.5rem" }}>
      <input
        type="datetime-local"
        value={remindAt}
        onChange={(e) => setRemindAt(e.target.value)}
        required
        style={{ marginRight: "0.5rem" }}
      />
      <button type="submit" className="secondaryButton" style={{ marginRight: "0.25rem" }}>
        Сохранить
      </button>
      <button type="button" className="ghostButton" onClick={onClose}>
        Отмена
      </button>
      {status && <span style={{ marginLeft: "0.5rem", fontSize: "0.85rem" }}>{status}</span>}
    </form>
  );
}

// Кнопка «Напомнить об этом товаре» (практика 17)
export function ReminderButton({ product, token }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="ghostButton"
        style={{ fontSize: "0.8rem" }}
        onClick={() => setOpen((v) => !v)}
      >
        ⏰ Напомнить
      </button>
      {open && <ReminderForm product={product} token={token} onClose={() => setOpen(false)} />}
    </div>
  );
}

// Панель включения/отключения push (практики 16–17)
export default function PushNotifications({ token }) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription().then((sub) => setSubscribed(!!sub))
    );
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const subscribe = async () => {
    setLoading(true);
    try {
      if (Notification.permission === "denied") {
        alert("Уведомления заблокированы. Разрешите их в настройках браузера.");
        return;
      }
      if (Notification.permission !== "granted") {
        const perm = await Notification.requestPermission();
        if (perm !== "granted") return;
      }
      const res = await fetch(`${API_URL}/api/push/vapid-public-key`);
      const { publicKey } = await res.json();

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      await fetch(`${API_URL}/api/push/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sub),
      });
      setSubscribed(true);
      setToast("Уведомления включены!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch(`${API_URL}/api/push/unsubscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setSubscribed(false);
      setToast("Уведомления отключены.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        className={subscribed ? "ghostButton" : "secondaryButton"}
        onClick={subscribed ? unsubscribe : subscribe}
        disabled={loading}
        title={subscribed ? "Отключить push-уведомления" : "Включить push-уведомления"}
      >
        {loading ? "..." : subscribed ? "🔔 Уведомления вкл." : "🔕 Уведомления"}
      </button>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            background: "#2563eb",
            color: "#fff",
            padding: "0.75rem 1.25rem",
            borderRadius: 8,
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,.2)",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

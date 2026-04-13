// Push-уведомления (практики 16-17)
const webpush = require("web-push");

const VAPID_PUBLIC_KEY =
  "BNa5v1arRZ-ucePB1vhuSar2bqO44GC6J78Xu0VkNGPNwJvm5Gvk-6V2Q8U1MaszQLUHtcpOOvFAe6BsfzUEdps";
const VAPID_PRIVATE_KEY = "g0UVQJjNnVjWQpoSEnBI9OsLVes62GxTnfrm293KH-0";

webpush.setVapidDetails(
  "mailto:student@example.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Хранилище подписок (практика 16)
let subscriptions = [];

// Хранилище напоминаний: id -> { timeoutId, payload } (практика 17)
const reminders = new Map();

function getVapidPublicKey(req, res) {
  res.json({ publicKey: VAPID_PUBLIC_KEY });
}

function subscribe(req, res) {
  subscriptions.push(req.body);
  res.status(201).json({ message: "Подписка сохранена" });
}

function unsubscribe(req, res) {
  const { endpoint } = req.body;
  subscriptions = subscriptions.filter((s) => s.endpoint !== endpoint);
  res.status(200).json({ message: "Подписка удалена" });
}

// Отправить push всем подписчикам
async function sendPushToAll(payload) {
  const results = await Promise.allSettled(
    subscriptions.map((sub) => webpush.sendNotification(sub, JSON.stringify(payload)))
  );
  // Удаляем «мёртвые» подписки
  subscriptions = subscriptions.filter((_, i) => results[i].status === "fulfilled");
}

// Запланировать напоминание (практика 17)
function scheduleReminder(req, res) {
  const { id, title, body, remindAt } = req.body;
  const delay = new Date(remindAt).getTime() - Date.now();
  if (delay <= 0) {
    return res.status(400).json({ error: "Дата должна быть в будущем" });
  }

  const timeoutId = setTimeout(() => {
    sendPushToAll({ title, body, reminderId: id });
    reminders.delete(id);
  }, delay);

  reminders.set(id, { timeoutId, title, body });
  res.status(201).json({ message: "Напоминание запланировано" });
}

// Отложить напоминание на 5 минут (практика 17)
function snoozeReminder(req, res) {
  const reminderId = req.query.reminderId;
  if (!reminders.has(reminderId)) {
    return res.status(404).json({ error: "Напоминание не найдено" });
  }

  const reminder = reminders.get(reminderId);
  clearTimeout(reminder.timeoutId);

  const newDelay = 5 * 60 * 1000;
  const newTimeoutId = setTimeout(() => {
    sendPushToAll({ title: reminder.title, body: reminder.body, reminderId });
    reminders.delete(reminderId);
  }, newDelay);

  reminders.set(reminderId, { ...reminder, timeoutId: newTimeoutId });
  res.status(200).json({ message: "Отложено на 5 минут" });
}

module.exports = {
  getVapidPublicKey,
  subscribe,
  unsubscribe,
  sendPushToAll,
  scheduleReminder,
  snoozeReminder,
};

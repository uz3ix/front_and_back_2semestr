const express = require("express");
const {
  getVapidPublicKey,
  subscribe,
  unsubscribe,
  scheduleReminder,
  snoozeReminder,
} = require("../controllers/pushController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/vapid-public-key", getVapidPublicKey);
router.post("/subscribe", authMiddleware, subscribe);
router.post("/unsubscribe", authMiddleware, unsubscribe);
router.post("/reminder", authMiddleware, scheduleReminder);
router.post("/snooze", snoozeReminder);

module.exports = router;

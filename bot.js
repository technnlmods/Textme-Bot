require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const ADMIN_ID = Number(process.env.ADMIN_ID);

// Bienvenida
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "👋 Escríbeme y el admin te responderá.");
});

// Reenviar mensajes al admin
bot.on('message', (msg) => {
  const userId = msg.chat.id;

  // evitar loop
  if (userId === ADMIN_ID) return;

  // solo texto (luego ampliamos)
  if (!msg.text) return;

  bot.sendMessage(
    ADMIN_ID,
    `📩 Mensaje de ${userId}:\n\n${msg.text}`
  );
});

// Responder con comando
bot.onText(/\/reply (.+) (.+)/, (msg, match) => {
  if (msg.chat.id !== ADMIN_ID) return;

  const userId = match[1];
  const text = match[2];

  bot.sendMessage(userId, `💬 ${text}`);
});

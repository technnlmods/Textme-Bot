require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const ADMIN_ID = Number(process.env.ADMIN_ID);

// Bienvenida
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "👋 Escríbeme y el admin te responderá.");
});

// Reenviar mensajes al admin (con nombre clickeable)
bot.on('message', (msg) => {
  const userId = msg.chat.id;

  // evitar loop (mensajes tuyos)
  if (userId === ADMIN_ID) return;

  // solo texto por ahora
  if (!msg.text) return;

  const name = `${msg.from.first_name || ''} ${msg.from.last_name || ''}`.trim();
  const username = msg.from.username ? `(@${msg.from.username})` : '';

  bot.sendMessage(
    ADMIN_ID,
    `📩 Mensaje de <a href="tg://user?id=${userId}">${name}</a> ${username}:\n\n${msg.text}`,
    { parse_mode: "HTML" }
  );
});

// Responder con comando
bot.onText(/\/reply (.+) (.+)/, (msg, match) => {
  if (msg.chat.id !== ADMIN_ID) return;

  const userId = match[1];
  const text = match[2];

  bot.sendMessage(userId, `💬 ${text}`);
});

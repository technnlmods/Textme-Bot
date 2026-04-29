require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const ADMIN_ID = Number(process.env.ADMIN_ID);

// Bienvenida
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "👋 Escribe y el admin de TechnNL MODS te responderá.");
});

// Recibir mensajes de usuarios
bot.on('message', (msg) => {
  const userId = msg.chat.id;

  // evitar loop
  if (userId === ADMIN_ID) return;

  if (!msg.text) return;

  const name = `${msg.from.first_name || ''} ${msg.from.last_name || ''}`.trim();
  const username = msg.from.username ? `(@${msg.from.username})` : '';

  bot.sendMessage(
    ADMIN_ID,
    `📩 Mensaje de ${name} ${username}\nID:${userId}\n\n${msg.text}`
  );
});

// RESPONDER DIRECTO (reply real)
bot.on('message', (msg) => {
  if (msg.chat.id !== ADMIN_ID) return;

  if (msg.reply_to_message) {
    const original = msg.reply_to_message.text;

    const match = original.match(/ID:(\d+)/);
    if (!match) return;

    const userId = match[1];

    bot.sendMessage(userId, `💬 ${msg.text}`);
  }
});

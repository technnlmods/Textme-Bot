require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// 🔒 Evitar doble instancia en el mismo proceso
if (global.botStarted) {
  console.log("⚠️ Bot ya iniciado, evitando duplicado");
  process.exit(0);
}
global.botStarted = true;

// 🤖 Crear bot con polling más estable
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});

// 🔥 Eliminar webhook (clave para evitar 409)
bot.deleteWebHook()
  .then(() => console.log("✅ Webhook eliminado"))
  .catch(() => console.log("ℹ️ No había webhook activo"));

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

// RESPONDER DIRECTO (reply)
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

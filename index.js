import { Client } from 'meowsab';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from './sub.js';

/* =========== Client ========== */
const client = new Client({
  phoneNumber: 'YOUR_BOT_NUMBER', // ← ضع رقم البوت هنا مثلاً: 201092178171
  prefix: [".", "/", "!"],
  fromMe: false,
  owners: [
    { name: "𝑬𝑺𝑪𝑨𝑵𝑶𝑹", jid: "201092178171@s.whatsapp.net", lid: "" },
    { name: "𝑮𝒐𝒋𝒐 𝑺𝒂𝒕𝒐𝒓𝒖", jid: "201286691232@s.whatsapp.net", lid: "" },
  ],
  settings: { noWelcome: false },
  commandsPath: './plugins'
});

client.onGroupEvent(group);
client.onCommandAccess(access);

/* =========== Database ========== */
if (!global.db) {
    global.db = new UltraDB();
}

/* =========== Config ========== */
const { config } = client;
config.info = {
  nameBot: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ⚔️",
  nameChannel: "𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑪𝑯𝑨𝑵𝑵𝑬𝑳",
  idChannel: "120363422581600030@newsletter", // ← ضع ID القناة هنا بأمر .id في الجروب
  urls: {
    repo: "https://github.com/moreand458-eng/Admin-bot.git",            // ← رابط البوت على GitHub
    framework: "https://github.com/moreand458-eng/Admin-Framework/tree/main",  // ← رابط الفريم روك
    channel: "https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f"         // ← رابط قناتك
  },
  copyright: {
    pack: '⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹',
    author: '𝑬𝑺𝑪𝑨𝑵𝑶𝑹'
  },
  developers: [
    { name: "𝑬𝑺𝑪𝑨𝑵𝑶𝑹", number: "201092178171" },
    { name: "𝑮𝒐𝒋𝒐 𝑺𝒂𝒕𝒐𝒓𝒖", number: "201286691232" }
  ],
  images: [
    // ← ارفع صور ESCANOR على catbox.moe وضع الروابط هنا
    "https://files.catbox.moe/ESCANOR1.jpg",
    "https://files.catbox.moe/ESCANOR2.jpg",
    "https://files.catbox.moe/ESCANOR3.jpg"
  ]
};

/* =========== Start ========== */
client.start();

setTimeout(async () => {
  if (client.commandSystem) {
    sub(client);
  }
}, 2000);

/* =========== Catch Errors ========== */
process.on('uncaughtException', (e) => {
    if (e.message.includes('rate-overlimit')) return;
    console.error('uncaughtException:', e.message);
});

process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection:', err?.message || err);
});

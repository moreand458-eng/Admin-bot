/* 
  ⚔️ ESCANOR BOT - الاشتراك في مسابقة
*/

import { readFileSync, writeFileSync, existsSync } from 'fs';

const DB_PATH = './system/contests.json';

const loadDB = () => {
    if (!existsSync(DB_PATH)) return { contests: {} };
    try { return JSON.parse(readFileSync(DB_PATH, 'utf-8')); } catch { return { contests: {} }; }
};
const saveDB = (data) => writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

const joinContest = async (m, { conn, bot }) => {
    const db = loadDB();
    const chatId = m.chat;
    const channelName = bot.config.info.nameChannel;
    const channelId = bot.config.info.idChannel;

    if (!db.contests[chatId]?.active) {
        return m.reply("❌ *مفيش مسابقة شغالة دلوقتي!*");
    }

    const alreadyJoined = db.contests[chatId].participants.find(p => p.jid === m.sender);
    if (alreadyJoined) {
        return m.reply(`⚠️ *انت اشتركت قبل كدا!* ✅\n🏆 المسابقة: ${db.contests[chatId].title}`);
    }

    db.contests[chatId].participants.push({
        jid: m.sender,
        name: m.pushName || m.sender.split('@')[0],
        time: Date.now()
    });
    saveDB(db);

    const count = db.contests[chatId].participants.length;

    await conn.sendButton(m.chat, {
        imageUrl: bot.config.info.images[0],
        bodyText: `✅ *تم تسجيل اشتراكك!*\n\n👤 *الاسم:* ${m.pushName || "مجهول"}\n🏆 *المسابقة:* ${db.contests[chatId].title}\n👥 *إجمالي المشتركين:* ${count}\n\n🎯 بالتوفيق!`,
        footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
        buttons: [
            { name: "quick_reply", params: { display_text: "👥 المشتركين", id: ".مشتركين" } }
        ],
        newsletter: { name: channelName, jid: channelId },
        interactiveConfig: { buttons_limits: 1 }
    }, m);
};

joinContest.command = ["اشتراك", "join", "انضمام"];
joinContest.usage = ["اشتراك"];
joinContest.category = "contest";
joinContest.cooldown = 2000;
joinContest.disabled = false;

export default joinContest;

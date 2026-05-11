/* 
  ⚔️ ESCANOR BOT - اختيار فائز
*/

import { readFileSync, writeFileSync, existsSync } from 'fs';

const DB_PATH = './system/contests.json';

const loadDB = () => {
    if (!existsSync(DB_PATH)) return { contests: {} };
    try { return JSON.parse(readFileSync(DB_PATH, 'utf-8')); } catch { return { contests: {} }; }
};
const saveDB = (data) => writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

const pickWinner = async (m, { conn, bot }) => {
    const db = loadDB();
    const chatId = m.chat;
    const channelName = bot.config.info.nameChannel;
    const channelId = bot.config.info.idChannel;

    if (!db.contests[chatId]?.active) {
        return m.reply("❌ *مفيش مسابقة شغالة دلوقتي!*");
    }

    const participants = db.contests[chatId].participants;

    if (participants.length === 0) {
        return m.reply("😢 *مفيش مشتركين في المسابقة!*");
    }

    // =========== تأثير الاختيار العشوائي ===========
    await m.reply("🎰 *جاري الاختيار...*\n⏳ انتظر ثانية!");

    await new Promise(r => setTimeout(r, 2000));

    const winner = participants[Math.floor(Math.random() * participants.length)];
    const winnerTag = `@${winner.jid.split('@')[0]}`;

    db.contests[chatId].active = false;
    db.contests[chatId].winner = winner;
    db.contests[chatId].endTime = Date.now();
    saveDB(db);

    const winnerTxt = `
╔══════════════════╗
║  🎊 الـفـائـز!  ║
║  ⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ⚔️  ║
╚══════════════════╝

🏆 *مبروك الفوز يا بطل!* 🏆

👑 *الفائز:* ${winnerTag}
👤 *الاسم:* ${winner.name}

🎯 *المسابقة:* ${db.contests[chatId].title}
👥 *من بين:* ${participants.length} مشترك

🎊 *ألف مبروك!* 🎊

> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`;

    await conn.sendButton(m.chat, {
        imageUrl: bot.config.info.images[Math.floor(Math.random() * bot.config.info.images.length)],
        bodyText: winnerTxt,
        footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
        buttons: [
            { name: "quick_reply", params: { display_text: "🏆 مسابقة جديدة", id: ".مسابقة مسابقة جديدة" } },
            { name: "cta_url", params: { display_text: "📺 القناة", url: bot.config.info.urls?.channel || "https://whatsapp.com" } }
        ],
        mentions: [winner.jid],
        newsletter: { name: channelName, jid: channelId },
        interactiveConfig: { buttons_limits: 1 }
    }, m);
};

pickWinner.command = ["فائز", "winner", "pick"];
pickWinner.usage = ["فائز"];
pickWinner.category = "contest";
pickWinner.owner = true;
pickWinner.cooldown = 2000;
pickWinner.disabled = false;

export default pickWinner;

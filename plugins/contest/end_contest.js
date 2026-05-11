/* 
  ⚔️ ESCANOR BOT - إنهاء المسابقة
*/

import { readFileSync, writeFileSync, existsSync } from 'fs';

const DB_PATH = './system/contests.json';
const loadDB = () => {
    if (!existsSync(DB_PATH)) return { contests: {} };
    try { return JSON.parse(readFileSync(DB_PATH, 'utf-8')); } catch { return { contests: {} }; }
};
const saveDB = (data) => writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

const endContest = async (m, { conn, bot }) => {
    const db = loadDB();
    const chatId = m.chat;
    const channelName = bot.config.info.nameChannel;
    const channelId = bot.config.info.idChannel;

    if (!db.contests[chatId]?.active) {
        return m.reply("❌ *مفيش مسابقة شغالة دلوقتي!*");
    }

    const title = db.contests[chatId].title;
    const count = db.contests[chatId].participants.length;

    db.contests[chatId].active = false;
    db.contests[chatId].endTime = Date.now();
    saveDB(db);

    await conn.sendButton(m.chat, {
        imageUrl: bot.config.info.images[0],
        bodyText: `🛑 *تم إنهاء المسابقة*\n\n🏆 *العنوان:* ${title}\n👥 *المشتركين:* ${count}\n\nالمسابقة اتغلقت من غير تحديد فائز.`,
        footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
        buttons: [
            { name: "quick_reply", params: { display_text: "🏆 مسابقة جديدة", id: ".مسابقة مسابقة جديدة" } }
        ],
        newsletter: { name: channelName, jid: channelId },
        interactiveConfig: { buttons_limits: 1 }
    }, m);
};

endContest.command = ["انهاء", "end-contest", "stop-contest"];
endContest.usage = ["انهاء"];
endContest.category = "contest";
endContest.owner = true;
endContest.cooldown = 2000;
endContest.disabled = false;

export default endContest;

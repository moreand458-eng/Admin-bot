/* 
  ⚔️ ESCANOR BOT - عرض المشتركين وإنهاء المسابقة
*/

import { readFileSync, writeFileSync, existsSync } from 'fs';

const DB_PATH = './system/contests.json';
const loadDB = () => {
    if (!existsSync(DB_PATH)) return { contests: {} };
    try { return JSON.parse(readFileSync(DB_PATH, 'utf-8')); } catch { return { contests: {} }; }
};
const saveDB = (data) => writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// =========== عرض المشتركين ===========
const listParticipants = async (m, { conn }) => {
    const db = loadDB();
    const chatId = m.chat;

    if (!db.contests[chatId]?.active) {
        return m.reply("❌ *مفيش مسابقة شغالة دلوقتي!*");
    }

    const participants = db.contests[chatId].participants;

    if (participants.length === 0) {
        return m.reply(`🏆 *${db.contests[chatId].title}*\n\n😅 لسه مفيش مشتركين!\nابعت *.اشتراك* للانضمام`);
    }

    const list = participants
        .map((p, i) => `${i + 1}┆ @${p.jid.split('@')[0]}`)
        .join('\n');

    const txt = `
╔══════════════════╗
║  📋 المشتركين   ║
╚══════════════════╝

🏆 *${db.contests[chatId].title}*
👥 *العدد:* ${participants.length} مشترك

${list}

> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`;

    await conn.sendMessage(m.chat, {
        text: txt,
        mentions: participants.map(p => p.jid)
    });
};

listParticipants.command = ["مشتركين", "participants", "قائمة"];
listParticipants.usage = ["مشتركين"];
listParticipants.category = "contest";
listParticipants.cooldown = 5000;
listParticipants.disabled = false;
export default listParticipants;

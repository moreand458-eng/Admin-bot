/* 
  ⚔️ ESCANOR BOT
  قسم: المسابقات
  أوامر: .مسابقة | .اشتراك | .فائز | .مشتركين | .انهاء
  المطور: ESCANOR & Gojo Satoru
*/

import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const DB_PATH = './system/contests.json';

// =========== قراءة وحفظ قاعدة البيانات ===========
const loadDB = () => {
    if (!existsSync(DB_PATH)) {
        writeFileSync(DB_PATH, JSON.stringify({ contests: {} }, null, 2));
        return { contests: {} };
    }
    try {
        return JSON.parse(readFileSync(DB_PATH, 'utf-8'));
    } catch {
        return { contests: {} };
    }
};

const saveDB = (data) => {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// =========== بدء مسابقة ===========
const startContest = async (m, { conn, bot, text }) => {
    const db = loadDB();
    const chatId = m.chat;
    const channelName = bot.config.info.nameChannel;
    const channelId = bot.config.info.idChannel;

    const title = text || "🏆 مسابقة ESCANOR";

    if (db.contests[chatId]?.active) {
        return await conn.sendButton(m.chat, {
            imageUrl: bot.config.info.images[0],
            bodyText: `⚠️ *في مسابقة شغالة حالياً!*\n\n🏆 *العنوان:* ${db.contests[chatId].title}\n👥 *المشتركين:* ${db.contests[chatId].participants.length} شخص\n\n*انهي المسابقة الأول بـ .انهاء*`,
            footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
            buttons: [
                { name: "quick_reply", params: { display_text: "🏆 اختيار فائز", id: ".فائز" } },
                { name: "quick_reply", params: { display_text: "❌ إنهاء المسابقة", id: ".انهاء" } },
                { name: "quick_reply", params: { display_text: "👥 عرض المشتركين", id: ".مشتركين" } }
            ],
            newsletter: { name: channelName, jid: channelId },
            interactiveConfig: { buttons_limits: 1 }
        }, m);
    }

    db.contests[chatId] = {
        active: true,
        title: title,
        participants: [],
        startTime: Date.now(),
        startedBy: m.sender
    };

    saveDB(db);

    const announceTxt = `
╔══════════════════╗
║  🏆 مـسـابـقـة  ║
║  ⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ⚔️  ║
╚══════════════════╝

🎯 *${title}*

📌 *طريقة الاشتراك:*
ابعت الأمر 👇
\`.اشتراك\`

✅ كل شخص يقدر يشترك مرة واحدة بس
🏆 الفائز هيتحدد عشوائياً

> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`;

    await conn.sendButton(m.chat, {
        imageUrl: bot.config.info.images[Math.floor(Math.random() * bot.config.info.images.length)],
        bodyText: announceTxt,
        footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
        buttons: [
            { name: "quick_reply", params: { display_text: "✅ اشترك الآن", id: ".اشتراك" } },
            { name: "quick_reply", params: { display_text: "👥 عدد المشتركين", id: ".مشتركين" } }
        ],
        newsletter: { name: channelName, jid: channelId },
        interactiveConfig: { buttons_limits: 1 }
    }, m);
};

// =========== الاشتراك في المسابقة ===========
const joinContest = async (m, { conn, bot }) => {
    const db = loadDB();
    const chatId = m.chat;
    const channelName = bot.config.info.nameChannel;
    const channelId = bot.config.info.idChannel;

    if (!db.contests[chatId]?.active) {
        return m.reply("❌ *مفيش مسابقة شغالة دلوقتي!*\nانتظر المطور يبدأ مسابقة بأمر .مسابقة");
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
        bodyText: `✅ *تم تسجيل اشتراكك!*\n\n👤 *الاسم:* ${m.pushName || "مجهول"}\n🏆 *المسابقة:* ${db.contests[chatId].title}\n👥 *إجمالي المشتركين:* ${count}\n\n> بالتوفيق! 🎯`,
        footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
        buttons: [
            { name: "quick_reply", params: { display_text: "👥 المشتركين", id: ".مشتركين" } }
        ],
        newsletter: { name: channelName, jid: channelId },
        interactiveConfig: { buttons_limits: 1 }
    }, m);
};

// =========== اختيار فائز عشوائي ===========
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
        return m.reply("😢 *مفيش مشتركين في المسابقة!*\nانتظر الناس تشترك أول.");
    }

    // اختيار عشوائي
    const winner = participants[Math.floor(Math.random() * participants.length)];
    const winnerTag = `@${winner.jid.split('@')[0]}`;

    const winnerTxt = `
╔══════════════════╗
║  🏆 الـفـائـز!  ║
║  ⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ⚔️  ║
╚══════════════════╝

🎊 *مبروك الفوز!* 🎊

🏆 *الفائز:* ${winnerTag}
👤 *الاسم:* ${winner.name}

🎯 *المسابقة:* ${db.contests[chatId].title}
👥 *من بين:* ${participants.length} مشترك

> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`;

    // إيقاف المسابقة بعد اختيار الفائز
    db.contests[chatId].active = false;
    db.contests[chatId].winner = winner;
    db.contests[chatId].endTime = Date.now();
    saveDB(db);

    await conn.sendButton(m.chat, {
        imageUrl: bot.config.info.images[Math.floor(Math.random() * bot.config.info.images.length)],
        bodyText: winnerTxt,
        footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
        buttons: [
            { name: "quick_reply", params: { display_text: "🏆 مسابقة جديدة", id: ".مسابقة مسابقة جديدة" } }
        ],
        mentions: [winner.jid],
        newsletter: { name: channelName, jid: channelId },
        interactiveConfig: { buttons_limits: 1 }
    }, m);
};

// =========== عرض المشتركين ===========
const listParticipants = async (m, { conn, bot }) => {
    const db = loadDB();
    const chatId = m.chat;
    const channelName = bot.config.info.nameChannel;
    const channelId = bot.config.info.idChannel;

    if (!db.contests[chatId]?.active) {
        return m.reply("❌ *مفيش مسابقة شغالة دلوقتي!*");
    }

    const participants = db.contests[chatId].participants;

    if (participants.length === 0) {
        return m.reply(`🏆 *${db.contests[chatId].title}*\n\n😅 لسه مفيش مشتركين!\nابعت .اشتراك للانضمام`);
    }

    const list = participants
        .map((p, i) => `${i + 1}. @${p.jid.split('@')[0]} (${p.name})`)
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

// =========== إنهاء المسابقة ===========
const endContest = async (m, { conn, bot }) => {
    const db = loadDB();
    const chatId = m.chat;

    if (!db.contests[chatId]?.active) {
        return m.reply("❌ *مفيش مسابقة شغالة دلوقتي!*");
    }

    const title = db.contests[chatId].title;
    const count = db.contests[chatId].participants.length;

    db.contests[chatId].active = false;
    db.contests[chatId].endTime = Date.now();
    saveDB(db);

    return m.reply(`🛑 *تم إنهاء المسابقة*\n\n🏆 *العنوان:* ${title}\n👥 *المشتركين:* ${count}\nالمسابقة اتغلقت من غير تحديد فائز.`);
};

// =========== تصدير الأوامر ===========

startContest.command = ["مسابقة", "contest", "start-contest"];
startContest.usage = ["مسابقة"];
startContest.category = "contest";
startContest.owner = true;
startContest.cooldown = 2000;
startContest.disabled = false;
export { startContest as default };

// سيتم عمل ملفات منفصلة للأوامر الباقية

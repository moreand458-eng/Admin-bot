/* 
  ⚔️ ESCANOR BOT - تفعيل/تعطيل الترحيب
*/

const welcome = async (m, { conn, bot, args }) => {
    const { nameChannel, idChannel } = bot.config.info;

    if (!m.chat.includes('@g.us')) {
        return m.reply("❌ *الأمر ده للجروبات بس!*");
    }

    if (!global.db) return m.reply("❌ قاعدة البيانات مش شغالة!");

    const chatId = m.chat;
    const current = global.db.groups?.[chatId]?.noWelcome;

    const action = args[0]?.toLowerCase();

    if (!action || !["on", "off", "تشغيل", "ايقاف"].includes(action)) {
        const status = current ? "🔴 مطفي" : "🟢 شغال";
        return await conn.sendButton(m.chat, {
            imageUrl: bot.config.info.images[0],
            bodyText: `⚔️ *نظام الترحيب*\n\n📊 *الحالة الحالية:* ${status}\n\n📌 *الاستخدام:*\n\`\`\`.ترحيب تشغيل\n.ترحيب ايقاف\`\`\``,
            footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
            buttons: [
                { name: "quick_reply", params: { display_text: "🟢 تشغيل الترحيب", id: ".ترحيب تشغيل" } },
                { name: "quick_reply", params: { display_text: "🔴 إيقاف الترحيب", id: ".ترحيب ايقاف" } }
            ],
            newsletter: { name: nameChannel, jid: idChannel },
            interactiveConfig: { buttons_limits: 1 }
        }, m);
    }

    if (action === "تشغيل" || action === "on") {
        global.db.groups[chatId] = { ...global.db.groups[chatId], noWelcome: false };
        return m.reply("🟢 *تم تشغيل الترحيب بالأعضاء الجدد!*\nدلوقتي البوت هيرحب بكل عضو جديد.");
    }

    if (action === "ايقاف" || action === "off") {
        global.db.groups[chatId] = { ...global.db.groups[chatId], noWelcome: true };
        return m.reply("🔴 *تم إيقاف الترحيب!*\nمش هيبعت رسالة ترحيب للأعضاء الجدد.");
    }
};

welcome.command = ["ترحيب", "welcome"];
welcome.usage = ["ترحيب"];
welcome.category = "admins";
welcome.admin = true;
welcome.group = true;
welcome.cooldown = 2000;
welcome.disabled = false;

export default welcome;

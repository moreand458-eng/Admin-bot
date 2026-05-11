/* 
  ⚔️ ESCANOR BOT
  قسم: إدارة القناة
  أمر: .نشر | .channel
  الوصف: بيبعت المنشور للقناة مباشرة
  المطور: ESCANOR & Gojo Satoru
*/

const broadcast = async (m, { conn, bot, text, args }) => {
    
    const channelId = bot.config.info.idChannel;
    const channelName = bot.config.info.nameChannel;

    if (!channelId || channelId === "CHANNEL_ID@newsletter") {
        return m.reply("❌ *لسه محددتش ID القناة!*\nروح index.js وحط الـ ID في idChannel");
    }

    // لو بيرد على رسالة فيها صورة أو فيديو
    const quoted = m.quoted;

    if (!text && !quoted) {
        return await conn.sendButton(m.chat, {
            imageUrl: bot.config.info.images[0],
            bodyText: `*⚔️ أمر النشر في القناة*\n\n📌 *الاستخدام:*\n\`\`\`\n.نشر نص المنشور هنا\n\`\`\`\nأو ارد على صورة/فيديو بـ .نشر\n\n📢 *القناة:* ${channelName}`,
            footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
            buttons: [
                { name: "quick_reply", params: { display_text: "📢 نشر نص تجريبي", id: ".نشر هذا منشور تجريبي من ESCANOR BOT ⚔️" } },
                { name: "cta_url", params: { display_text: "📺 فتح القناة", url: bot.config.info.urls?.channel || "https://whatsapp.com" } }
            ],
            newsletter: { name: channelName, jid: channelId },
            interactiveConfig: { buttons_limits: 1 }
        }, m);
    }

    try {
        // =========== نشر نص ===========
        if (text && !quoted) {
            await conn.sendMessage(channelId, { text: text });
            return await conn.sendButton(m.chat, {
                imageUrl: bot.config.info.images[Math.floor(Math.random() * bot.config.info.images.length)],
                bodyText: `✅ *تم النشر بنجاح!*\n\n📢 *القناة:* ${channelName}\n📝 *المنشور:*\n${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`,
                footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
                buttons: [
                    { name: "cta_url", params: { display_text: "📺 مشاهدة في القناة", url: bot.config.info.urls?.channel || "https://whatsapp.com" } }
                ],
                newsletter: { name: channelName, jid: channelId },
                interactiveConfig: { buttons_limits: 1 }
            }, m);
        }

        // =========== نشر صورة ===========
        if (quoted?.type === "imageMessage") {
            const buffer = await quoted.download();
            const caption = text || quoted.caption || "";
            await conn.sendMessage(channelId, { image: buffer, caption: caption });
            return m.reply(`✅ *تم نشر الصورة في القناة!*\n📢 ${channelName}`);
        }

        // =========== نشر فيديو ===========
        if (quoted?.type === "videoMessage") {
            const buffer = await quoted.download();
            const caption = text || quoted.caption || "";
            await conn.sendMessage(channelId, { video: buffer, caption: caption });
            return m.reply(`✅ *تم نشر الفيديو في القناة!*\n📢 ${channelName}`);
        }

        // =========== نشر صوت ===========
        if (quoted?.type === "audioMessage") {
            const buffer = await quoted.download();
            await conn.sendMessage(channelId, { audio: buffer, mimetype: "audio/mp4" });
            return m.reply(`✅ *تم نشر الصوت في القناة!*\n📢 ${channelName}`);
        }

        // =========== نشر ملصق ===========
        if (quoted?.type === "stickerMessage") {
            const buffer = await quoted.download();
            await conn.sendMessage(channelId, { sticker: buffer });
            return m.reply(`✅ *تم نشر الملصق في القناة!*\n📢 ${channelName}`);
        }

        return m.reply("❓ نوع الرسالة ده مش مدعوم للنشر حالياً.");

    } catch (e) {
        console.error("Broadcast Error:", e.message);
        return m.reply(`❌ *فشل النشر!*\nالخطأ: ${e.message}`);
    }
};

broadcast.command = ["نشر", "channel", "بث"];
broadcast.usage = ["نشر"];
broadcast.category = "channel";
broadcast.owner = true; // للمطورين فقط
broadcast.cooldown = 3000;
broadcast.disabled = false;

export default broadcast;

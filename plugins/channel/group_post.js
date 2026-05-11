/* 
  ⚔️ ESCANOR BOT
  قسم: إدارة القناة
  أمر: .جروب | .group-post
  الوصف: بيبعت منشور في الجروب الحالي بستايل القناة
  المطور: ESCANOR & Gojo Satoru
*/

const groupPost = async (m, { conn, bot, text, args }) => {
    
    const channelName = bot.config.info.nameChannel;
    const channelId = bot.config.info.idChannel;
    const quoted = m.quoted;

    if (!text && !quoted) {
        return await conn.sendButton(m.chat, {
            imageUrl: bot.config.info.images[0],
            bodyText: `*⚔️ أمر النشر في الجروب*\n\n📌 *الاستخدام:*\n\`\`\`\n.جروب نص المنشور\n\`\`\`\nأو ارد على صورة/فيديو بـ .جروب`,
            footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
            buttons: [
                { name: "quick_reply", params: { display_text: "📝 نشر نص", id: ".جروب اكتب نصك هنا" } },
            ],
            newsletter: { name: channelName, jid: channelId },
            interactiveConfig: { buttons_limits: 1 }
        }, m);
    }

    try {
        // =========== نشر نص في الجروب ===========
        if (text && !quoted) {
            const postText = `
╔══════════════════╗
║  ⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ⚔️  ║
╚══════════════════╝

${text}

> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`;

            await conn.msgUrl(m.chat, postText, {
                img: bot.config.info.images[Math.floor(Math.random() * bot.config.info.images.length)],
                title: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
                body: "𝑬𝑺𝑪𝑨𝑵𝑶𝑹 - 𝑫𝒆𝒗 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 & 𝑮𝒐𝒋𝒐",
                newsletter: { name: channelName, jid: channelId },
                big: true
            });
            return;
        }

        // =========== نشر صورة في الجروب ===========
        if (quoted?.type === "imageMessage") {
            const buffer = await quoted.download();
            const caption = text
                ? `${text}\n\n> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`
                : `> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`;
            await conn.sendMessage(m.chat, { image: buffer, caption });
            return;
        }

        // =========== نشر فيديو في الجروب ===========
        if (quoted?.type === "videoMessage") {
            const buffer = await quoted.download();
            const caption = text
                ? `${text}\n\n> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`
                : `> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`;
            await conn.sendMessage(m.chat, { video: buffer, caption });
            return;
        }

    } catch (e) {
        console.error("Group Post Error:", e.message);
        return m.reply(`❌ فشل النشر: ${e.message}`);
    }
};

groupPost.command = ["جروب", "group-post", "بوست"];
groupPost.usage = ["جروب"];
groupPost.category = "channel";
groupPost.owner = true;
groupPost.cooldown = 3000;
groupPost.disabled = false;

export default groupPost;

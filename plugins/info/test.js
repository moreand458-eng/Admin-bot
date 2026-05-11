/* 
  ⚔️ ESCANOR BOT - أمر التست
  المطور: ESCANOR
*/

const test = async (m, { conn, bot }) => {
    const { nameBot, nameChannel, idChannel, urls } = bot.config.info;

    const ping = Date.now() - (m.messageTimestamp * 1000);
    const pingText = ping > 0 ? `${ping}ms` : `${Math.abs(ping)}ms`;

    const txt = `
╔═══════════════════╗
║  ⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻 ⚔️  ║
╚═══════════════════╝

L┆ *تست البوت* ┆ꓶ
> ✅ البوت شغال تمام!

L┆ *السرعة* ┆ꓶ
> ⚡ ${pingText}

L┆ *الحالة* ┆ꓶ
> 🟢 أونلاين

L┆ *الاسم* ┆ꓶ
> ${nameBot}

> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`;

    await conn.sendButton(m.chat, {
        imageUrl: bot.config.info.images[Math.floor(Math.random() * bot.config.info.images.length)],
        bodyText: txt,
        footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻 | Dev ESCANOR",
        buttons: [
            { name: "cta_url", params: { display_text: "📺 القناة", url: urls?.channel || "https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f" } },
            { name: "cta_url", params: { display_text: "💻 GitHub", url: urls?.repo || "https://github.com/moreand458-eng/Admin-bot" } },
            { name: "cta_url", params: { display_text: "🔗 البوت", url: "https://is.gd/JEu6nK" } }
        ],
        newsletter: { name: nameChannel, jid: idChannel },
        interactiveConfig: { buttons_limits: 1 }
    }, m);
};

test.command = ["تست", "test", "ping", "بينج"];
test.usage = ["تست"];
test.category = "info";
test.cooldown = 5000;
test.disabled = false;

export default test;

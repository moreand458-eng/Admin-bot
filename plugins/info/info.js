/* 
  ⚔️ ESCANOR BOT - معلومات البوت
*/

import os from 'os';

const info = async (m, { conn, bot }) => {
    const { nameBot, nameChannel, idChannel, developers, urls } = bot.config.info;

    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const mem = process.memoryUsage();
    const ramUsed = (mem.rss / 1024 / 1024).toFixed(1);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(0);

    const devList = developers?.map(d => `⚔️ ${d.name}`).join('\n') || '⚔️ ESCANOR';

    const infoTxt = `
╔═══════════════════╗
║  ⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻 ⚔️  ║
╚═══════════════════╝

L┆ *اسم البوت* ┆ꓶ
> ${nameBot}

L┆ *القناة* ┆ꓶ
> ${nameChannel}

L┆ *وقت التشغيل* ┆ꓶ
> ${hours}س ${minutes}د ${seconds}ث

L┆ *استخدام الرام* ┆ꓶ
> ${ramUsed} MB / ${totalRam} MB

L┆ *المطورون* ┆ꓶ
${devList}

L┆ *الفريم روك* ┆ꓶ
> meowsab (WS Framework)

> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`;

    await conn.sendButton(m.chat, {
        imageUrl: bot.config.info.images[Math.floor(Math.random() * bot.config.info.images.length)],
        bodyText: infoTxt,
        footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
        buttons: [
            { name: "cta_url", params: { display_text: "💻 GitHub البوت", url: urls?.repo || "https://github.com" } },
            { name: "cta_url", params: { display_text: "🔧 الفريم روك", url: urls?.framework || "https://github.com" } },
            { name: "cta_url", params: { display_text: "📺 القناة", url: urls?.channel || "https://whatsapp.com" } }
        ],
        newsletter: { name: nameChannel, jid: idChannel },
        interactiveConfig: { buttons_limits: 1 }
    }, m);
};

info.command = ["info", "معلومات", "عني"];
info.usage = ["معلومات"];
info.category = "info";
info.cooldown = 5000;
info.disabled = false;

export default info;

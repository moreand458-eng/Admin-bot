/* 
  ⚔️ ESCANOR BOT - معلومات المطورين
*/

const devInfo = async (m, { conn, bot }) => {
    const { nameChannel, idChannel, developers } = bot.config.info;

    const txt = `
╔═══════════════════╗
║  ⚔️ المطورون ⚔️  ║
╚═══════════════════╝

L┆ *المطور الأول* ┆ꓶ
⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹*
📞 wa.me/201092178171

L┆ *المطور الثاني* ┆ꓶ
⚔️ *𝑮𝒐𝒋𝒐 𝑺𝒂𝒕𝒐𝒓𝒖*
📞 wa.me/201286691232

> *للتواصل أو الاستفسار تواصل معنا*`;

    await conn.sendButton(m.chat, {
        imageUrl: bot.config.info.images[0],
        bodyText: txt,
        footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
        buttons: [
            { name: "cta_call", params: { display_text: "📞 ESCANOR", phone_number: "201092178171" } },
            { name: "cta_call", params: { display_text: "📞 Gojo Satoru", phone_number: "201286691232" } },
            { name: "cta_url", params: { display_text: "📺 القناة", url: bot.config.info.urls?.channel || "https://whatsapp.com" } }
        ],
        newsletter: { name: nameChannel, jid: idChannel },
        interactiveConfig: { buttons_limits: 1 }
    }, m);
};

devInfo.command = ["مطور", "developer", "dev", "المطور"];
devInfo.usage = ["مطور"];
devInfo.category = "info";
devInfo.cooldown = 3000;
devInfo.disabled = false;

export default devInfo;

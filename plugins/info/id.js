/* 
  ⚔️ ESCANOR BOT - جلب ID الجروب أو القناة
*/

const getId = async (m, { conn }) => {
    const jid = m.chat;
    const type = jid.includes('@newsletter')
        ? '📢 قناة'
        : jid.includes('@g.us')
        ? '👥 جروب'
        : '👤 خاص';

    const txt = `
╔═══════════════════╗
║  🆔 مـعـرف الـچـات  ║
╚═══════════════════╝

L┆ *النوع* ┆ꓶ
> ${type}

L┆ *الـ ID* ┆ꓶ
\`\`\`${jid}\`\`\`

L┆ *معرف المرسل* ┆ꓶ
\`\`\`${m.sender}\`\`\`

> *انسخ الـ ID وضعه في index.js*`;

    m.reply(txt);
};

getId.command = ["id", "معرف", "جيت-آيدي"];
getId.usage = ["id"];
getId.category = "info";
getId.owner = true;
getId.cooldown = 2000;
getId.disabled = false;

export default getId;

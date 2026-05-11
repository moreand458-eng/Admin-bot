import fs from "fs";
import path from "path";

/* =========================================
   ESCANOR BOT - Group Events Handler
   المطور: ESCANOR & Gojo Satoru
   ========================================= */

const group = async (ctx, event, eventType) => {
    try {
        if (!event?.participants) return null;

        const participants = event.participants
            .filter(p => p?.phoneNumber)
            .map(p => p.phoneNumber);

        const author = event.author;

        const users = participants.length
            ? participants.map(p => '@' + p.split('@')[0]).join(' و ')
            : 'مجهول';

        const authorTag = author ? '@' + author.split('@')[0] : 'أدمن';

        // =========== رسائل الأحداث ===========
        const messages = {
            add: `
╔══════════════════╗
║  ⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ⚔️  ║
╚══════════════════╝

🌟 *أهـلاً وسـهـلاً* 🌟
*${users}*

نـورت الجـروب يـا صـديـق 🎉
نتمنى تلاقي كل اللي تدور عليه هنا

${authorTag === users ? "" : `> *أُضيف بواسطة:* ${authorTag}`}

> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`,

            remove: `
╔══════════════════╗
║  ⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ⚔️  ║
╚══════════════════╝

👋 *وداعاً*
*${users}*

مع السلامة، كنت عضو محترم 🥀

${authorTag === users ? "" : `> *أُزيل بواسطة:* ${authorTag}`}`,

            promote: `
╔══════════════════╗
║  ⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ⚔️  ║
╚══════════════════╝

🎖️ *مبروك الإدارة!*
*${users}*

تم ترقيتك لأدمن 🏆
${`> *بواسطة:* ${authorTag}`}`,

            demote: `
╔══════════════════╗
║  ⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ⚔️  ║
╚══════════════════╝

📉 *تم خفض الرتبة*
*${users}*

رجعت عضو عادي 😅
${`> *بواسطة:* ${authorTag}`}`
        };

        let txt = messages[eventType];
        if (!txt) return null;

        // لو الترحيب مطفي في الجروب
        if (global.db?.groups?.[event.chat]?.noWelcome === true) return 9999;

        const img = ["add", "remove"].includes(eventType)
            ? (event.userUrl || "https://files.catbox.moe/hm9iq4.jpg")
            : "https://files.catbox.moe/hm9iq4.jpg";

        const { config } = ctx;

        await ctx.sock.msgUrl(event.chat, txt, {
            img,
            title: config?.info?.nameBot || "⚔️ ESCANOR BOT",
            body: "𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻 - 𝑫𝒆𝒗 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 & 𝑮𝒐𝒋𝒐",
            mentions: author ? [author, ...participants] : participants,
            newsletter: {
                name: config?.info?.nameChannel || "𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑪𝑯𝑨𝑵𝑵𝑬𝑳",
                jid: config?.info?.idChannel || ""
            },
            big: ["add", "remove"].includes(eventType)
        });

    } catch (e) {
        console.error("Group Event Error:", e.message);
    }
    return null;
};

/* =========================================
   Access Control - رسائل تحقق الصلاحيات
   ========================================= */

const access = async (msg, checkType, time) => {
    const conn = await msg.client();

    const quoted = {
        key: {
            participant: `${msg.sender.split('@')[0]}@s.whatsapp.net`,
            remoteJid: 'status@broadcast',
            fromMe: false,
        },
        message: {
            contactMessage: {
                displayName: `${msg.pushName}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${msg.pushName}\nitem1.TEL;waid=${msg.sender.split('@')[0]}:${msg.sender.split('@')[0]}\nEND:VCARD`,
            },
        },
        participant: '0@s.whatsapp.net',
    };

    const messages = {
        cooldown: `*⏳ استنى ${time ? (time >= 1000 ? Math.ceil(time / 1000) : time) : 60} ثانية يا صديق ⏳*\n⊱⋅ ──────────── ⋅⊰\n> *_لازم تصبر شوية عشان الأمر ده مينفعش فيه سبام_*`,
        owner: `*⚔️ الأمر ده للمطورين فقط ⚔️*\n⊱⋅ ──────────── ⋅⊰\n> *_لازم تكون مطور عشان تستخدم الأمر ده_*`,
        group: `*💠 الأمر ده بيشتغل في الجروبات بس 💠*\n⊱⋅ ──────────── ⋅⊰\n> *_استخدم الأمر داخل جروب_*`,
        admin: `*📯 الأمر ده للأدمن فقط 📯*\n⊱⋅ ──────────── ⋅⊰\n> *_لازم تبقى أدمن عشان تستخدم الأمر ده_*`,
        private: `*🏷️ الأمر ده في الخاص فقط 🏷️*\n⊱⋅ ──────────── ⋅⊰\n> *_ابعتلي الأمر ده في الخاص_*`,
        botAdmin: `*📌 لازم تحطني أدمن الأول 📌*\n⊱⋅ ──────────── ⋅⊰\n> *_حطني أدمن في الجروب عشان ينفذ الأمر_*`,
        noSub: `*🫒 الأمر ده للبوت الأساسي فقط 🫒*\n⊱⋅ ──────────── ⋅⊰\n> *_استخدم البوت الأساسي_*`,
        disabled: `*🗃️ الأمر متوقف مؤقتاً 🗃️*\n⊱⋅ ──────────── ⋅⊰\n> *_الأمر تحت الصيانة، هيرجع قريباً_*`,
        error: `*❌ فيه خطأ في الأمر ❌*\n⊱⋅ ──────────── ⋅⊰\n*_تواصل مع المطور بأمر .مطور_*`
    };

    if (conn && messages[checkType]) {
        await conn.msgUrl(msg.chat, messages[checkType], {
            img: "https://i.postimg.cc/QdPTX5Mb/4d37adc50be39ce5140817dc2b470b85.jpg",
            title: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 | تنبيه",
            body: "𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻 - 𝑨𝒍𝒆𝒓𝒕𝒔",
            newsletter: {
                name: "𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑪𝑯𝑨𝑵𝑵𝑬𝑳",
                jid: global.escanorConfig?.idChannel || ""
            },
            big: false
        }, quoted);
        return false;
    }
    return null;
};

export { access, group };

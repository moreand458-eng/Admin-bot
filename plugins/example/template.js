/* 
  ╔══════════════════════════════════╗
  ║   ⚔️ ESCANOR BOT - قالب الأوامر  ║
  ╚══════════════════════════════════╝

  📌 كيفية إضافة أمر جديد:
  1. انسخ الملف ده وعدل فيه
  2. غير اسم الدالة والأوامر
  3. اكتب الكود في الجزء المخصص
  4. البوت هيشيله تلقائياً بدون ريستارت
*/

const myCommand = async (m, { conn, bot, text, args, quoted }) => {

    const { nameChannel, idChannel, images } = bot.config.info;

    // =========================================
    // ← اكتب كودك هنا ↓
    // =========================================

    // مثال 1: رد نصي بسيط
    // return m.reply("مرحباً! ده رد بسيط");

    // مثال 2: رسالة بزر
    await conn.sendButton(m.chat, {
        imageUrl: images[0],
        bodyText: `⚔️ *الأمر الجديد*\n\nاكتب هنا وصف الأمر\n\n> ⚔️ *𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻*`,
        footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻",
        buttons: [
            // زر رد سريع
            { name: "quick_reply", params: { display_text: "✅ زر 1", id: ".أمر_آخر" } },
            // زر رابط
            { name: "cta_url", params: { display_text: "🔗 رابط", url: "https://example.com" } },
            // زر اتصال
            { name: "cta_call", params: { display_text: "📞 اتصال", phone_number: "201092178171" } },
            // قائمة منسدلة
            { name: "single_select", params: {
                title: "📋 اختر",
                sections: [{
                    title: "الخيارات",
                    rows: [
                        { title: "خيار 1", description: "وصف الخيار 1", id: "opt1" },
                        { title: "خيار 2", description: "وصف الخيار 2", id: "opt2" }
                    ]
                }]
            }}
        ],
        newsletter: { name: nameChannel, jid: idChannel },
        interactiveConfig: { buttons_limits: 1 }
    }, m);

    // =========================================
};

// =========== إعدادات الأمر ===========

// الأوامر التي تشغل الكود (مثلاً .test أو .تست)
myCommand.command = ["test", "تست"];

// الأمر الذي يظهر في القائمة
myCommand.usage = ["test"];

// القسم الذي ينتمي إليه في القائمة
// channel | contest | admins | owner | info | example
myCommand.category = "example";

// هل الأمر للمطورين فقط؟
myCommand.owner = false;

// هل يحتاج صلاحية أدمن؟
myCommand.admin = false;

// هل يشتغل في الجروبات فقط؟
myCommand.group = false;

// وقت الانتظار بين الاستخدامات (milliseconds)
myCommand.cooldown = 2000;

// هل الأمر معطل؟
myCommand.disabled = false;

export default myCommand;

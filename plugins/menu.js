/* 
  ⚔️ ESCANOR BOT - القائمة الرئيسية
  المطور: ESCANOR & Gojo Satoru
*/

const MENU_TIMEOUT = 120000;

const CATEGORIES = [
    [1, 'إدارة القناة', 'channel', '📢'],
    [2, 'المسابقات', 'contest', '🏆'],
    [3, 'الجروبات', 'admins', '👥'],
    [4, 'المطورين', 'owner', '⚔️'],
    [5, 'معلومات البوت', 'info', '🗃️'],
    [6, 'مثال للأوامر', 'example', '✳️'],
];

if (!global.menus) global.menus = {};

const clean = () => {
    const now = Date.now();
    Object.keys(global.menus).forEach(k => {
        if (now - global.menus[k].time > MENU_TIMEOUT) delete global.menus[k];
    });
};

const getImg = (bot) => {
    const { images } = bot.config.info;
    return Array.isArray(images)
        ? images[Math.floor(Math.random() * images.length)]
        : images;
};

const menu = async (m, { conn, bot }) => {
    clean();

    const cmds = await bot.getAllCommands();
    const cats = {};

    cmds.forEach(c => {
        if (!c.usage?.length) return;
        const cat = c.category || 'other';
        if (!cats[cat]) cats[cat] = [];
        cats[cat].push(c);
    });

    const img = getImg(bot);
    const { nameBot, nameChannel, idChannel, developers } = bot.config.info;

    const headerTxt = `
╔═══════════════════╗
║  ⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻 ⚔️  ║
╚═══════════════════╝

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

${CATEGORIES.map(c => `L┆ قـسـم ${c[1]} ${c[3]} ┆ꓶ`).join('\n')}

╔═══════════════════╗
║  المطورون        ║
╚═══════════════════╝
${developers?.map(d => `⚔️ ${d.name}`).join('\n') || '⚔️ ESCANOR'}

> *اضغط على القسم من القائمة لعرض الأوامر*`;

    const sections = CATEGORIES.map(cat => ({
        title: `${cat[3]} ${cat[1]}`,
        rows: (cats[cat[2]] || []).slice(0, 10).map(cmd => ({
            title: `${cat[3]} .${cmd.usage?.[0] || cmd.command?.[0]}`,
            description: cmd.description || `أمر ${cmd.usage?.[0]}`,
            id: `.${cmd.usage?.[0] || cmd.command?.[0]}`
        })).concat(
            (cats[cat[2]] || []).length === 0 ? [{
                title: `${cat[3]} لا توجد أوامر`,
                description: 'لا توجد أوامر في هذا القسم',
                id: `no_cmd_${cat[2]}`
            }] : []
        )
    }));

    await conn.sendButton(m.chat, {
        imageUrl: img,
        bodyText: headerTxt,
        footerText: "⚔️ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻 | 𝑫𝒆𝒗 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 & 𝑮𝒐𝒋𝒐",
        buttons: [
            {
                name: "single_select",
                params: {
                    title: "📋 اختر القسم",
                    sections: sections
                }
            },
            { name: "cta_url", params: { display_text: "📺 القناة", url: bot.config.info.urls?.channel || "https://whatsapp.com" } },
            { name: "cta_url", params: { display_text: "💻 GitHub البوت", url: bot.config.info.urls?.repo || "https://github.com" } }
        ],
        newsletter: { name: nameChannel, jid: idChannel },
        interactiveConfig: { buttons_limits: 1, list_title: "الأقسام" }
    }, m);
};

menu.command = ["menu", "اوامر", "help", "مساعدة", "start", "هلب"];
menu.usage = ["اوامر"];
menu.category = "info";
menu.cooldown = 3000;
menu.disabled = false;

export default menu;

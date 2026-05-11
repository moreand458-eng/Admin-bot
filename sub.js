import { SubBots } from "meowsab";

async function sub(client) {

  global.subBots = new SubBots(client.commandSystem);
  
  SubBots.pariCode("ESCANOR1"); // كود الاتصال للبوتات الفرعية

  const { config } = client;

  await global.subBots.setConfig({
    commandsPath: config.commandsPath || './plugins',
    owners: config.owners,
    prefix: config.prefix,
    info: config.info,
    printQR: false
  });

  global.subBots.on('error', (uid, error) => {
    console.error(`❌ [SubBot ${uid}] Error:`, error?.message || error);
  });

  const loadedCount = await global.subBots.load();
  console.log(`✅ Loaded ${loadedCount} saved sub-bots`);

  global.subBots.on('ready', async (uid, sock) => {
    console.log(`✅ [SubBot ${uid}] Connected!`);
  });

  global.subBots.on('pair', (uid, code) => {
    console.log(`🔐 [SubBot ${uid}] Pairing code: ${code}`);
  });

  global.subBots.on('message', async (uid, msg) => {
    if (msg.key.id.includes("3EB0")) return;
    const bot = global.subBots.get(uid);
    const sock = bot?.sock;
    if (!sock) return;
  });
}

export default sub;

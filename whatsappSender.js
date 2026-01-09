const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

let ready = false;
let lastQR = null;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', (qr) => {
  lastQR = qr;
  console.log('[WhatsApp] QR atualizado.');
});

client.on('ready', () => {
  ready = true;
  lastQR = null;
  console.log('[WhatsApp] Conectado e pronto.');
});

client.on('ready', async () => {
  ready = true;
  lastQR = null;
  console.log('[WhatsApp] Conectado e pronto.');

  const chats = await client.getChats();
  chats.forEach(c => {
    console.log('ID:', c.id._serialized, '| Nome:', c.name);
  });
});

client.on('auth_failure', (msg) => {
  ready = false;
  console.error('[WhatsApp] Falha de autenticação:', msg);
});

client.initialize();

function fileToMedia(file) {
  return MessageMedia.fromFilePath(file.path);
}

function createRealSender() {
  return {
    async sendMessage(groupId, text, files = []) {
      if (!ready) throw new Error('WhatsApp não está pronto. Escaneie o QR no app.');
      let result = { textSent: false, mediaSent: 0 };

      if (text && text.trim()) {
        await client.sendMessage(groupId, text);
        result.textSent = true;
      }

      for (const f of files) {
        const media = fileToMedia(f);
        await client.sendMessage(groupId, media, { caption: '' });
        result.mediaSent++;
      }

      return { mode: 'real', groupId, ...result, at: new Date().toISOString() };
    }
  };
}

module.exports = {
  isReady: () => ready,
  getLastQR: () => lastQR,
  createRealSender
};

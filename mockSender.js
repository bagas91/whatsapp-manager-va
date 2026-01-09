module.exports = {
  async sendMessage(groupId, text, files = []) {
    console.log('[MOCK] Enviar para', groupId, { text, files });
    return { mode: 'mock', groupId, text, filesCount: files.length, at: new Date().toISOString() };
  }
};

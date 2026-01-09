const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const SENDER_MODE = (process.env.SENDER_MODE || 'mock').toLowerCase();

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const db = {
  groups: [
    { id: '5511999999999@c.us', name: 'Contato SP' },
    { id: '5511999999999-123456789@g.us', name: 'Grupo Exemplo' }
  ],
  schedules: []
};

let sender;
let whats;
if (SENDER_MODE === 'real') {
  const ws = require('./whatsappSender');
  whats = ws;
  sender = ws.createRealSender();
  console.log('[Sender] Modo REAL ativo (QR no app).');
} else {
  sender = require('./mockSender');
  console.log('[Sender] Modo MOCK ativo.');
}


app.get('/api/groups', (req, res) => res.json(db.groups));

app.post('/api/groups', (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) return res.status(400).json({ error: 'id e name são obrigatórios' });
  if (db.groups.find(g => g.id === id)) return res.status(409).json({ error: 'Grupo já existe' });
  db.groups.push({ id, name });
  res.json({ ok: true });
});

app.post('/api/messages/send', upload.array('files'), async (req, res) => {
  try {
    const { groupId, text } = req.body;
    if (!groupId) return res.status(400).json({ error: 'groupId é obrigatório' });
    const files = (req.files || []).map(f => ({ path: f.path, name: f.originalname, mime: f.mimetype }));
    const result = await sender.sendMessage(groupId, text || '', files);
    res.json({ ok: true, result });
  } catch (err) {
    console.error('Erro envio:', err);
    res.status(500).json({ error: 'Falha no envio', details: err.message });
  }
});

app.post('/api/schedules', upload.array('files'), (req, res) => {
  const { groupId, text, sendAt } = req.body;
  if (!groupId || !sendAt) return res.status(400).json({ error: 'groupId e sendAt são obrigatórios' });
  const when = new Date(sendAt);
  if (isNaN(when.getTime())) return res.status(400).json({ error: 'sendAt inválido' });

  const files = (req.files || []).map(f => ({ path: f.path, name: f.originalname, mime: f.mimetype }));

  const id = 'sch_' + Date.now() + '_' + Math.round(Math.random() * 1e6);
  db.schedules.push({ id, groupId, text: text || '', files, sendAt: when, status: 'pending' });
  res.json({ ok: true, id });
});

app.get('/api/schedules', (req, res) => res.json(db.schedules));

// Status do WhatsApp para a aba de conexão
app.get('/api/whatsapp/status', (req, res) => {
  if (SENDER_MODE !== 'real') return res.json({ mode: 'mock', ready: true });
  res.json({ mode: 'real', ready: whats.isReady(), lastQR: whats.getLastQR() });
});

cron.schedule('*/30 * * * * *', async () => {
  const now = new Date();
  const due = db.schedules.filter(s => s.status === 'pending' && s.sendAt <= now);
  for (const job of due) {
    try {
      const result = await sender.sendMessage(job.groupId, job.text, job.files);
      job.status = 'sent';
      job.result = result;
      console.log('[Agendamento] Enviado:', job.id);
    } catch (err) {
      job.status = 'failed';
      job.error = err.message;
      console.error('[Agendamento] Falha:', job.id, err.message);
    }
  }
});

app.get('/ping', (req, res) => {
  res.send('pong');
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

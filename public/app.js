// Estado da aplicação
const state = {
  groups: [],
  schedules: [],
  status: null
};

// Navegação entre abas
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    
    // Atualizar botões
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Atualizar painéis
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    
    // Atualizar título
    const titles = {
      dashboard: 'Dashboard',
      mensagens: 'Nova Mensagem',
      agendamentos: 'Agendamentos',
      grupos: 'Gerenciar Grupos',
      conexao: 'Status da Conexão'
    };
    document.getElementById('pageTitle').textContent = titles[tab] || 'WhatsApp Manager';
    
    // Carregar dados específicos da aba
    if (tab === 'agendamentos') loadSchedules();
    if (tab === 'conexao') loadStatus();
  });
});

// Alternar tipo de mensagem
document.querySelectorAll('input[name="msgType"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    const fileUploadGroup = document.getElementById('fileUploadGroup');
    if (e.target.value === 'media') {
      fileUploadGroup.style.display = 'block';
    } else {
      fileUploadGroup.style.display = 'none';
    }
  });
});

// Gerenciar arquivos selecionados
document.getElementById('msgFiles').addEventListener('change', (e) => {
  displayFileList(e.target.files, 'fileList');
});

document.getElementById('schedFiles').addEventListener('change', (e) => {
  displayFileList(e.target.files, 'schedFileList');
});

function displayFileList(files, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  Array.from(files).forEach(file => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M9 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V12C2 12.5304 2.21071 13.0391 2.58579 13.4142C2.96086 13.7893 3.46957 14 4 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V7L9 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 2V7H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>${file.name}</span>
    `;
    container.appendChild(item);
  });
}

// Carregar grupos
async function loadGroups() {
  try {
    const res = await fetch('/api/groups');
    const groups = await res.json();
    state.groups = groups;
    
    // Atualizar selects
    updateGroupSelects();
    
    // Atualizar lista de grupos
    updateGroupsList();
    
    // Atualizar estatísticas
    updateStats();
  } catch (error) {
    console.error('Erro ao carregar grupos:', error);
  }
}

function updateGroupSelects() {
  const selects = ['msgGroup', 'schedGroup'];
  
  selects.forEach(selectId => {
    const select = document.getElementById(selectId);
    select.innerHTML = '';
    
    if (state.groups.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Nenhum grupo cadastrado';
      select.appendChild(opt);
    } else {
      state.groups.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.id;
        opt.textContent = g.name;
        select.appendChild(opt);
      });
    }
  });
}

function updateGroupsList() {
  const container = document.getElementById('groupsList');
  
  if (state.groups.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path d="M44 52V48C44 45.8783 43.1571 43.8434 41.6569 42.3431C40.1566 40.8429 38.1217 40 36 40H20C17.8783 40 15.8434 40.8429 14.3431 42.3431C12.8429 43.8434 12 45.8783 12 48V52" stroke="#E0E0E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="28" cy="24" r="8" stroke="#E0E0E0" stroke-width="2"/>
          <path d="M52 52V48C52 46.4 51.4 45 50.4 44" stroke="#E0E0E0" stroke-width="2" stroke-linecap="round"/>
          <path d="M40 12.4C41.4 13.4 42 15 42 16.6C42 18.2 41.4 19.8 40 20.8" stroke="#E0E0E0" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>Nenhum grupo cadastrado</p>
      </div>
    `;
  } else {
    container.innerHTML = '';
    state.groups.forEach(g => {
      const card = document.createElement('div');
      card.className = 'group-card';
      card.innerHTML = `
        <h4>${g.name}</h4>
        <p>${g.id}</p>
      `;
      container.appendChild(card);
    });
  }
}

// Adicionar grupo
document.getElementById('btnAddGroup').addEventListener('click', async () => {
  const id = document.getElementById('groupId').value.trim();
  const name = document.getElementById('groupName').value.trim();
  const resultBox = document.getElementById('groupResult');
  
  if (!id || !name) {
    showResult(resultBox, 'Por favor, preencha todos os campos', 'error');
    return;
  }
  
  try {
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      showResult(resultBox, `Grupo "${name}" adicionado com sucesso!`, 'success');
      document.getElementById('groupId').value = '';
      document.getElementById('groupName').value = '';
      await loadGroups();
    } else {
      showResult(resultBox, data.error || 'Erro ao adicionar grupo', 'error');
    }
  } catch (error) {
    showResult(resultBox, 'Erro ao conectar com o servidor', 'error');
  }
});

// Enviar mensagem
document.getElementById('btnSend').addEventListener('click', async () => {
  const groupId = document.getElementById('msgGroup').value;
  const text = document.getElementById('msgText').value.trim();
  const files = document.getElementById('msgFiles').files;
  const resultBox = document.getElementById('sendResult');
  
  if (!groupId) {
    showResult(resultBox, 'Por favor, selecione um grupo', 'error');
    return;
  }
  
  if (!text && files.length === 0) {
    showResult(resultBox, 'Por favor, digite uma mensagem ou selecione arquivos', 'error');
    return;
  }
  
  const formData = new FormData();
  formData.append('groupId', groupId);
  formData.append('text', text);
  
  for (const f of files) {
    formData.append('files', f);
  }
  
  try {
    showResult(resultBox, 'Enviando mensagem...', 'info');
    
    const res = await fetch('/api/messages/send', {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    
    if (res.ok) {
      showResult(resultBox, 'Mensagem enviada com sucesso!', 'success');
      document.getElementById('msgText').value = '';
      document.getElementById('msgFiles').value = '';
      document.getElementById('fileList').innerHTML = '';
      addActivity('Mensagem enviada', `Enviada para ${getGroupName(groupId)}`);
    } else {
      showResult(resultBox, data.error || 'Erro ao enviar mensagem', 'error');
    }
  } catch (error) {
    showResult(resultBox, 'Erro ao conectar com o servidor', 'error');
  }
});

// Agendar mensagem
document.getElementById('btnSchedule').addEventListener('click', async () => {
  const groupId = document.getElementById('schedGroup').value;
  const text = document.getElementById('schedText').value.trim();
  const date = document.getElementById('schedDate').value;
  const time = document.getElementById('schedTime').value;
  const files = document.getElementById('schedFiles').files;
  const resultBox = document.getElementById('schedResult');
  
  if (!groupId) {
    showResult(resultBox, 'Por favor, selecione um grupo', 'error');
    return;
  }
  
  if (!date || !time) {
    showResult(resultBox, 'Por favor, defina data e horário', 'error');
    return;
  }
  
  if (!text && files.length === 0) {
    showResult(resultBox, 'Por favor, digite uma mensagem ou selecione arquivos', 'error');
    return;
  }
  
  const sendAt = new Date(`${date}T${time}`).toISOString();
  
  const formData = new FormData();
  formData.append('groupId', groupId);
  formData.append('text', text);
  formData.append('sendAt', sendAt);
  
  for (const f of files) {
    formData.append('files', f);
  }
  
  try {
    showResult(resultBox, 'Agendando mensagem...', 'info');
    
    const res = await fetch('/api/schedules', {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    
    if (res.ok) {
      showResult(resultBox, 'Mensagem agendada com sucesso!', 'success');
      document.getElementById('schedText').value = '';
      document.getElementById('schedDate').value = '';
      document.getElementById('schedTime').value = '';
      document.getElementById('schedFiles').value = '';
      document.getElementById('schedFileList').innerHTML = '';
      await loadSchedules();
      addActivity('Mensagem agendada', `Agendada para ${formatDateTime(sendAt)}`);
    } else {
      showResult(resultBox, data.error || 'Erro ao agendar mensagem', 'error');
    }
  } catch (error) {
    showResult(resultBox, 'Erro ao conectar com o servidor', 'error');
  }
});

// Carregar agendamentos
async function loadSchedules() {
  try {
    const res = await fetch('/api/schedules');
    const schedules = await res.json();
    state.schedules = schedules;
    
    updateSchedulesList();
    updateStats();
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error);
  }
}

function updateSchedulesList() {
  const container = document.getElementById('schedulesList');
  
  if (state.schedules.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="12" width="48" height="44" rx="4" stroke="#E0E0E0" stroke-width="2"/>
          <path d="M8 24H56" stroke="#E0E0E0" stroke-width="2"/>
          <path d="M20 8V16" stroke="#E0E0E0" stroke-width="2" stroke-linecap="round"/>
          <path d="M44 8V16" stroke="#E0E0E0" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>Nenhum agendamento programado</p>
      </div>
    `;
  } else {
    container.innerHTML = '';
    state.schedules.forEach(s => {
      const card = document.createElement('div');
      card.className = 'schedule-card';
      card.innerHTML = `
        <h4>${getGroupName(s.groupId)}</h4>
        <p>${s.text.substring(0, 50)}${s.text.length > 50 ? '...' : ''}</p>
        <div class="schedule-time">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 4V8L11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          ${formatDateTime(s.sendAt)}
        </div>
        <span class="schedule-status ${s.status}">${getStatusText(s.status)}</span>
      `;
      container.appendChild(card);
    });
  }
}

// Carregar status da conexão
async function loadStatus() {
  try {
    const res = await fetch('/api/whatsapp/status');
    const data = await res.json();
    state.status = data;
    
    updateConnectionStatus();
    
    // Exibir QR Code se disponível
    if (data.mode === 'real' && data.lastQR) {
      displayQRCode(data.lastQR);
    }
    
    // Atualizar informações detalhadas
    document.getElementById('apiStatus').textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Erro ao carregar status:', error);
  }
}

function updateConnectionStatus() {
  const indicator = document.getElementById('statusIndicator');
  const indicatorLarge = document.getElementById('statusIndicatorLarge');
  const statusText = document.getElementById('statusText');
  const connectionText = document.getElementById('connectionStatusText');
  
  if (!state.status) return;
  
  if (state.status.mode === 'mock') {
    indicator.className = 'status-indicator connected';
    indicatorLarge.className = 'status-indicator-large connected';
    statusText.textContent = 'Modo Teste';
    connectionText.textContent = 'Modo de Teste Ativo';
  } else if (state.status.ready) {
    indicator.className = 'status-indicator connected';
    indicatorLarge.className = 'status-indicator-large connected';
    statusText.textContent = 'Conectado';
    connectionText.textContent = 'WhatsApp Conectado';
    document.getElementById('qrCodeContainer').style.display = 'none';
  } else {
    indicator.className = 'status-indicator disconnected';
    indicatorLarge.className = 'status-indicator-large disconnected';
    statusText.textContent = 'Desconectado';
    connectionText.textContent = 'Aguardando Conexão';
  }
}

function displayQRCode(qrData) {
  const container = document.getElementById('qrCodeContainer');
  const qrCode = document.getElementById('qrCode');
  
  container.style.display = 'block';
  qrCode.innerHTML = '';
  
  if (window.QRCode) {
    new QRCode(qrCode, {
      text: qrData,
      width: 256,
      height: 256,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }
}

// Atualizar status
document.getElementById('btnRefreshStatus').addEventListener('click', loadStatus);

// Atualizar estatísticas
function updateStats() {
  document.getElementById('statGroups').textContent = state.groups.length;
  
  const pendingSchedules = state.schedules.filter(s => s.status === 'pending').length;
  document.getElementById('statSchedules').textContent = pendingSchedules;
  
  const sentMessages = state.schedules.filter(s => s.status === 'sent').length;
  document.getElementById('statMessages').textContent = sentMessages;
  
  // Próximo envio
  const nextSchedule = state.schedules
    .filter(s => s.status === 'pending')
    .sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt))[0];
  
  if (nextSchedule) {
    const date = new Date(nextSchedule.sendAt);
    document.getElementById('statNextSend').textContent = 
      `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else {
    document.getElementById('statNextSend').textContent = '--:--';
  }
}

// Adicionar atividade recente
function addActivity(title, description) {
  const container = document.getElementById('activityList');
  
  // Remover empty state se existir
  const emptyState = container.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }
  
  const item = document.createElement('div');
  item.className = 'activity-item';
  item.innerHTML = `
    <div class="activity-icon" style="background: #E8F5E9;">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M16 2L8 10" stroke="#388E3C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 2L11 18L8 10L0 7L16 2Z" stroke="#388E3C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="activity-content">
      <div class="activity-title">${title}</div>
      <div class="activity-time">${description}</div>
    </div>
  `;
  
  container.insertBefore(item, container.firstChild);
  
  // Manter apenas as 5 atividades mais recentes
  const items = container.querySelectorAll('.activity-item');
  if (items.length > 5) {
    items[items.length - 1].remove();
  }
}

// Funções auxiliares
function showResult(element, message, type) {
  element.textContent = message;
  element.className = `result-box ${type}`;
  
  setTimeout(() => {
    element.className = 'result-box';
  }, 5000);
}

function getGroupName(groupId) {
  const group = state.groups.find(g => g.id === groupId);
  return group ? group.name : groupId;
}

function getStatusText(status) {
  const texts = {
    pending: 'Pendente',
    sent: 'Enviado',
    failed: 'Falhou'
  };
  return texts[status] || status;
}

function formatDateTime(isoString) {
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

// Inicialização
async function init() {
  await loadGroups();
  await loadSchedules();
  await loadStatus();
  
  // Atualizar status periodicamente
  setInterval(loadStatus, 30000); // A cada 30 segundos
  setInterval(loadSchedules, 10000); // A cada 10 segundos
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', init);

# Guia de Hospedagem Gratuita - WhatsApp Manager

## Opções Recomendadas para Hospedagem Gratuita

Este guia apresenta as melhores opções gratuitas para hospedar seu sistema de gerenciamento de WhatsApp, permitindo que ele continue funcionando mesmo quando seu PC estiver desligado.

---

## 🏆 Opção 1: Render (RECOMENDADA)

**Render** é a melhor opção gratuita para este projeto, oferecendo hospedagem contínua e fácil configuração.

### Características
- ✅ **Gratuito permanentemente** (plano Free)
- ✅ **Sempre ativo** (não hiberna após inatividade)
- ✅ **Deploy automático** via GitHub
- ✅ **SSL/HTTPS gratuito**
- ✅ **750 horas/mês grátis** (suficiente para uso contínuo)
- ✅ **Suporte a Node.js** nativo

### Limitações
- ⚠️ Após 15 minutos de inatividade, o serviço hiberna (mas reinicia automaticamente ao receber requisição)
- ⚠️ 512MB de RAM no plano gratuito

### Como Fazer Deploy no Render

#### Passo 1: Preparar o Projeto
Já está pronto! O projeto já contém todos os arquivos necessários.

#### Passo 2: Criar Conta no Render
1. Acesse: https://render.com
2. Clique em "Get Started for Free"
3. Faça login com GitHub (recomendado)

#### Passo 3: Criar Repositório no GitHub
1. Acesse: https://github.com/new
2. Crie um repositório (ex: `whatsapp-manager-va`)
3. No terminal do seu projeto, execute:

```bash
cd /home/ubuntu/whatsapp-manager-modern
git init
git add .
git commit -m "Initial commit - WhatsApp Manager Modernizado"
git branch -M main
git remote add origin https://github.com/bagas91/whatsapp-manager-va.git
git push -u origin main
```

git config --global user.email "cristian.thiago.gomes@gmail.com"
git config --global user.name "Cristian"
rm -r .git
git init
git add .
git commit -m "Initial commit - WhatsApp Manager Modernizado"
git branch -M main
git remote add origin https://github.com/bagas91/whatsapp-manager-va.git
git push -u origin main

#### Passo 4: Deploy no Render
1. No painel do Render, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: whatsapp-manager
   - **Environment**: Node
   - **Build Command**: `pnpm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

5. Adicione variáveis de ambiente:
   - `PORT`: 3000
   - `SENDER_MODE`: mock (ou real, se quiser usar WhatsApp real)
   - `UPLOAD_DIR`: uploads

6. Clique em "Create Web Service"

#### Passo 5: Acessar o Sistema
Após o deploy (leva ~5 minutos), você receberá uma URL como:
`https://whatsapp-manager-xxxx.onrender.com`

---

## 🥈 Opção 2: Railway

**Railway** oferece plano gratuito generoso com $5 de crédito mensal.

### Características
- ✅ **$5 de crédito mensal** grátis
- ✅ **Deploy automático** via GitHub
- ✅ **SSL/HTTPS gratuito**
- ✅ **Não hiberna**
- ✅ **Interface moderna**

### Limitações
- ⚠️ Crédito limitado ($5/mês pode não ser suficiente para uso 24/7)

### Como Fazer Deploy no Railway

1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha seu repositório
6. Configure variáveis de ambiente (mesmas do Render)
7. Deploy automático será iniciado

URL gerada: `https://whatsapp-manager-production.up.railway.app`

---

## 🥉 Opção 3: Fly.io

**Fly.io** oferece plano gratuito com recursos limitados mas suficientes.

### Características
- ✅ **Gratuito** com limites generosos
- ✅ **Sempre ativo**
- ✅ **Múltiplas regiões** (incluindo Brasil)
- ✅ **SSL/HTTPS gratuito**

### Limitações
- ⚠️ Requer cartão de crédito (não cobra, apenas validação)
- ⚠️ Configuração via CLI (mais técnico)

### Como Fazer Deploy no Fly.io

1. Instale o CLI do Fly.io:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Faça login:
```bash
flyctl auth login
```

3. No diretório do projeto:
```bash
cd /home/ubuntu/whatsapp-manager-modern
flyctl launch
```

4. Siga as instruções interativas
5. Configure variáveis de ambiente:
```bash
flyctl secrets set SENDER_MODE=mock
flyctl secrets set PORT=3000
```

6. Deploy:
```bash
flyctl deploy
```

---

## 🔧 Opção 4: Vercel (Limitada)

**Vercel** é excelente para sites estáticos, mas tem limitações para Node.js com estado.

### Características
- ✅ **Totalmente gratuito**
- ✅ **Deploy automático** via GitHub
- ✅ **SSL/HTTPS gratuito**
- ✅ **CDN global**

### Limitações
- ❌ **Serverless functions** (não mantém estado entre requisições)
- ❌ **Timeout de 10 segundos** por requisição
- ❌ **Não suporta WebSockets** persistentes
- ❌ **Não adequado para WhatsApp Web** (que precisa de conexão persistente)

**Não recomendado para este projeto** devido às limitações de estado e conexão persistente necessárias para o WhatsApp.

---

## 📝 Configuração Adicional para Modo Real (WhatsApp)

Se você quiser usar o modo REAL (conectar com WhatsApp de verdade), precisará:

### 1. Alterar variável de ambiente
```
SENDER_MODE=real
```

### 2. Instalar Chrome/Chromium no servidor
Para Render, adicione um `render.yaml`:

```yaml
services:
  - type: web
    name: whatsapp-manager
    env: node
    buildCommand: pnpm install && pnpx puppeteer browsers install chrome
    startCommand: node server.js
    envVars:
      - key: SENDER_MODE
        value: real
      - key: PORT
        value: 3000
```

### 3. Considerar Persistência de Sessão
O WhatsApp Web mantém sessão através de arquivos. Em serviços gratuitos, esses arquivos podem ser perdidos ao reiniciar. Considere:

- **Render**: Usa disco efêmero (perde dados ao reiniciar)
- **Railway**: Oferece volumes persistentes (pago)
- **Fly.io**: Oferece volumes persistentes (pago)

**Solução**: Para uso gratuito, mantenha em modo MOCK para testes, ou use um VPS gratuito como Oracle Cloud (sempre gratuito, mas requer configuração manual).

---

## 🎯 Recomendação Final

Para este projeto, recomendo **Render** como melhor opção gratuita:

1. **Fácil de configurar** (sem necessidade de CLI)
2. **Deploy automático** via GitHub
3. **Gratuito permanentemente**
4. **Boa performance** para aplicações pequenas
5. **SSL/HTTPS incluído**

### Próximos Passos

1. Crie uma conta no Render
2. Suba o código para GitHub
3. Conecte o repositório no Render
4. Configure as variáveis de ambiente
5. Aguarde o deploy
6. Acesse sua aplicação pela URL fornecida

**Importante**: O plano gratuito do Render hiberna após 15 minutos de inatividade, mas reinicia automaticamente quando alguém acessa. Para manter sempre ativo, você pode usar um serviço de "ping" gratuito como UptimeRobot (https://uptimerobot.com) para fazer requisições a cada 5 minutos.

---

## 📚 Recursos Adicionais

- **Documentação Render**: https://render.com/docs
- **Documentação Railway**: https://docs.railway.app
- **Documentação Fly.io**: https://fly.io/docs
- **UptimeRobot** (manter ativo): https://uptimerobot.com

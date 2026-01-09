# 🚀 WhatsApp Manager - Sistema Modernizado

Sistema completo de gerenciamento de grupos do WhatsApp com interface moderna, clean e profissional. Envie mensagens instantâneas, agende envios e gerencie múltiplos grupos de forma eficiente.

![WhatsApp Manager](https://img.shields.io/badge/WhatsApp-Manager-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22.13.0-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.22.1-000000?style=for-the-badge&logo=express&logoColor=white)

## ✨ Características

### Interface Moderna
- **Design Clean e Profissional** inspirado em SaaS modernos
- **Dashboard Completo** com estatísticas em tempo real
- **Sidebar Intuitiva** com navegação por ícones
- **Responsivo** para desktop, tablet e mobile
- **Animações Suaves** e transições elegantes
- **Paleta de Cores** baseada no WhatsApp com tons neutros

### Funcionalidades Principais

#### 📊 Dashboard
- Estatísticas de mensagens enviadas
- Contador de agendamentos ativos
- Total de grupos cadastrados
- Próximo envio programado
- Histórico de atividades recentes

#### 💬 Mensagens
- Envio instantâneo para grupos
- Suporte a texto e mídias
- Upload de múltiplos arquivos
- Feedback visual de sucesso/erro

#### 📅 Agendamentos
- Programação de envios futuros
- Seleção de data e hora
- Lista visual de agendamentos
- Status colorido (Pendente, Enviado, Falhou)
- Atualização automática

#### 👥 Grupos
- Adicionar novos grupos facilmente
- Visualização em grid de cards
- Gerenciamento centralizado

#### 🔌 Conexão
- Status da conexão com WhatsApp
- Exibição de QR Code (modo real)
- Informações detalhadas da API
- Modo mock para testes

## 🛠️ Tecnologias

### Backend
- **Node.js** 22.13.0
- **Express** 4.22.1
- **whatsapp-web.js** 1.34.4
- **node-cron** 3.0.3
- **multer** 1.4.5 (upload de arquivos)
- **qrcode** 1.5.4

### Frontend
- **HTML5** semântico
- **CSS3** com variáveis e animações
- **JavaScript ES6+** com async/await
- **Font Inter** (Google Fonts)
- **QRCode.js** para geração de QR codes

## 📦 Instalação

### Pré-requisitos
- Node.js 22.x ou superior
- pnpm (ou npm/yarn)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/whatsapp-manager.git
cd whatsapp-manager
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000
SENDER_MODE=mock
UPLOAD_DIR=uploads
```

4. **Inicie o servidor**
```bash
pnpm start
```

5. **Acesse a aplicação**
Abra seu navegador em: `http://localhost:3000`

## 🎮 Modos de Operação

### Modo Mock (Teste)
Ideal para desenvolvimento e testes sem conectar ao WhatsApp real.
```env
SENDER_MODE=mock
```

### Modo Real (Produção)
Conecta ao WhatsApp Web através do puppeteer.
```env
SENDER_MODE=real
```

**Atenção**: No modo real, você precisará escanear o QR Code na primeira vez.

## 🌐 Hospedagem Gratuita

Este projeto pode ser hospedado gratuitamente em várias plataformas. Veja o guia completo em [GUIA_HOSPEDAGEM.md](GUIA_HOSPEDAGEM.md).

### Opções Recomendadas

#### 🏆 Render (Recomendado)
- Gratuito permanentemente
- Deploy automático via GitHub
- SSL/HTTPS incluído
- 750 horas/mês grátis

**Deploy rápido**: Clique no botão abaixo
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

#### 🥈 Railway
- $5 de crédito mensal grátis
- Interface moderna
- Deploy automático

#### 🥉 Fly.io
- Plano gratuito generoso
- Múltiplas regiões
- Sempre ativo

Consulte [GUIA_HOSPEDAGEM.md](GUIA_HOSPEDAGEM.md) para instruções detalhadas de cada plataforma.

## 📖 Uso

### Adicionar Grupos

1. Acesse a aba **Grupos**
2. Insira o ID do grupo (formato: `5511999999999-123456789@g.us`)
3. Defina um nome amigável
4. Clique em **Adicionar Grupo**

**Dica**: Para encontrar o ID do grupo, acesse a aba **Conexão** quando estiver em modo real.

### Enviar Mensagens

1. Acesse a aba **Mensagens**
2. Selecione um ou mais grupos
3. Escolha o tipo (Texto ou Mídia)
4. Digite sua mensagem
5. Se mídia, selecione os arquivos
6. Clique em **Enviar Agora**

### Agendar Mensagens

1. Acesse a aba **Agendamentos**
2. Selecione os grupos
3. Defina data e horário
4. Digite a mensagem
5. Opcionalmente, adicione arquivos
6. Clique em **Agendar Envio**

Os agendamentos são processados automaticamente a cada 30 segundos.

## 🔧 Configuração Avançada

### Alterar Porta
```env
PORT=8080
```

### Alterar Diretório de Upload
```env
UPLOAD_DIR=/caminho/personalizado
```

### Configurar Puppeteer (Modo Real)
Edite `whatsappSender.js` para ajustar opções do puppeteer:
```javascript
puppeteer: {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}
```

## 📁 Estrutura do Projeto

```
whatsapp-manager-modern/
├── public/              # Frontend
│   ├── index.html      # Interface principal
│   ├── style.css       # Estilos modernos
│   └── app.js          # Lógica do frontend
├── server.js           # Servidor Express
├── whatsappSender.js   # Integração WhatsApp real
├── mockSender.js       # Mock para testes
├── package.json        # Dependências
├── render.yaml         # Configuração Render
├── .env                # Variáveis de ambiente
├── .gitignore          # Arquivos ignorados
├── README.md           # Este arquivo
├── GUIA_HOSPEDAGEM.md  # Guia de hospedagem
└── INTERFACE_INFO.md   # Detalhes da interface
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🐛 Problemas Conhecidos

### Modo Real - Sessão Perdida
Em hospedagens gratuitas, a sessão do WhatsApp pode ser perdida ao reiniciar o servidor. Considere usar volumes persistentes ou re-escanear o QR Code.

### Hibernação (Render)
O plano gratuito do Render hiberna após 15 minutos de inatividade. Use um serviço de ping como UptimeRobot para manter ativo.

## 📧 Suporte

Para dúvidas ou problemas:
- Abra uma [issue](https://github.com/seu-usuario/whatsapp-manager/issues)
- Entre em contato via [email](mailto:seu-email@exemplo.com)

## 🙏 Agradecimentos

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) pela biblioteca incrível
- [Inter Font](https://fonts.google.com/specimen/Inter) pela tipografia
- Comunidade Node.js

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de grupos do WhatsApp**

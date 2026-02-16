const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

const userDataPath = app.getPath('userData');
const dataDir = path.join(userDataPath, 'StandardPoint');
const dataFile = path.join(dataDir, 'dados.json');
const backupDir = path.join(dataDir, 'backups');

// Cria diretórios
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL('http://localhost:5173');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ====================
// IPC HANDLERS
// ====================

// Salvar dados (auto-save)
ipcMain.handle('salvar-dados', async (event, dados) => {
  try {
    fs.writeFileSync(dataFile, dados);
    return { success: true, path: dataFile };
  } catch (error) {
    console.error('Erro ao salvar:', error);
    return { success: false, error: error.message };
  }
});

// Carregar dados
ipcMain.handle('carregar-dados', async () => {
  try {
    if (fs.existsSync(dataFile)) {
      const dados = fs.readFileSync(dataFile, 'utf-8');
      return { success: true, dados };
    } else {
      const dadosPadrao = JSON.stringify({ empresas: [], projetos: [], versao: '1.0.0' }, null, 2);
      fs.writeFileSync(dataFile, dadosPadrao);
      return { success: true, dados: dadosPadrao };
    }
  } catch (error) {
    console.error('Erro ao carregar:', error);
    return { success: false, error: error.message };
  }
});

// Backup automático (pasta padrão)
ipcMain.handle('fazer-backup', async (event, dados) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup_${timestamp}.json`);
    fs.writeFileSync(backupFile, dados);
    return { success: true, path: backupFile };
  } catch (error) {
    console.error('Erro no backup:', error);
    return { success: false, error: error.message };
  }
});

// 🆕 NOVO: Backup manual com diálogo de seleção de pasta
ipcMain.handle('salvarBackupComDialogo', async (event, dados) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Salvar Backup StandardPoint',
      defaultPath: `backup-standardpoint-${new Date().toISOString().split('T')[0]}.json`,
      filters: [
        { name: 'Arquivos JSON', extensions: ['json'] },
        { name: 'Todos os arquivos', extensions: ['*'] }
      ],
      properties: ['createDirectory'] // Permite criar novas pastas
    });

    // Usuário cancelou o diálogo
    if (!filePath) {
      return { success: false, canceled: true };
    }

    // Salvar arquivo no local escolhido
    fs.writeFileSync(filePath, JSON.stringify(dados, null, 2), 'utf8');

    console.log('✅ Backup salvo em:', filePath);
    return { success: true, filePath };

  } catch (error) {
    console.error('❌ Erro ao salvar backup com diálogo:', error);
    return { success: false, error: error.message };
  }
});
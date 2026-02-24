const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// Configurar caminhos de dados
const userDataPath = app.getPath('userData');
const appDataPath = path.join(userDataPath, 'standardpoint');
const dataFilePath = path.join(appDataPath, 'data.json');
const backupsPath = path.join(appDataPath, 'backups');

// Garantir que as pastas existam
function ensureDirectories() {
  if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
  }
  if (!fs.existsSync(backupsPath)) {
    fs.mkdirSync(backupsPath, { recursive: true });
  }
}

// Handler para obter caminho de dados
ipcMain.handle('get-app-data-path', () => {
  return appDataPath;
});

// Handler para carregar dados
ipcMain.handle('load-data', async () => {
  try {
    ensureDirectories();

    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      console.log('Dados carregados de:', dataFilePath);
      return JSON.parse(data);
    } else {
      console.log('Arquivo de dados não encontrado, criando novo...');
      // Dados iniciais
      const initialData = {
        empresas: [],
        projetos: [],
        configuracoes: {
          ultimoBackup: null,
          tema: 'claro',
        }
      };

      fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return null;
  }
});

// Handler para salvar dados
ipcMain.handle('save-data', async (event, data) => {
  try {
    ensureDirectories();

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    console.log('Dados salvos em:', dataFilePath);
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados:', error);

    // Fallback: mostrar diálogo de erro
    dialog.showErrorBox('Erro ao salvar',
      'Não foi possível salvar os dados. Verifique as permissões do diretório.');
    return false;
  }
});

// Handler para fazer backup
ipcMain.handle('fazer-backup', async () => {
  try {
    ensureDirectories();

    if (fs.existsSync(dataFilePath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(backupsPath, `backup-${timestamp}.json`);
      const data = fs.readFileSync(dataFilePath, 'utf8');

      fs.writeFileSync(backupFile, data);
      console.log('Backup criado:', backupFile);

      return {
        success: true,
        message: `Backup criado com sucesso: ${path.basename(backupFile)}`,
        filePath: backupFile
      };
    }
    return { success: false, message: 'Nenhum dado para fazer backup' };
  } catch (error) {
    console.error('Erro ao fazer backup:', error);
    return { success: false, message: `Erro: ${error.message}` };
  }
});

// Handler para listar backups
ipcMain.handle('listar-backups', async () => {
  try {
    ensureDirectories();

    if (!fs.existsSync(backupsPath)) return [];

    const files = fs.readdirSync(backupsPath)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(backupsPath, file);
        const stats = fs.statSync(filePath);
        return {
          nome: file,
          caminho: filePath,
          tamanho: stats.size,
          dataModificacao: stats.mtime,
          dataFormatada: stats.mtime.toLocaleString('pt-BR')
        };
      })
      .sort((a, b) => b.dataModificacao - a.dataModificacao); // Mais recente primeiro

    return files;
  } catch (error) {
    console.error('Erro ao listar backups:', error);
    return [];
  }
});

// Handler para restaurar backup
ipcMain.handle('restaurar-backup', async (event, backupName) => {
  try {
    ensureDirectories();

    const backupPath = path.join(backupsPath, backupName);

    if (!fs.existsSync(backupPath)) {
      return { success: false, message: 'Backup não encontrado' };
    }

    const data = fs.readFileSync(backupPath, 'utf8');
    fs.writeFileSync(dataFilePath, data);

    console.log('Backup restaurado:', backupPath);
    return {
      success: true,
      message: `Backup "${backupName}" restaurado com sucesso!`
    };
  } catch (error) {
    console.error('Erro ao restaurar backup:', error);
    return { success: false, message: `Erro: ${error.message}` };
  }
});

// Função para criar janela
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  // Em desenvolvimento
  mainWindow.loadURL('http://localhost:5173');
  mainWindow.webContents.openDevTools();
}

function createModal(title, file) {
  if (!mainWindow) return;

  const modal = new BrowserWindow({
    width: 700,
    height: 600,
    parent: mainWindow,
    modal: true,
    show: false,
    autoHideMenuBar: true,
    title: title,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  modal.loadFile(path.join(__dirname, file));

  // Intercept links to open in external browser
  modal.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  modal.once('ready-to-show', () => {
    modal.show();
  });
}

function setupMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'Arquivo',
      submenu: [
        isMac ? { role: 'close', label: 'Fechar' } : { role: 'quit', label: 'Sair' }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Desfazer' },
        { role: 'redo', label: 'Refazer' },
        { type: 'separator' },
        { role: 'cut', label: 'Recortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Colar' },
        { role: 'delete', label: 'Excluir' },
        { role: 'selectAll', label: 'Selecionar Tudo' }
      ]
    },
    {
      label: 'Exibir',
      submenu: [
        { role: 'reload', label: 'Recarregar' },
        { role: 'forceReload', label: 'Forçar Recarregamento' },
        { role: 'toggleDevTools', label: 'Alternar Ferramentas de Desenvolvedor' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Tamanho Real' },
        { role: 'zoomIn', label: 'Aumentar Zoom' },
        { role: 'zoomOut', label: 'Diminuir Zoom' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Alternar Tela Cheia' }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Guia da Análise de Pontos de Função',
          click: () => createModal('Guia da Análise de Pontos de Função', 'guia.html')
        },
        {
          label: 'Documentação',
          click: () => createModal('Documentação', 'documentacao.html')
        },
        { type: 'separator' },
        {
          label: 'Sobre',
          click: () => createModal('Sobre o StandardPoint', 'sobre.html')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  // Garantir diretórios antes de criar janela
  ensureDirectories();
  createWindow();
  setupMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
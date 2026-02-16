const { contextBridge, ipcRenderer } = require('electron');

// API para sistema de arquivos
contextBridge.exposeInMainWorld('electronAPI', {
  // Sistema de arquivos
  getAppDataPath: () => {
    return ipcRenderer.invoke('get-app-data-path');
  },
  
  // Carregar dados
  loadData: () => {
    return ipcRenderer.invoke('load-data');
  },
  
  // Salvar dados
  saveData: (data) => {
    return ipcRenderer.invoke('save-data', data);
  },
  
  // Fazer backup manual
  fazerBackup: () => {
    return ipcRenderer.invoke('fazer-backup');
  },
  
  // Listar backups
  listarBackups: () => {
    return ipcRenderer.invoke('listar-backups');
  },
  
  // Restaurar backup
  restaurarBackup: (backupName) => {
    return ipcRenderer.invoke('restaurar-backup', backupName);
  },
  
  // Métodos simulados para desenvolvimento (localStorage)
  devLoadData: () => {
    console.log('[DEV] Carregando dados do localStorage');
    try {
      const saved = localStorage.getItem('standardpoint-data');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return null;
    }
  },
  
  devSaveData: (data) => {
    console.log('[DEV] Salvando dados no localStorage');
    try {
      localStorage.setItem('standardpoint-data', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return false;
    }
  },
});
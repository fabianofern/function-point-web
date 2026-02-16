const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // APIs que o FunctionContext.js usa (inglês)
  saveData: (dados) => ipcRenderer.invoke('salvar-dados', dados),
  loadData: () => ipcRenderer.invoke('carregar-dados'),

  // APIs que você tinha antes (português)
  salvarDados: (dados) => ipcRenderer.invoke('salvar-dados', dados),
  carregarDados: () => ipcRenderer.invoke('carregar-dados'),
  fazerBackup: (dados) => ipcRenderer.invoke('fazer-backup', dados),

  // 🆕 NOVA API (nome que FunctionContext.js espera)
  salvarBackupComDialogo: (dados) => ipcRenderer.invoke('salvarBackupComDialogo', dados)
});
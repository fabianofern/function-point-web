// Sistema de armazenamento SIMPLES usando localStorage

const STORAGE_KEY = 'standardpoint-data';

export const loadData = async () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Dados iniciais se não existir
    return {
      empresas: [],
      empresaAtual: null,
      projetoAtual: null,
      crAtual: null,
    };
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return null;
  }
};

export const saveData = async (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return false;
  }
};

export const fazerBackup = async () => {
  try {
    const data = await loadData();
    const backupData = {
      ...data,
      backupDate: new Date().toISOString(),
    };
    
    const backupKey = `backup-${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify(backupData));
    return backupKey;
  } catch (error) {
    console.error('Erro ao fazer backup:', error);
    return null;
  }
};
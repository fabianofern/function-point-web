// Serviço SIMPLES de persistência - só localStorage
const STORAGE_KEY = 'standardpoint-data';

export const storageService = {
  // Carregar dados
  loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        console.log('📂 Dados carregados do localStorage');
        return JSON.parse(saved);
      }
      console.log('📂 Nenhum dado salvo encontrado');
      return null;
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      return null;
    }
  },

  // Salvar dados
  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('💾 Dados salvos no localStorage');
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar dados:', error);
      return false;
    }
  },

  // Limpar dados
  clearData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Dados removidos do localStorage');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar dados:', error);
      return false;
    }
  }
};
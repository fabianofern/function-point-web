// components/Header.jsx - VERSÃO CORRIGIDA
import React, { useEffect, useState } from 'react';
import { useFunctionContext } from '../context/FunctionContext';
import HeaderSelectors from './HeaderSelectors';

const Header = () => {
  const {
    saveStatus,
    totals,
    empresaAtualObj,
    empresaAtual
  } = useFunctionContext();

  const [statusText, setStatusText] = useState('Sincronizado');
  const [statusIcon, setStatusIcon] = useState('cloud_done');
  const [statusColor, setStatusColor] = useState('#3b82f6');
  const [valorTotalFormatado, setValorTotalFormatado] = useState('R$ 0,00');

  // Atualizar status dinamicamente
  useEffect(() => {
    switch (saveStatus) {
      case 'saving':
        setStatusText('Salvando...');
        setStatusIcon('sync');
        setStatusColor('#f59e0b');
        break;
      case 'saved':
        setStatusText('Salvo');
        setStatusIcon('check_circle');
        setStatusColor('#10b981');
        // Resetar após 2 segundos
        setTimeout(() => {
          if (saveStatus === 'saved') {
            setStatusText('Sincronizado');
            setStatusIcon('cloud_done');
            setStatusColor('#3b82f6');
          }
        }, 2000);
        break;
      case 'error':
        setStatusText('Erro');
        setStatusIcon('error');
        setStatusColor('#ef4444');
        break;
      default:
        setStatusText('Sincronizado');
        setStatusIcon('cloud_done');
        setStatusColor('#3b82f6');
    }
  }, [saveStatus]);

  // Atualizar valor total formatado
  useEffect(() => {
    const valorPF = empresaAtualObj?.valorPF || 850.00;
    const valorTotal = totals.totalPF * valorPF;

    const formatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(valorTotal);

    setValorTotalFormatado(formatado);
  }, [totals.totalPF, empresaAtualObj?.valorPF]);

  // Debug: Monitorar mudanças
  useEffect(() => {
    console.log('🏢 [Header] Estado atual:', {
      empresaSelecionada: empresaAtualObj?.nome || 'Nenhuma',
      empresaIndex: empresaAtual,
      valorPF: empresaAtualObj?.valorPF,
      totalPF: totals.totalPF,
      saveStatus
    });
  }, [empresaAtualObj, empresaAtual, totals.totalPF, saveStatus]);

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        {/* Lado esquerdo: Logo */}
        <div style={styles.headerLeft}>
          <img src="/banner.png" alt="StandardPoint Banner" style={{ height: '80px', objectFit: 'contain' }} />
        </div>

        {/* Centro: Selectors */}
        <div style={styles.headerCenter}>
          <HeaderSelectors />
        </div>

        {/* Lado direito: Status e valor */}
        <div style={styles.headerRight}>
          {/* Valor Total - Só mostra se tem empresa selecionada */}
          {empresaAtual !== null && (
            <div style={styles.totalValue}>
              <div style={{ flex: 1 }}>
                <div style={styles.totalLabel}>Valor Total</div>
                <div style={styles.totalAmount}>
                  {valorTotalFormatado}
                </div>
              </div>
              <div style={styles.pfCount}>
                {totals.totalPF} PF
              </div>
            </div>
          )}

          {/* Status */}
          <div
            style={{
              ...styles.statusIndicator,
              borderLeftColor: statusColor,
              backgroundColor: `${statusColor}15`
            }}
          >
            <span className="material-symbols-outlined" style={{
              fontSize: '16px',
              color: statusColor,
              animation: saveStatus === 'saving' ? 'spin 1s linear infinite' : 'none'
            }}>
              {statusIcon}
            </span>
            <span style={{ color: statusColor, fontSize: '14px', fontWeight: '500' }}>
              {statusText}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

// ESTILOS EM-LINE (CSS-in-JS) para evitar problemas com CSS externo
const styles = {
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 20px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    gap: '20px'
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '200px'
  },
  headerTitle: {
    color: '#0f172a',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  headerSubtitle: {
    color: '#64748b',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px'
  },
  headerCenter: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    minWidth: '400px',
    maxWidth: '600px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    minWidth: '250px',
    justifyContent: 'flex-end'
  },
  totalValue: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: '160px'
  },
  totalLabel: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600'
  },
  totalAmount: {
    fontSize: '14px',
    color: '#0f172a',
    fontWeight: 'bold'
  },
  pfCount: {
    backgroundColor: '#1246e2',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '40px',
    textAlign: 'center'
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: '6px',
    borderLeft: '3px solid',
    fontSize: '14px'
  }
};

export default Header;
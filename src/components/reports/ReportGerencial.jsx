import React from 'react';
import { useFunctionContext } from '../../context/FunctionContext';

const ReportGerencial = () => {
    const {
        empresaAtualObj,
        projetoAtualObj,
        totals
    } = useFunctionContext();

    if (!projetoAtualObj) return null;

    // Preparar dados para o gráfico comparativo (Outros projetos da empresa)
    const outrosProjetos = empresaAtualObj.projetos || [];
    // Ordenar por tamanho (PF) e pegar top 5
    const projetosComparativo = [...outrosProjetos]
        .map(p => {
            // Cálculo simplificado de PF para projetos que não são o atual (se não tiver totais salvos, estimar)
            // Idealmente, o contexto deveria fornecer ou os projetos deveriam ter 'totalPF' salvo.
            // Vou assumir que o objeto projeto tem ou vou calcular na hora se tiver funções.
            let totalPF = 0;
            if (p.funcoes) {
                // Recalculo rápido simples apenas para visualização
                totalPF = p.funcoes.reduce((acc, f) => acc + (f.pf || 0), 0) * (p.vaf?.valor || 1);
            }
            return { nome: p.nome, pf: totalPF, id: p.id };
        })
        .sort((a, b) => b.pf - a.pf)
        .slice(0, 5);

    const maxPF = Math.max(...projetosComparativo.map(p => p.pf), 10); // Evitar divisão por zero

    return (
        <div className="report-content" style={{ padding: '2rem' }}>
            <div style={styles.header}>
                <h2 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Visão Executiva do Projeto</h2>
                <p style={{ color: '#64748b' }}>
                    Status geral e métricas de produtividade para <strong>{projetoAtualObj.nome}</strong>
                </p>
            </div>

            {/* Cards de Resumo */}
            <div style={styles.cardsContainer}>
                <div style={styles.card}>
                    <div style={styles.cardIcon}>functions</div>
                    <div style={styles.cardValue}>{totals.totalPF}</div>
                    <div style={styles.cardLabel}>Pontos de Função Total</div>
                    <div style={styles.cardSub}>
                        {totals.totalPFBruto} Bruto • VAF {totals.vaf}
                    </div>
                </div>

                <div style={styles.card}>
                    <div style={{ ...styles.cardIcon, backgroundColor: '#dcfce7', color: '#166534' }}>payments</div>
                    <div style={styles.cardValue}>R$ {totals.valorTotal}</div>
                    <div style={styles.cardLabel}>Valor Estimado</div>
                    <div style={styles.cardSub}>
                        Base: R$ {empresaAtualObj.valorPF?.toFixed(2)} / PF
                    </div>
                </div>

                <div style={styles.card}>
                    <div style={{ ...styles.cardIcon, backgroundColor: '#fef3c7', color: '#b45309' }}>schedule</div>
                    <div style={styles.cardValue}>{totals.esforcoTotal}h</div>
                    <div style={styles.cardLabel}>Esforço Estimado</div>
                    <div style={styles.cardSub}>
                        ~{totals.diasUteis} dias úteis ({empresaAtualObj.hcpp}h/PF)
                    </div>
                </div>
            </div>

            <div style={styles.gridTwoColumns}>
                {/* Status do Projeto */}
                <div style={styles.sectionBox}>
                    <h3 style={styles.sectionTitle}>Status da Contagem</h3>

                    <div style={styles.statusList}>
                        <div style={styles.statusItem}>
                            <span style={styles.statusLabel}>Data de Início</span>
                            <span style={styles.statusValue}>
                                {projetoAtualObj.dataInicioContagem
                                    ? new Date(projetoAtualObj.dataInicioContagem).toLocaleDateString('pt-BR')
                                    : '-'}
                            </span>
                        </div>

                        <div style={styles.statusItem}>
                            <span style={styles.statusLabel}>Última Modificação</span>
                            <span style={styles.statusValue}>
                                {projetoAtualObj.updatedAt
                                    ? new Date(projetoAtualObj.updatedAt).toLocaleDateString('pt-BR')
                                    : new Date().toLocaleDateString('pt-BR')}
                            </span>
                        </div>

                        <div style={styles.statusItem}>
                            <span style={styles.statusLabel}>Total de Funções</span>
                            <span style={styles.statusValue}>{totals.totalItems}</span>
                        </div>

                        <div style={styles.statusItem}>
                            <span style={styles.statusLabel}>Tipo de Contagem</span>
                            <span style={styles.statusValue} className="capitalize">
                                {projetoAtualObj.tipoContagem || 'Desenvolvimento'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Gráfico Comparativo (CSS Puro) */}
                <div style={styles.sectionBox}>
                    <h3 style={styles.sectionTitle}>Comparativo de Tamanho (PF) - Projetos da Empresa</h3>
                    <div style={styles.chartContainer}>
                        {projetosComparativo.map((proj) => (
                            <div key={proj.id} style={styles.chartRow}>
                                <div style={styles.chartLabel}>
                                    {proj.nome} {proj.id === projetoAtualObj.id && '(Atual)'}
                                </div>
                                <div style={styles.chartBarArea}>
                                    <div
                                        style={{
                                            ...styles.chartBar,
                                            width: `${(proj.pf / maxPF) * 100}%`,
                                            backgroundColor: proj.id === projetoAtualObj.id ? '#1246e2' : '#cbd5e1'
                                        }}
                                    />
                                    <span style={styles.chartValue}>{Math.round(proj.pf)}</span>
                                </div>
                            </div>
                        ))}

                        {projetosComparativo.length === 0 && (
                            <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                Dados insuficientes para comparação.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    header: {
        marginBottom: '2rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '1rem',
    },
    cardsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    card: {
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    cardIcon: {
        fontFamily: 'Material Symbols Outlined',
        fontSize: '24px',
        color: '#1246e2',
        backgroundColor: '#dbeafe',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '1rem',
    },
    cardValue: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: '0.25rem',
    },
    cardLabel: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#64748b',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
    },
    cardSub: {
        fontSize: '0.75rem',
        color: '#94a3b8',
        backgroundColor: '#f8fafc',
        padding: '4px 8px',
        borderRadius: '4px',
        width: '100%',
    },
    gridTwoColumns: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
    },
    sectionBox: {
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
    },
    sectionTitle: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: '1rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.5rem',
    },
    statusList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    statusItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '0.5rem',
        borderBottom: '1px dashed #e2e8f0',
    },
    statusLabel: {
        color: '#64748b',
        fontSize: '0.9rem',
    },
    statusValue: {
        fontWeight: '600',
        color: '#0f172a',
    },
    chartContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    chartRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    chartLabel: {
        width: '120px',
        fontSize: '0.85rem',
        color: '#475569',
        textAlign: 'right',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    chartBarArea: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    chartBar: {
        height: '12px',
        borderRadius: '6px',
        transition: 'width 0.5s ease-out',
    },
    chartValue: {
        fontSize: '0.75rem',
        color: '#64748b',
        width: '30px',
    },
};

export default ReportGerencial;

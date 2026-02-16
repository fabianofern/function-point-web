import React from 'react';
import HeaderSelectors from '../HeaderSelectors';

const ReportHeader = ({ onExportPDF, onExportCSV, activeTab }) => {
    return (
        <div style={styles.container}>
            {/* Seletores de Contexto (Reutilizando o componente existente) */}
            <div style={styles.selectorsArea}>
                <HeaderSelectors />
            </div>

            {/* Botões de Ação */}
            <div style={styles.actionsArea}>
                <button
                    onClick={onExportPDF}
                    style={styles.actionButton}
                    title="Exportar como PDF (Visual)"
                >
                    <span className="material-symbols-outlined">print</span>
                    <span>Imprimir / PDF</span>
                </button>

                <button
                    onClick={onExportCSV}
                    style={styles.actionButtonSecondary}
                    title="Exportar dados como CSV (Excel)"
                >
                    <span className="material-symbols-outlined">download</span>
                    <span>Exportar CSV</span>
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    selectorsArea: {
        flex: '1',
        minWidth: '300px',
    },
    actionsArea: {
        display: 'flex',
        gap: '0.5rem',
    },
    actionButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1rem',
        backgroundColor: '#1246e2',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'background-color 0.2s',
    },
    actionButtonSecondary: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1rem',
        backgroundColor: 'white',
        color: '#334155',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'background-color 0.2s',
    }
};

export default ReportHeader;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Cores do Dashboard (Inspirado no tema StandardPoint)
const colors = {
    primary: '#1246e2', // Azul principal
    primaryHover: '#1d4ed8',
    background: '#f8fafc', // Fundo claro
    cardBg: '#ffffff',
    textMain: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    errorBg: '#fef2f2',
    errorText: '#dc2626'
};

const LoginScreen = ({ onLoginSuccess }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await login(username, password);
            // Sucesso é tratado pelo AuthContext/App.jsx, mas chamamos callback se existir
            if (onLoginSuccess) onLoginSuccess();
        } catch (err) {
            setError(err.message || 'Falha no login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            position: 'relative',
        }}>
            {/* Background Decorativo Sutil */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: 0
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(18, 70, 226, 0.05) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-5%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                }} />
            </div>

            {/* Card de Login */}
            <div style={{
                width: '100%',
                maxWidth: '400px',
                margin: '1.5rem',
                padding: '3rem 2.5rem',
                backgroundColor: colors.cardBg,
                borderRadius: '16px',
                boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
                zIndex: 1,
                border: `1px solid ${colors.border}`
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                    }}>
                        <img
                            src="/icon.png"
                            alt="StandardPoint Logo"
                            style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        color: colors.textMain,
                        letterSpacing: '-0.025em'
                    }}>
                        StandardPoint
                    </h1>
                    <p style={{ color: colors.textSecondary, fontSize: '0.95rem' }}>
                        Faça login para gerenciar suas métricas
                    </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit}>
                    {/* Campo Usuário */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#334155'
                        }}>
                            Usuário
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Digite seu usuário"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    backgroundColor: '#ffffff',
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: '10px',
                                    color: colors.textMain,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = colors.primary;
                                    e.target.style.boxShadow = `0 0 0 3px rgba(18, 70, 226, 0.1)`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = colors.border;
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    {/* Campo Senha */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#334155'
                            }}>
                                Senha
                            </label>
                            {/* Esqueceu senha movido para aqui para ficar mais comum */}
                            <button
                                type="button"
                                onClick={() => alert('Entre em contato com o administrador do sistema.')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: colors.primary,
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '0.8rem',
                                    textDecoration: 'none',
                                    padding: 0
                                }}
                            >
                                Esqueceu?
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 2.75rem 0.75rem 1rem',
                                    backgroundColor: '#ffffff',
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: '10px',
                                    color: colors.textMain,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = colors.primary;
                                    e.target.style.boxShadow = `0 0 0 3px rgba(18, 70, 226, 0.1)`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = colors.border;
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#94a3b8',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '4px'
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Mensagem de Erro */}
                    {error && (
                        <div style={{
                            backgroundColor: colors.errorBg,
                            color: colors.errorText,
                            padding: '0.75rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            border: '1px solid #fecaca'
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                            {error}
                        </div>
                    )}

                    {/* Botão Login */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            backgroundColor: colors.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.8 : 1,
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(18, 70, 226, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primaryHover)}
                        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primary)}
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined" style={{
                                    fontSize: '20px',
                                    animation: 'spin 1s linear infinite'
                                }}>sync</span>
                                Entrando...
                            </>
                        ) : (
                            <>
                                <span>Entrar</span>
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

            </div>

            {/* Rodapé da Página */}
            <div style={{
                position: 'absolute',
                bottom: '1.5rem',
                color: '#94a3b8',
                fontSize: '0.75rem',
                textAlign: 'center',
                width: '100%'
            }}>
                © {new Date().getFullYear()} StandardPoint • Métricas de Software
            </div>
        </div>
    );
};

export default LoginScreen;

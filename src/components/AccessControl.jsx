import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AccessControl = () => {
    const { users, addUser, updateUser, deleteUser, currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: 'Usuário'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Abrir modal para criar/editar
    const openModal = (user = null) => {
        setError('');
        setSuccess('');
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                username: user.username,
                password: '', // Não mostrar senha por segurança
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                username: '',
                password: '',
                role: 'Usuário'
            });
        }
        setIsModalOpen(true);
    };

    // Fechar modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    // Salvar usuário
    const handleSave = async (e) => {
        e.preventDefault();
        setError('');

        // Validação básica
        if (!formData.name || !formData.username) {
            setError('Nome e Usuário são obrigatórios');
            return;
        }

        if (!editingUser && !formData.password) {
            setError('Senha é obrigatória para novos usuários');
            return;
        }

        try {
            if (editingUser) {
                // Atualizar
                const updates = {
                    name: formData.name,
                    username: formData.username,
                    role: formData.role
                };
                // Só atualiza senha se for fornecida
                if (formData.password) {
                    updates.password = formData.password;
                }

                await updateUser(editingUser.id, updates);
                setSuccess('Usuário atualizado com sucesso');
            } else {
                // Criar
                await addUser(formData);
                setSuccess('Usuário criado com sucesso');
            }
            setTimeout(closeModal, 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    // Excluir usuário
    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await deleteUser(id);
                setSuccess('Usuário excluído');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.message);
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    return (
        <div style={{ padding: '0.5rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{
                        color: '#0f172a',
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span className="material-symbols-outlined" style={{ color: '#1246e2', fontSize: '32px' }}>
                            admin_panel_settings
                        </span>
                        Controle de Acessos
                    </h1>
                    <p style={{ color: '#64748b' }}>Gerencie usuários e permissões do sistema</p>
                </div>

                <button
                    onClick={() => openModal()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#1246e2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <span className="material-symbols-outlined">person_add</span>
                    Novo Usuário
                </button>
            </div>

            {/* Mensagens de Feedback Globais */}
            {success && !isModalOpen && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    border: '1px solid #a7f3d0'
                }}>
                    {success}
                </div>
            )}
            {error && !isModalOpen && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    border: '1px solid #fecaca'
                }}>
                    {error}
                </div>
            )}

            {/* Tabela de Usuários */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                border: '1px solid #e2e8f0'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#475569', fontWeight: '600' }}>Nome</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#475569', fontWeight: '600' }}>Usuário</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#475569', fontWeight: '600' }}>Perfil</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#475569', fontWeight: '600' }}>Criado em</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: '#475569', fontWeight: '600' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '500' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: '#e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#64748b',
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        {user.name}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', color: '#64748b' }}>{user.username}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        backgroundColor: user.role === 'Master' ? '#e0e7ff' : user.role === 'Administrador' ? '#dbeafe' : '#f1f5f9',
                                        color: user.role === 'Master' ? '#4338ca' : user.role === 'Administrador' ? '#1e40af' : '#475569'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => openModal(user)}
                                            title="Editar"
                                            style={{
                                                padding: '0.4rem',
                                                backgroundColor: 'transparent',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                color: '#64748b'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#f1f5f9';
                                                e.currentTarget.style.color = '#3b82f6';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = '#64748b';
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            disabled={user.id === currentUser?.id || user.role === 'Master' && currentUser?.role !== 'Master'}
                                            title="Excluir"
                                            style={{
                                                padding: '0.4rem',
                                                backgroundColor: 'transparent',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                cursor: user.id === currentUser?.id ? 'not-allowed' : 'pointer',
                                                color: user.id === currentUser?.id ? '#cbd5e1' : '#64748b'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (user.id !== currentUser?.id) {
                                                    e.currentTarget.style.backgroundColor = '#fef2f2';
                                                    e.currentTarget.style.color = '#ef4444';
                                                    e.currentTarget.style.borderColor = '#fecaca';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (user.id !== currentUser?.id) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = '#64748b';
                                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                                }
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Edição/Criação */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2rem',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ marginTop: 0, color: '#0f172a', marginBottom: '1.5rem' }}>
                            {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                        </h2>

                        {error && (
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: '#fef2f2',
                                color: '#dc2626',
                                borderRadius: '6px',
                                marginBottom: '1rem',
                                fontSize: '0.875rem'
                            }}>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: '#ecfdf5',
                                color: '#059669',
                                borderRadius: '6px',
                                marginBottom: '1rem',
                                fontSize: '0.875rem'
                            }}>
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>Nome Completo</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>Usuário de Acesso</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
                                    {editingUser ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>Perfil de Acesso</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <option value="Usuário">Usuário</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Master">Master</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#f1f5f9',
                                        color: '#475569',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#1246e2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessControl;

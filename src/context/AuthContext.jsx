import React, { createContext, useState, useEffect, useContext } from 'react';

// Contexto de Autenticação
const AuthContext = createContext();

// Chaves para localStorage
const STORAGE_KEY_USERS = 'standardpoint_users_v1';
const STORAGE_KEY_CURRENT_USER = 'standardpoint_current_session_v1';

// Usuário padrão inicial (será criado se não existir nenhum)
const DEFAULT_ADMIN = {
    id: 'admin-master-001',
    username: 'admin',
    password: 'admin123', // Em produção real, senhas devem ser hasheadas
    name: 'Administrador Master',
    role: 'Master', // Master, Administrador, Usuário
    createdAt: new Date().toISOString()
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Inicializar dados
    useEffect(() => {
        const loadAuthData = () => {
            try {
                // Carregar usuários
                const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
                let parsedUsers = [];

                if (savedUsers) {
                    parsedUsers = JSON.parse(savedUsers);
                } else {
                    // Se não existir, criar o admin padrão
                    parsedUsers = [DEFAULT_ADMIN];
                    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(parsedUsers));
                }
                setUsers(parsedUsers);

                // Carregar sessão atual
                const savedSession = sessionStorage.getItem(STORAGE_KEY_CURRENT_USER);
                if (savedSession) {
                    setCurrentUser(JSON.parse(savedSession));
                }
            } catch (error) {
                console.error('Erro ao carregar dados de autenticação:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAuthData();
    }, []);

    // Login
    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            // Pequeno delay para simular processamento e melhorar UX
            setTimeout(() => {
                const user = users.find(u => u.username === username && u.password === password);

                if (user) {
                    // Remover senha do objeto de sessão por segurança (mesmo sendo local)
                    const { password: _, ...userSession } = user;

                    setCurrentUser(userSession);
                    sessionStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(userSession));
                    resolve(userSession);
                } else {
                    reject(new Error('Usuário ou senha inválidos'));
                }
            }, 800);
        });
    };

    // Logout
    const logout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    };

    // CRUD de Usuários
    const addUser = (userData) => {
        return new Promise((resolve, reject) => {
            if (users.some(u => u.username === userData.username)) {
                reject(new Error('Nome de usuário já existe'));
                return;
            }

            const newUser = {
                ...userData,
                id: `user-${Date.now()}`,
                createdAt: new Date().toISOString()
            };

            const updatedUsers = [...users, newUser];
            setUsers(updatedUsers);
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
            resolve(newUser);
        });
    };

    const updateUser = (id, updates) => {
        return new Promise((resolve, reject) => {
            const updatedUsers = users.map(user =>
                user.id === id ? { ...user, ...updates } : user
            );

            setUsers(updatedUsers);
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));

            // Se alterou o próprio usuário logado, atualizar sessão
            if (currentUser && currentUser.id === id) {
                const updatedCurrentUser = { ...currentUser, ...updates };
                // Remover senha se estiver presente na atualização para não salvar na sessão
                if (updatedCurrentUser.password) delete updatedCurrentUser.password;

                setCurrentUser(updatedCurrentUser);
                sessionStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(updatedCurrentUser));
            }

            resolve();
        });
    };

    const deleteUser = (id) => {
        return new Promise((resolve, reject) => {
            if (id === DEFAULT_ADMIN.id) {
                reject(new Error('Não é possível excluir o administrador padrão'));
                return;
            }

            if (currentUser && currentUser.id === id) {
                reject(new Error('Não é possível excluir seu próprio usuário'));
                return;
            }

            const updatedUsers = users.filter(u => u.id !== id);
            setUsers(updatedUsers);
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
            resolve();
        });
    };

    // Verificação de Permissão
    const hasPermission = (requiredRoles) => {
        if (!currentUser) return false;
        // Master tem acesso a tudo
        if (currentUser.role === 'Master') return true;
        return requiredRoles.includes(currentUser.role);
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            users,
            loading,
            login,
            logout,
            addUser,
            updateUser,
            deleteUser,
            hasPermission,
            isAdmin: currentUser?.role === 'Master' || currentUser?.role === 'Administrador',
            isMaster: currentUser?.role === 'Master'
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

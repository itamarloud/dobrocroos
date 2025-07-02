import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Usaremos axios para chamadas à API
import { jwtDecode } from 'jwt-decode'; // Para decodificar o token JWT

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Configuração base do Axios (pode ir para um arquivo api.js separado depois)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // '/api' usará o proxy do Vite dev server
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true); // Para verificar o token inicial

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          setUser({
            id: decodedToken.id,
            email: decodedToken.email,
            nome: decodedToken.nome,
            tipo_usuario: decodedToken.tipo_usuario
          });
          setToken(storedToken);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
          // Token expirado
          localStorage.removeItem('authToken');
          setUser(null);
          setToken(null);
          delete apiClient.defaults.headers.common['Authorization'];
        }
      } catch (error) {
        console.error("Erro ao decodificar token no useEffect:", error);
        localStorage.removeItem('authToken');
        setUser(null);
        setToken(null);
        delete apiClient.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/auth/login', { email, senha });
      const { token: newToken, usuario } = response.data;

      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser({
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipo_usuario: usuario.tipo_usuario
      });
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setLoading(false);
      return { success: true, user: usuario };
    } catch (error) {
      console.error("Erro no login (AuthContext):", error.response?.data?.message || error.message);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      delete apiClient.defaults.headers.common['Authorization'];
      setLoading(false);
      throw error; // Re-throw para o componente de login tratar
    }
  };

  const register = async (userData) => {
    try {
        setLoading(true);
        // A API de registro no backend já retorna o usuário e não um token diretamente
        // Se quisesse logar após registro, teria que chamar a função de login aqui
        const response = await apiClient.post('/auth/register', userData);
        setLoading(false);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Erro no registro (AuthContext):", error.response?.data?.message || error.message);
        setLoading(false);
        throw error;
    }
  };


  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    delete apiClient.defaults.headers.common['Authorization'];
    // Opcional: notificar o backend sobre o logout, se necessário
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading: loading,
    login,
    logout,
    register, // Adicionando a função de registro
    apiClient // Expondo o apiClient configurado se necessário em outros lugares
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

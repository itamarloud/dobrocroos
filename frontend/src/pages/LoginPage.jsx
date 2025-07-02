import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Tenta pegar a rota de origem para redirecionar após o login
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await login(email, senha);
      // Redireciona com base no tipo de usuário ou para a página de origem
      if (user.tipo_usuario === 'administrador') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.tipo_usuario === 'colaborador') {
        navigate('/app/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true }); // Redireciona para a página de origem
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
      console.error("Erro no handleSubmit do Login:", err);
    } finally {
      setLoading(false);
    }
  };

  // Estilos inline simples por enquanto
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '20px',
      backgroundColor: '#f0f2f5'
    },
    form: {
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      width: '100%',
      maxWidth: '400px'
    },
    input: {
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem'
    },
    button: {
      padding: '12px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: 'var(--primary-blue)', // Usando variável do global.css
      color: 'white',
      fontSize: '1rem',
      cursor: 'pointer'
    },
    error: {
      color: 'red',
      textAlign: 'center',
      fontSize: '0.9rem'
    },
    title: {
      color: 'var(--dark-blue-text)',
      textAlign: 'center',
      marginBottom: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login do Sistema</h2>
        {error && <p style={styles.error}>{error}</p>}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            placeholder="seuemail@exemplo.com"
          />
        </div>
        <div>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={styles.input}
            placeholder="Sua senha"
          />
        </div>
        <button type="submit" disabled={loading} style={styles.button} className="button-primary">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

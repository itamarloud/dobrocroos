import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Estilos inline simples
  const headerStyle = {
    backgroundColor: 'var(--dark-blue-text)', // Azul escuro da paleta
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const logoStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem',
  };

  const buttonStyle = {
    backgroundColor: 'var(--primary-blue)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <header style={headerStyle}>
      <Link to="/" style={logoStyle}>Escala Fácil</Link>
      <nav style={navLinksStyle}>
        {isAuthenticated && user ? (
          <>
            {user.tipo_usuario === 'administrador' && (
              <Link to="/admin/dashboard" style={linkStyle}>Painel Admin</Link>
            )}
            {user.tipo_usuario === 'colaborador' && (
              <Link to="/app/dashboard" style={linkStyle}>Meu Painel</Link>
            )}
            {/* Links comuns para ambos os tipos de usuário logado */}
            <Link to="/app/lojas" style={linkStyle}>Lojas</Link>
            <span style={{ color: '#e0e0e0' }}>Olá, {user.nome}</span>
            <button onClick={handleLogout} style={buttonStyle}>Sair</button>
          </>
        ) : (
          <Link to="/login" style={linkStyle}>Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;

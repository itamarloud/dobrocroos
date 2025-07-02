import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
// Futuramente: import Sidebar from './Sidebar';
// Futuramente: import Footer from './Footer';

const MainLayout = () => {
  const location = useLocation();
  // Mensagem de "Não autorizado" vinda do ProtectedRoute
  const message = location.state?.message;

  const layoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const contentStyle = {
    flexGrow: 1,
    padding: '20px', // Espaçamento interno para o conteúdo da página
    // backgroundColor: '#f4f6f8', // Um fundo levemente diferente para a área de conteúdo
  };

  const messageStyle = {
    backgroundColor: 'var(--warning-yellow)',
    color: 'var(--dark-blue-text)',
    padding: '10px',
    textAlign: 'center',
    borderRadius: '4px',
    margin: '10px 20px',
    border: '1px solid var(--neutral-blue-gray)'
  };

  return (
    <div style={layoutStyle}>
      <Header />
      {/*
      <div style={{ display: 'flex', flexGrow: 1 }}>
        {isAuthenticated && <Sidebar />}  // Sidebar apareceria aqui se autenticado
        <main style={contentStyle}>
          {message && <div style={messageStyle}>{message}</div>}
          <Outlet /> // O conteúdo da rota atual será renderizado aqui
        </main>
      </div>
      */}
      <main style={contentStyle}>
        {message && <div style={messageStyle}>{message}</div>}
        <Outlet /> {/* O conteúdo da rota atual será renderizado aqui */}
      </main>
      {/* <Footer /> // Footer apareceria aqui */}
    </div>
  );
};

export default MainLayout;

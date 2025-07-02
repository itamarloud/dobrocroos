import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import LoginPage from './pages/LoginPage';
// Páginas placeholder (serão desenvolvidas depois)
const HomePage = () => <h1>Bem-vindo ao Escala Fácil!</h1>;

// --- Páginas do Colaborador ---
const EmployeeDashboardPage = () => <h2>Painel do Colaborador</h2>;
const MinhasEscalasPage = () => <h3>Minhas Escalas (Colaborador)</h3>; // Placeholder
const MeusAvisosPage = () => <h3>Meus Avisos (Colaborador)</h3>; // Placeholder
const MinhasFeriasPage = () => <h3>Minhas Férias (Colaborador)</h3>; // Placeholder
// const ListaLojasPage = () => <h3>Lista de Lojas (Visível para Colaborador)</h3>; // Placeholder
import LojasPage from './pages/LojasPage'; // Importando a página real

// --- Páginas do Administrador ---
const AdminDashboardPage = () => <h2>Painel do Administrador</h2>;
const GerenciarUsuariosPage = () => <h3>Gerenciar Usuários (Admin)</h3>; // Placeholder
const GerenciarLojasPage = () => <h3>Gerenciar Lojas (Admin)</h3>; // Placeholder
const GerenciarEscalasPage = () => <h3>Gerenciar Escalas (Admin)</h3>; // Placeholder
const GerenciarAvisosPage = () => <h3>Gerenciar Avisos (Admin)</h3>; // Placeholder
const GerenciarFeriasPage = () => <h3>Gerenciar Férias (Admin)</h3>; // Placeholder

const NotFoundPage = () => <h1>404 - Página Não Encontrada</h1>;

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando aplicação...</div>; // Ou um spinner/splash screen
  }

  return (
    <Router>
      <Routes>
        {/* Rota de Login - Acessível publicamente */}
        <Route path="/login" element={isAuthenticated ? <Navigate to={user?.tipo_usuario === 'administrador' ? "/admin/dashboard" : "/app/dashboard"} /> : <LoginPage />} />

        {/* Rotas Públicas ou que usam o MainLayout sem proteção específica de role */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* A rota de Lojas pode ser aqui se for acessível por todos os autenticados,
              ou dentro de /app e /admin especificamente.
              Por simplicidade, vamos colocar uma geral aqui, protegida apenas por autenticação.
          */}
          <Route element={<ProtectedRoute />}> {/* Apenas autenticado */}
            <Route path="/lojas" element={<LojasPage />} /> {/* Usando a página real */}
          </Route>
        </Route>


        {/* Rotas Protegidas para Colaboradores */}
        <Route element={<ProtectedRoute roleRequired="colaborador_ou_admin" />}> {/* Protege o MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/app/dashboard" element={<EmployeeDashboardPage />} />
            <Route path="/app/escalas" element={<MinhasEscalasPage />} />
            <Route path="/app/avisos" element={<MeusAvisosPage />} />
            <Route path="/app/ferias" element={<MinhasFeriasPage />} />
            {/* A rota de lojas já está acima, mas poderia ser específica aqui também */}
            {/* <Route path="/app/lojas" element={<ListaLojasPage />} /> */}
          </Route>
        </Route>

        {/* Rotas Protegidas para Administradores */}
        <Route element={<ProtectedRoute roleRequired="administrador" />}> {/* Protege o MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/usuarios" element={<GerenciarUsuariosPage />} />
            <Route path="/admin/lojas" element={<GerenciarLojasPage />} />
            <Route path="/admin/escalas" element={<GerenciarEscalasPage />} />
            <Route path="/admin/avisos" element={<GerenciarAvisosPage />} />
            <Route path="/admin/ferias" element={<GerenciarFeriasPage />} />
          </Route>
        </Route>

        {/* Rota para página não encontrada */}
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;

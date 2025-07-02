import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// O `roleRequired` pode ser 'administrador' ou 'colaborador'
// Se `roleRequired` não for fornecido, apenas verifica se está autenticado.
const ProtectedRoute = ({ roleRequired }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Pode mostrar um spinner de carregamento aqui enquanto verifica a autenticação
    return <div>Verificando autenticação...</div>;
  }

  if (!isAuthenticated) {
    // Redireciona para a página de login, guardando a localização atual
    // para que o usuário possa ser redirecionado de volta após o login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se um papel específico é requerido, verifica se o usuário tem esse papel
  if (roleRequired) {
    if (user && user.tipo_usuario === roleRequired) {
      return <Outlet />; // Usuário autenticado e com o papel correto, renderiza o conteúdo da rota
    } else if (user && roleRequired === 'colaborador_ou_admin' && (user.tipo_usuario === 'colaborador' || user.tipo_usuario === 'administrador')) {
      return <Outlet />;
    }
    else {
      // Usuário autenticado, mas não tem o papel necessário.
      // Redireciona para uma página de "Não Autorizado" ou para a home, por exemplo.
      // Por enquanto, vamos redirecionar para uma página inicial ou mostrar uma mensagem.
      // Idealmente, teríamos uma página específica para isso.
      console.warn(`Usuário ${user?.email} tentou acessar rota protegida para ${roleRequired} sem permissão. Papel atual: ${user?.tipo_usuario}`);
      // Poderia ser <Navigate to="/unauthorized" replace />;
      return <Navigate to={user?.tipo_usuario === 'administrador' ? '/admin/dashboard' : '/app/dashboard'} replace state={{ message: "Você não tem permissão para acessar esta página."}} />;
    }
  }

  // Se nenhum papel específico é requerido, apenas estar autenticado é suficiente.
  return <Outlet />; // Renderiza o conteúdo da rota filha
};

export default ProtectedRoute;

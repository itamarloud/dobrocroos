const express = require('express');
const adminController = require('../controllers/adminController'); // Criaremos este controller
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Aplicar middleware de autenticação e verificação de admin para todas as rotas de admin
router.use(authenticateToken);
router.use(isAdmin);

// --- Rotas de Gerenciamento de Usuários ---
// POST /api/admin/usuarios - Criar novo usuário
router.post('/usuarios', adminController.criarUsuario);
// GET /api/admin/usuarios - Listar todos os usuários
router.get('/usuarios', adminController.listarUsuarios);
// GET /api/admin/usuarios/:id - Obter detalhes de um usuário
router.get('/usuarios/:id', adminController.obterUsuario);
// PUT /api/admin/usuarios/:id - Atualizar um usuário
router.put('/usuarios/:id', adminController.atualizarUsuario);
// DELETE /api/admin/usuarios/:id - Deletar/Desativar um usuário
router.delete('/usuarios/:id', adminController.deletarUsuario); // Pode ser desativação

// --- Rotas de Gerenciamento de Lojas ---
// POST /api/admin/lojas - Criar nova loja
router.post('/lojas', adminController.criarLoja);
// GET /api/admin/lojas - Listar todas as lojas
router.get('/lojas', adminController.listarLojas);
// GET /api/admin/lojas/:id - Obter detalhes de uma loja
router.get('/lojas/:id', adminController.obterLoja);
// PUT /api/admin/lojas/:id - Atualizar uma loja
router.put('/lojas/:id', adminController.atualizarLoja);
// DELETE /api/admin/lojas/:id - Deletar uma loja
router.delete('/lojas/:id', adminController.deletarLoja);

// --- Rotas de Gerenciamento de Escalas ---
// POST /api/admin/escalas - Criar nova escala
router.post('/escalas', adminController.criarEscala);
// GET /api/admin/escalas - Listar todas as escalas (com filtros)
router.get('/escalas', adminController.listarEscalas);
// GET /api/admin/escalas/:id - Obter detalhes de uma escala
router.get('/escalas/:id', adminController.obterEscala);
// PUT /api/admin/escalas/:id - Atualizar uma escala
router.put('/escalas/:id', adminController.atualizarEscala);
// DELETE /api/admin/escalas/:id - Deletar uma escala
router.delete('/escalas/:id', adminController.deletarEscala);

// --- Rotas de Gerenciamento de Avisos ---
// POST /api/admin/avisos - Criar novo aviso
router.post('/avisos', adminController.criarAviso);
// GET /api/admin/avisos - Listar todos os avisos
router.get('/avisos', adminController.listarAvisos);
// GET /api/admin/avisos/:id - Obter detalhes de um aviso
router.get('/avisos/:id', adminController.obterAviso);
// PUT /api/admin/avisos/:id - Atualizar um aviso
router.put('/avisos/:id', adminController.atualizarAviso);
// DELETE /api/admin/avisos/:id - Deletar um aviso
router.delete('/avisos/:id', adminController.deletarAviso);

// --- Rotas de Gerenciamento de Férias ---
// POST /api/admin/ferias - Registrar férias para um colaborador
router.post('/ferias', adminController.registrarFerias);
// GET /api/admin/ferias - Listar todas as férias (com filtros)
router.get('/ferias', adminController.listarFerias);
// GET /api/admin/ferias/:id - Obter detalhes de um período de férias
router.get('/ferias/:id', adminController.obterFerias);
// PUT /api/admin/ferias/:id - Atualizar um período de férias
router.put('/ferias/:id', adminController.atualizarFerias);
// PATCH /api/admin/ferias/:id/status - Aprovar/Rejeitar férias
router.patch('/ferias/:id/status', adminController.atualizarStatusFerias);
// DELETE /api/admin/ferias/:id - Deletar um período de férias
router.delete('/ferias/:id', adminController.deletarFerias);

module.exports = router;

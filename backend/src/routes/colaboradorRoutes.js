const express = require('express');
const colaboradorController = require('../controllers/colaboradorController'); // Criaremos este controller
const { authenticateToken, isColaboradorOuAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Aplicar middleware de autenticação para todas as rotas de colaborador
router.use(authenticateToken);
router.use(isColaboradorOuAdmin); // Garante que apenas colaboradores ou admins acessem

// GET /api/colaborador/escalas - Visualizar escala individual do usuário logado
router.get('/escalas', colaboradorController.getMinhasEscalas);

// GET /api/colaborador/avisos - Visualizar avisos gerais
router.get('/avisos', colaboradorController.getAvisos);

// GET /api/colaborador/ferias - Consultar seus períodos de férias
router.get('/ferias', colaboradorController.getMinhasFerias);

// GET /api/colaborador/lojas - Listar todas as lojas (informações básicas)
// Esta rota também poderia ser /api/lojas e ser acessível por todos os autenticados
router.get('/lojas', colaboradorController.getLojas);


module.exports = router;

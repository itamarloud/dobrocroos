const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware'); // Criaremos este middleware

const router = express.Router();

// Rota para registrar um novo usuário
// POST /api/auth/register
router.post('/register', authController.register);

// Rota para login de usuário
// POST /api/auth/login
router.post('/login', authController.login);

// Rota para obter o perfil do usuário logado (exemplo de rota protegida)
// GET /api/auth/profile
router.get('/profile', authenticateToken, authController.getProfile);

// Exemplo de rota que só admin pode acessar
// GET /api/auth/admin-test
router.get('/admin-test', authenticateToken, isAdmin, (req, res) => {
    res.status(200).json({ message: 'Olá Admin! Você tem acesso.', user: req.user });
});


module.exports = router;

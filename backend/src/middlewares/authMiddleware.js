const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { Usuario } = require('../models'); // Para buscar dados atualizados do usuário se necessário

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'Token não fornecido.' }); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, async (err, decodedPayload) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado.' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Token inválido.' }); // Forbidden
      }
      return res.status(403).json({ message: 'Falha na autenticação do token.' });
    }

    // Opcional: buscar dados frescos do usuário para garantir que ele ainda existe e está ativo
    try {
      const usuario = await Usuario.findByPk(decodedPayload.id, {
        attributes: ['id', 'email', 'nome', 'tipo_usuario', 'ativo'] // Não incluir senha_hash
      });

      if (!usuario) {
        return res.status(403).json({ message: 'Usuário do token não encontrado.' });
      }

      if (!usuario.ativo) {
        return res.status(403).json({ message: 'Usuário do token está inativo.' });
      }

      // Adiciona os dados do usuário (do banco, mais atualizados) ao objeto req
      req.user = usuario.toJSON(); // Usar toJSON() para obter um objeto simples
      next();

    } catch (dbError) {
      console.error("Erro ao buscar usuário do token no DB:", dbError);
      return res.status(500).json({ message: 'Erro interno ao verificar usuário do token.' });
    }
  });
}

function isAdmin(req, res, next) {
  if (req.user && req.user.tipo_usuario === 'administrador') {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado. Rota exclusiva para administradores.' }); // Forbidden
  }
}

function isColaborador(req, res, next) {
  if (req.user && req.user.tipo_usuario === 'colaborador') {
    next();
  } else {
    // Se não for colaborador, pode ser admin. Se a rota for SÓ para colaborador, negar.
    // Se a rota puder ser acessada por admin também, ajustar lógica ou criar um `isColaboradorOuAdmin`
    res.status(403).json({ message: 'Acesso negado. Rota exclusiva para colaboradores.' }); // Forbidden
  }
}

function isColaboradorOuAdmin(req, res, next) {
    if (req.user && (req.user.tipo_usuario === 'colaborador' || req.user.tipo_usuario === 'administrador')) {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Usuário não autorizado.'});
    }
}


module.exports = {
  authenticateToken,
  isAdmin,
  isColaborador,
  isColaboradorOuAdmin,
};

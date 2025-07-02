const authService = require('../services/authService');

async function register(req, res) {
  try {
    // No futuro, podemos restringir quem pode se registrar ou adicionar campos específicos
    const { nome, email, senha, tipo_usuario, cargo, data_admissao, telefone } = req.body;
    const usuario = await authService.registrarUsuario({
      nome,
      email,
      senha,
      tipo_usuario, // Permitir que seja definido no registro, ou ter uma rota específica para admin criar usuários
      cargo,
      data_admissao,
      telefone
    });
    res.status(201).json({ message: 'Usuário registrado com sucesso!', usuario });
  } catch (error) {
    console.error("Erro no controller de registro:", error.message);
    res.status(400).json({ message: 'Erro ao registrar usuário.', error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    const resultadoLogin = await authService.loginUsuario(email, senha);
    res.status(200).json(resultadoLogin);
  } catch (error) {
    console.error("Erro no controller de login:", error.message);
    // Usar 401 para falha de autenticação, 400 para bad request (ex: campos faltando)
    if (error.message === 'Usuário não encontrado.' || error.message === 'Credenciais inválidas.' || error.message === 'Usuário inativo. Contate o administrador.') {
      res.status(401).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Erro ao tentar fazer login.', error: error.message });
    }
  }
}

// Poderíamos adicionar um controller para obter o perfil do usuário logado
async function getProfile(req, res) {
    // req.user é populado pelo middleware de autenticação
    if (!req.user) {
        return res.status(401).json({ message: 'Não autorizado. Token inválido ou não fornecido.' });
    }
    // Os dados já estão em req.user, mas podemos buscar do banco para ter os dados mais recentes
    // ou simplesmente retornar o que já temos no token, dependendo da necessidade.
    // Por simplicidade, retornaremos o que está no token.
    // Para dados mais completos, buscaríamos o usuário pelo ID:
    // const usuario = await Usuario.findByPk(req.user.id, { attributes: { exclude: ['senha_hash'] } });
    res.status(200).json({ usuario: req.user });
}


module.exports = {
  register,
  login,
  getProfile,
};

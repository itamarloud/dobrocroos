const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models'); // Certifique-se que o import do modelo está correto
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

/**
 * Registra um novo usuário.
 * @param {Object} userData - Dados do usuário (nome, email, senha, tipo_usuario, etc.)
 * @returns {Promise<Object>} O usuário criado (sem a senha)
 */
async function registrarUsuario({ nome, email, senha, tipo_usuario = 'colaborador', cargo, data_admissao, telefone }) {
  if (!nome || !email || !senha) {
    throw new Error('Nome, email e senha são obrigatórios.');
  }

  const emailExistente = await Usuario.findOne({ where: { email } });
  if (emailExistente) {
    throw new Error('Email já cadastrado.');
  }

  const senha_hash = await bcrypt.hash(senha, 10);

  try {
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha_hash,
      tipo_usuario,
      cargo,
      data_admissao,
      telefone,
      ativo: true, // Por padrão, usuário é ativo
    });

    // Remover senha_hash do objeto retornado
    const usuarioRetorno = novoUsuario.toJSON();
    delete usuarioRetorno.senha_hash;
    return usuarioRetorno;

  } catch (error) {
    console.error("Erro ao criar usuário no serviço:", error);
    throw new Error('Erro ao registrar usuário. Detalhes: ' + error.message);
  }
}

/**
 * Realiza o login do usuário.
 * @param {string} email - Email do usuário.
 * @param {string} senha - Senha do usuário.
 * @returns {Promise<Object>} Objeto com token e dados do usuário (sem a senha).
 */
async function loginUsuario(email, senha) {
  if (!email || !senha) {
    throw new Error('Email e senha são obrigatórios.');
  }

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    throw new Error('Usuário não encontrado.');
  }

  if (!usuario.ativo) {
    throw new Error('Usuário inativo. Contate o administrador.');
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaValida) {
    throw new Error('Credenciais inválidas.');
  }

  const payload = {
    id: usuario.id,
    email: usuario.email,
    tipo_usuario: usuario.tipo_usuario,
    nome: usuario.nome,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  // Remover senha_hash do objeto retornado
  const usuarioRetorno = usuario.toJSON();
  delete usuarioRetorno.senha_hash;

  return {
    token,
    usuario: usuarioRetorno,
  };
}

module.exports = {
  registrarUsuario,
  loginUsuario,
};

const { Usuario, Loja, Escala, Aviso, Ferias } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// --- Funções Auxiliares (poderiam estar em um Service) ---
async function findUsuarioById(id) {
  const usuario = await Usuario.findByPk(id, { attributes: { exclude: ['senha_hash'] } });
  if (!usuario) throw new Error('Usuário não encontrado');
  return usuario;
}

async function findLojaById(id) {
  const loja = await Loja.findByPk(id);
  if (!loja) throw new Error('Loja não encontrada');
  return loja;
}

async function findEscalaById(id) {
  const escala = await Escala.findByPk(id);
  if (!escala) throw new Error('Escala não encontrada');
  return escala;
}

async function findAvisoById(id) {
  const aviso = await Aviso.findByPk(id);
  if (!aviso) throw new Error('Aviso não encontrado');
  return aviso;
}

async function findFeriasById(id) {
  const ferias = await Ferias.findByPk(id);
  if (!ferias) throw new Error('Registro de férias não encontrado');
  return ferias;
}


// --- Gerenciamento de Usuários ---
exports.criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario, cargo, data_admissao, telefone, ativo } = req.body;
    if (!nome || !email || !senha || !tipo_usuario) {
      return res.status(400).json({ message: 'Nome, email, senha e tipo de usuário são obrigatórios.' });
    }

    const emailExistente = await Usuario.findOne({ where: { email } });
    if (emailExistente) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha_hash,
      tipo_usuario,
      cargo,
      data_admissao,
      telefone,
      ativo: ativo !== undefined ? ativo : true,
    });
    const usuarioRetorno = novoUsuario.toJSON();
    delete usuarioRetorno.senha_hash;
    res.status(201).json(usuarioRetorno);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário.', error: error.message });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    // Adicionar filtros por query params se necessário (ex: /usuarios?ativo=true&tipo=colaborador)
    const { ativo, tipo_usuario, nome } = req.query;
    const whereClause = {};
    if (ativo !== undefined) whereClause.ativo = ativo === 'true';
    if (tipo_usuario) whereClause.tipo_usuario = tipo_usuario;
    if (nome) whereClause.nome = { [Op.iLike]: `%${nome}%` };


    const usuarios = await Usuario.findAll({
      where: whereClause,
      attributes: { exclude: ['senha_hash'] },
      order: [['nome', 'ASC']],
    });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar usuários.', error: error.message });
  }
};

exports.obterUsuario = async (req, res) => {
  try {
    const usuario = await findUsuarioById(req.params.id);
    res.status(200).json(usuario);
  } catch (error) {
    if (error.message === 'Usuário não encontrado') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao obter usuário.', error: error.message });
  }
};

exports.atualizarUsuario = async (req, res) => {
  try {
    const usuario = await findUsuarioById(req.params.id); // Garante que o usuário existe
    const { nome, email, tipo_usuario, cargo, data_admissao, telefone, ativo, senha } = req.body;

    // Validação de email único se estiver sendo alterado
    if (email && email !== usuario.email) {
      const emailExistente = await Usuario.findOne({ where: { email } });
      if (emailExistente) {
        return res.status(400).json({ message: 'Novo email já cadastrado por outro usuário.' });
      }
    }

    const dadosAtualizar = { nome, email, tipo_usuario, cargo, data_admissao, telefone, ativo };

    // Remove campos undefined para não sobrescrever com null
    Object.keys(dadosAtualizar).forEach(key => dadosAtualizar[key] === undefined && delete dadosAtualizar[key]);

    if (senha) {
      dadosAtualizar.senha_hash = await bcrypt.hash(senha, 10);
    }

    const [numLinhasAfetadas] = await Usuario.update(dadosAtualizar, { where: { id: req.params.id } });

    if (numLinhasAfetadas > 0) {
        const usuarioAtualizado = await findUsuarioById(req.params.id);
        res.status(200).json(usuarioAtualizado);
    } else {
        // Isso pode acontecer se os dados enviados forem iguais aos existentes
        // ou se o usuário não for encontrado (já tratado pelo findUsuarioById no início)
        res.status(200).json(usuario); // Retorna o usuário original se nada mudou
    }

  } catch (error) {
    if (error.message === 'Usuário não encontrado') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao atualizar usuário.', error: error.message });
  }
};

exports.deletarUsuario = async (req, res) => {
  try {
    const usuario = await findUsuarioById(req.params.id); // Garante que o usuário existe

    // Opção 1: Deleção lógica (recomendado para manter histórico)
    await Usuario.update({ ativo: false }, { where: { id: req.params.id } });
    // res.status(200).json({ message: 'Usuário desativado com sucesso.' });
    // Se desativar, retornar o usuário atualizado:
    const usuarioDesativado = await Usuario.findByPk(req.params.id, { attributes: { exclude: ['senha_hash'] }});
    return res.status(200).json({ message: 'Usuário desativado com sucesso.', usuario: usuarioDesativado });


    // Opção 2: Deleção física (cuidado com integridade referencial e perda de histórico)
    // await Usuario.destroy({ where: { id: req.params.id } });
    // res.status(204).send(); // No content
  } catch (error) {
    if (error.message === 'Usuário não encontrado') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao deletar/desativar usuário.', error: error.message });
  }
};


// --- Gerenciamento de Lojas ---
exports.criarLoja = async (req, res) => {
  try {
    const { nome, endereco, cidade, estado, cep, telefone, email_contato, horario_funcionamento } = req.body;
    if (!nome) {
        return res.status(400).json({ message: 'Nome da loja é obrigatório.' });
    }
    const novaLoja = await Loja.create({ nome, endereco, cidade, estado, cep, telefone, email_contato, horario_funcionamento });
    res.status(201).json(novaLoja);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar loja.', error: error.message });
  }
};

exports.listarLojas = async (req, res) => {
  try {
    // Adicionar filtros por query params se necessário (ex: /lojas?cidade=Curitiba)
    const { cidade, estado, nome } = req.query;
    const whereClause = {};
    if (cidade) whereClause.cidade = { [Op.iLike]: `%${cidade}%` };
    if (estado) whereClause.estado = { [Op.iLike]: `%${estado}%` };
    if (nome) whereClause.nome = { [Op.iLike]: `%${nome}%` };

    const lojas = await Loja.findAll({
        where: whereClause,
        order: [['nome', 'ASC']]
    });
    res.status(200).json(lojas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar lojas.', error: error.message });
  }
};

exports.obterLoja = async (req, res) => {
  try {
    const loja = await findLojaById(req.params.id);
    res.status(200).json(loja);
  } catch (error) {
    if (error.message === 'Loja não encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao obter loja.', error: error.message });
  }
};

exports.atualizarLoja = async (req, res) => {
  try {
    const loja = await findLojaById(req.params.id); // Garante que a loja existe
    const { nome, endereco, cidade, estado, cep, telefone, email_contato, horario_funcionamento } = req.body;

    // Não permitir que nome seja nulo se enviado explicitamente
    if (nome === null || nome === '') return res.status(400).json({ message: "Nome da loja não pode ser vazio."});

    const [numLinhasAfetadas] = await Loja.update(
        { nome, endereco, cidade, estado, cep, telefone, email_contato, horario_funcionamento },
        { where: { id: req.params.id } }
    );

    if (numLinhasAfetadas > 0) {
        const lojaAtualizada = await findLojaById(req.params.id);
        res.status(200).json(lojaAtualizada);
    } else {
        res.status(200).json(loja); // Retorna a loja original se nada mudou
    }
  } catch (error) {
    if (error.message === 'Loja não encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao atualizar loja.', error: error.message });
  }
};

exports.deletarLoja = async (req, res) => {
  try {
    await findLojaById(req.params.id); // Garante que a loja existe

    // Verificar se a loja está sendo usada em alguma escala antes de deletar
    const escalasComEstaLoja = await Escala.count({ where: { loja_id: req.params.id }});
    if (escalasComEstaLoja > 0) {
        return res.status(400).json({ message: `Não é possível deletar a loja pois ela está associada a ${escalasComEstaLoja} escala(s). Considere desassociá-la das escalas primeiro ou desativar a loja.` });
    }

    await Loja.destroy({ where: { id: req.params.id } });
    res.status(204).send(); // No content
  } catch (error) {
    if (error.message === 'Loja não encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao deletar loja.', error: error.message });
  }
};


// --- Gerenciamento de Escalas ---
exports.criarEscala = async (req, res) => {
  try {
    const { usuario_id, loja_id, data_turno, hora_inicio, hora_fim, descricao } = req.body;
    if (!usuario_id || !data_turno || !hora_inicio || !hora_fim) {
        return res.status(400).json({ message: 'Usuário, data do turno, hora de início e hora de fim são obrigatórios.' });
    }
    // Validar se usuário e loja existem
    await findUsuarioById(usuario_id);
    if (loja_id) await findLojaById(loja_id);

    const novaEscala = await Escala.create({ usuario_id, loja_id, data_turno, hora_inicio, hora_fim, descricao });
    res.status(201).json(novaEscala);
  } catch (error) {
    if (error.message === 'Usuário não encontrado' || error.message === 'Loja não encontrada') {
        return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao criar escala.', error: error.message });
  }
};

exports.listarEscalas = async (req, res) => {
  try {
    // Filtros: usuario_id, loja_id, data_inicio, data_fim (para período)
    const { usuario_id, loja_id, data_inicio, data_fim } = req.query;
    const whereClause = {};
    if (usuario_id) whereClause.usuario_id = usuario_id;
    if (loja_id) whereClause.loja_id = loja_id;
    if (data_inicio && data_fim) {
        whereClause.data_turno = { [Op.between]: [data_inicio, data_fim] };
    } else if (data_inicio) {
        whereClause.data_turno = { [Op.gte]: data_inicio };
    } else if (data_fim) {
        whereClause.data_turno = { [Op.lte]: data_fim };
    }

    const escalas = await Escala.findAll({
      where: whereClause,
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        { model: Loja, as: 'loja', attributes: ['id', 'nome'] }
      ],
      order: [['data_turno', 'ASC'], ['hora_inicio', 'ASC']],
    });
    res.status(200).json(escalas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar escalas.', error: error.message });
  }
};

exports.obterEscala = async (req, res) => {
  try {
    const escala = await Escala.findByPk(req.params.id, {
        include: [
            { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
            { model: Loja, as: 'loja', attributes: ['id', 'nome'] }
        ]
    });
    if (!escala) throw new Error('Escala não encontrada');
    res.status(200).json(escala);
  } catch (error) {
    if (error.message === 'Escala não encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao obter escala.', error: error.message });
  }
};

exports.atualizarEscala = async (req, res) => {
  try {
    const escala = await findEscalaById(req.params.id);
    const { usuario_id, loja_id, data_turno, hora_inicio, hora_fim, descricao } = req.body;

    if (usuario_id) await findUsuarioById(usuario_id);
    if (loja_id) await findLojaById(loja_id);

    const dadosAtualizar = { usuario_id, loja_id, data_turno, hora_inicio, hora_fim, descricao };
    Object.keys(dadosAtualizar).forEach(key => dadosAtualizar[key] === undefined && delete dadosAtualizar[key]);


    const [numLinhasAfetadas] = await Escala.update(dadosAtualizar, { where: { id: req.params.id } });

    if (numLinhasAfetadas > 0) {
        const escalaAtualizada = await Escala.findByPk(req.params.id, { include: ['usuario', 'loja']});
        res.status(200).json(escalaAtualizada);
    } else {
        res.status(200).json(escala);
    }
  } catch (error) {
    if (error.message === 'Escala não encontrada' || error.message === 'Usuário não encontrado' || error.message === 'Loja não encontrada') {
        return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao atualizar escala.', error: error.message });
  }
};

exports.deletarEscala = async (req, res) => {
  try {
    await findEscalaById(req.params.id);
    await Escala.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Escala não encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao deletar escala.', error: error.message });
  }
};


// --- Gerenciamento de Avisos ---
exports.criarAviso = async (req, res) => {
  try {
    const { titulo, conteudo, data_validade, tipo } = req.body;
    const publicado_por_id = req.user.id; // Admin logado
    if (!titulo || !conteudo) {
        return res.status(400).json({ message: 'Título e conteúdo do aviso são obrigatórios.' });
    }
    const novoAviso = await Aviso.create({ titulo, conteudo, publicado_por_id, data_validade, tipo });
    res.status(201).json(novoAviso);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar aviso.', error: error.message });
  }
};

exports.listarAvisos = async (req, res) => {
  try {
    // Filtro opcional por validade (ex: /avisos?validos=true)
    const { validos } = req.query;
    const whereClause = {};
    if (validos === 'true') {
        const hoje = new Date().toISOString().split('T')[0];
        whereClause[Op.or] = [
            { data_validade: null },
            { data_validade: { [Op.gte]: hoje } }
        ];
    }

    const avisos = await Aviso.findAll({
        where: whereClause,
        include: [{model: Usuario, as: 'publicador', attributes: ['id', 'nome']}],
        order: [['data_criacao', 'DESC']] // data_criacao é a data_publicacao
    });
    res.status(200).json(avisos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar avisos.', error: error.message });
  }
};

exports.obterAviso = async (req, res) => {
  try {
    const aviso = await Aviso.findByPk(req.params.id, {
        include: [{model: Usuario, as: 'publicador', attributes: ['id', 'nome']}]
    });
    if (!aviso) throw new Error('Aviso não encontrado');
    res.status(200).json(aviso);
  } catch (error) {
    if (error.message === 'Aviso não encontrado') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao obter aviso.', error: error.message });
  }
};

exports.atualizarAviso = async (req, res) => {
  try {
    const aviso = await findAvisoById(req.params.id);
    const { titulo, conteudo, data_validade, tipo } = req.body;

    const dadosAtualizar = { titulo, conteudo, data_validade, tipo };
    Object.keys(dadosAtualizar).forEach(key => dadosAtualizar[key] === undefined && delete dadosAtualizar[key]);


    const [numLinhasAfetadas] = await Aviso.update(dadosAtualizar, { where: { id: req.params.id } });

    if (numLinhasAfetadas > 0) {
        const avisoAtualizado = await Aviso.findByPk(req.params.id, {include: ['publicador']});
        res.status(200).json(avisoAtualizado);
    } else {
        res.status(200).json(aviso);
    }
  } catch (error) {
    if (error.message === 'Aviso não encontrado') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao atualizar aviso.', error: error.message });
  }
};

exports.deletarAviso = async (req, res) => {
  try {
    await findAvisoById(req.params.id);
    await Aviso.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Aviso não encontrado') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao deletar aviso.', error: error.message });
  }
};

// --- Gerenciamento de Férias ---
exports.registrarFerias = async (req, res) => {
  try {
    const { usuario_id, data_inicio, data_fim, status, observacoes } = req.body;
    const aprovada_por_id = (status === 'aprovada' || status === 'rejeitada') ? req.user.id : null;
    const data_aprovacao = (status === 'aprovada' || status === 'rejeitada') ? new Date() : null;

    if (!usuario_id || !data_inicio || !data_fim) {
        return res.status(400).json({ message: 'Usuário, data de início e data de fim das férias são obrigatórios.' });
    }
    await findUsuarioById(usuario_id); // Valida se usuário existe

    const novasFerias = await Ferias.create({
      usuario_id,
      data_inicio,
      data_fim,
      status: status || 'solicitada', // Admin pode já aprovar/rejeitar ao criar
      observacoes,
      aprovada_por_id,
      data_aprovacao
    });
    res.status(201).json(novasFerias);
  } catch (error) {
    if (error.message === 'Usuário não encontrado') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao registrar férias.', error: error.message });
  }
};

exports.listarFerias = async (req, res) => {
  try {
    // Filtros: usuario_id, status, data_inicio_periodo, data_fim_periodo
    const { usuario_id, status, data_inicio_periodo, data_fim_periodo } = req.query;
    const whereClause = {};
    if (usuario_id) whereClause.usuario_id = usuario_id;
    if (status) whereClause.status = status;
    if (data_inicio_periodo && data_fim_periodo) {
        // Lógica para encontrar férias que interceptam o período
        whereClause[Op.or] = [
            { data_inicio: { [Op.between]: [data_inicio_periodo, data_fim_periodo] } },
            { data_fim: { [Op.between]: [data_inicio_periodo, data_fim_periodo] } },
            {
                [Op.and]: [
                    { data_inicio: { [Op.lte]: data_inicio_periodo } },
                    { data_fim: { [Op.gte]: data_fim_periodo } }
                ]
            }
        ];
    }

    const feriasList = await Ferias.findAll({
      where: whereClause,
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        { model: Usuario, as: 'aprovador', attributes: ['id', 'nome'] }
      ],
      order: [['data_inicio', 'DESC']],
    });
    res.status(200).json(feriasList);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar férias.', error: error.message });
  }
};

exports.obterFerias = async (req, res) => {
  try {
    const ferias = await Ferias.findByPk(req.params.id, {
        include: [
            { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
            { model: Usuario, as: 'aprovador', attributes: ['id', 'nome'] }
        ]
    });
    if (!ferias) throw new Error('Registro de férias não encontrado');
    res.status(200).json(ferias);
  } catch (error) {
    if (error.message === 'Registro de férias não encontrado') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao obter registro de férias.', error: error.message });
  }
};

exports.atualizarFerias = async (req, res) => {
  try {
    const ferias = await findFeriasById(req.params.id);
    const { usuario_id, data_inicio, data_fim, status, observacoes } = req.body;

    if (usuario_id) await findUsuarioById(usuario_id);

    const dadosAtualizar = { usuario_id, data_inicio, data_fim, status, observacoes };
    // Se o status está sendo atualizado para aprovado/rejeitado, registrar quem e quando
    if (status && (status === 'aprovada' || status === 'rejeitada') && ferias.status !== status) {
        dadosAtualizar.aprovada_por_id = req.user.id;
        dadosAtualizar.data_aprovacao = new Date();
    } else if (status && status === 'solicitada') { // Se voltou para solicitada, limpar aprovador
        dadosAtualizar.aprovada_por_id = null;
        dadosAtualizar.data_aprovacao = null;
    }

    Object.keys(dadosAtualizar).forEach(key => dadosAtualizar[key] === undefined && delete dadosAtualizar[key]);

    const [numLinhasAfetadas] = await Ferias.update(dadosAtualizar, { where: { id: req.params.id } });

    if (numLinhasAfetadas > 0) {
        const feriasAtualizadas = await Ferias.findByPk(req.params.id, {include: ['usuario', 'aprovador']});
        res.status(200).json(feriasAtualizadas);
    } else {
        res.status(200).json(ferias);
    }
  } catch (error) {
    if (error.message === 'Registro de férias não encontrado' || error.message === 'Usuário não encontrado') {
        return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao atualizar registro de férias.', error: error.message });
  }
};

exports.atualizarStatusFerias = async (req, res) => {
  try {
    const ferias = await findFeriasById(req.params.id);
    const { status, observacoes } = req.body; // Admin pode adicionar observação ao mudar status

    if (!status || !['aprovada', 'rejeitada', 'solicitada', 'concluida'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido fornecido.' });
    }

    const dadosAtualizar = {
        status,
        aprovada_por_id: req.user.id,
        data_aprovacao: new Date(),
        observacoes: observacoes !== undefined ? observacoes : ferias.observacoes // Mantém observações anteriores se não for fornecida nova
    };

    if (status === 'solicitada') { // Se voltou para solicitada, limpar aprovador
        dadosAtualizar.aprovada_por_id = null;
        dadosAtualizar.data_aprovacao = null;
    }


    const [numLinhasAfetadas] = await Ferias.update(dadosAtualizar, { where: { id: req.params.id } });

    if (numLinhasAfetadas > 0) {
        const feriasAtualizadas = await Ferias.findByPk(req.params.id, {include: ['usuario', 'aprovador']});
        res.status(200).json(feriasAtualizadas);
    } else {
        // Se o status já era o mesmo, pode não haver linhas afetadas
        res.status(200).json(ferias);
    }
  } catch (error) {
    if (error.message === 'Registro de férias não encontrado') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao atualizar status das férias.', error: error.message });
  }
};

exports.deletarFerias = async (req, res) => {
  try {
    await findFeriasById(req.params.id);
    await Ferias.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Registro de férias não encontrado') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Erro ao deletar registro de férias.', error: error.message });
  }
};

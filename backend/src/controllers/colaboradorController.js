const { Escala, Aviso, Ferias, Loja, Usuario } = require('../models');
const { Op } = require('sequelize');

// GET /api/colaborador/escalas - Visualizar escala individual do usuário logado
async function getMinhasEscalas(req, res) {
  try {
    const usuarioId = req.user.id; // ID do usuário logado, vindo do token JWT

    // Busca escalas futuras ou recentes (ex: do último mês até o futuro)
    const umMesAtras = new Date();
    umMesAtras.setMonth(umMesAtras.getMonth() - 1);

    const escalas = await Escala.findAll({
      where: {
        usuario_id: usuarioId,
        data_turno: {
          [Op.gte]: umMesAtras // Operador 'greater than or equal to'
        }
      },
      include: [
        { model: Loja, as: 'loja', attributes: ['id', 'nome'] } // Inclui informações da loja
      ],
      order: [['data_turno', 'ASC'], ['hora_inicio', 'ASC']],
    });

    if (!escalas || escalas.length === 0) {
      return res.status(200).json({ message: 'Nenhuma escala encontrada para este usuário.', escalas: [] });
    }

    res.status(200).json(escalas);
  } catch (error) {
    console.error('Erro ao buscar escalas do colaborador:', error);
    res.status(500).json({ message: 'Erro ao buscar escalas.', error: error.message });
  }
}

// GET /api/colaborador/avisos - Visualizar avisos gerais e válidos
async function getAvisos(req, res) {
  try {
    const hoje = new Date();
    const avisos = await Aviso.findAll({
      where: {
        // Ou data_validade é nula (sempre válido) OU data_validade é maior ou igual a hoje
        [Op.or]: [
          { data_validade: null },
          { data_validade: { [Op.gte]: hoje.toISOString().split('T')[0] } } // Formato YYYY-MM-DD
        ]
      },
      include: [
        { model: Usuario, as: 'publicador', attributes: ['id', 'nome'] }
      ],
      order: [['data_criacao', 'DESC']], // Mais recentes primeiro (data_criacao é a data_publicacao)
    });

    if (!avisos || avisos.length === 0) {
      return res.status(200).json({ message: 'Nenhum aviso encontrado.', avisos: [] });
    }
    res.status(200).json(avisos);
  } catch (error) {
    console.error('Erro ao buscar avisos:', error);
    res.status(500).json({ message: 'Erro ao buscar avisos.', error: error.message });
  }
}

// GET /api/colaborador/ferias - Consultar seus períodos de férias
async function getMinhasFerias(req, res) {
  try {
    const usuarioId = req.user.id;
    const ferias = await Ferias.findAll({
      where: { usuario_id: usuarioId },
      order: [['data_inicio', 'DESC']], // Mais recentes primeiro
    });

    if (!ferias || ferias.length === 0) {
      return res.status(200).json({ message: 'Nenhum período de férias encontrado.', ferias: [] });
    }
    res.status(200).json(ferias);
  } catch (error) {
    console.error('Erro ao buscar férias do colaborador:', error);
    res.status(500).json({ message: 'Erro ao buscar férias.', error: error.message });
  }
}

// GET /api/colaborador/lojas - Listar todas as lojas (informações básicas)
async function getLojas(req, res) {
  try {
    const lojas = await Loja.findAll({
      attributes: ['id', 'nome', 'cidade', 'estado', 'telefone', 'horario_funcionamento'], // Apenas dados básicos
      order: [['nome', 'ASC']],
    });

    if (!lojas || lojas.length === 0) {
        return res.status(200).json({ message: 'Nenhuma loja cadastrada.', lojas: [] });
    }
    res.status(200).json(lojas);
  } catch (error) {
    console.error('Erro ao buscar lojas:', error);
    res.status(500).json({ message: 'Erro ao buscar lojas.', error: error.message });
  }
}

module.exports = {
  getMinhasEscalas,
  getAvisos,
  getMinhasFerias,
  getLojas,
};

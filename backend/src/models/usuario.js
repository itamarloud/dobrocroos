'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.hasMany(models.Escala, {
        foreignKey: 'usuario_id',
        as: 'escalas',
      });
      Usuario.hasMany(models.Ferias, {
        foreignKey: 'usuario_id',
        as: 'ferias',
      });
      Usuario.hasMany(models.Aviso, {
        foreignKey: 'publicado_por_id',
        as: 'avisosPublicados',
      });
    }
  }
  Usuario.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'colaborador', // 'colaborador', 'administrador'
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data_admissao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // data_criacao e data_atualizacao são gerenciados pelo Sequelize (timestamps: true)
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios', // Nome da tabela no banco
    timestamps: true, // Habilita createdAt e updatedAt
    createdAt: 'data_criacao', // Mapeia createdAt para data_criacao
    updatedAt: 'data_atualizacao', // Mapeia updatedAt para data_atualizacao
  });
  return Usuario;
};

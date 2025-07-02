'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Loja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Loja.hasMany(models.Escala, {
        foreignKey: 'loja_id',
        as: 'escalas',
      });
    }
  }
  Loja.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endereco: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_contato: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    horario_funcionamento: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // data_criacao e data_atualizacao são gerenciados pelo Sequelize (timestamps: true)
  }, {
    sequelize,
    modelName: 'Loja',
    tableName: 'lojas',
    timestamps: true,
    createdAt: 'data_criacao',
    updatedAt: 'data_atualizacao',
  });
  return Loja;
};

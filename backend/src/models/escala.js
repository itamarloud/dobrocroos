'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Escala extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Escala.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
        onDelete: 'CASCADE',
      });
      Escala.belongsTo(models.Loja, {
        foreignKey: 'loja_id',
        as: 'loja',
        onDelete: 'SET NULL',
      });
    }
  }
  Escala.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios', // Nome da tabela referenciada
        key: 'id',
      },
    },
    loja_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Pode não estar atrelado a uma loja específica
      references: {
        model: 'lojas', // Nome da tabela referenciada
        key: 'id',
      },
    },
    data_turno: {
      type: DataTypes.DATEONLY, // Apenas data, sem hora
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.TIME, // Apenas hora
      allowNull: false,
    },
    hora_fim: {
      type: DataTypes.TIME, // Apenas hora
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // data_criacao e data_atualizacao
  }, {
    sequelize,
    modelName: 'Escala',
    tableName: 'escalas',
    timestamps: true,
    createdAt: 'data_criacao',
    updatedAt: 'data_atualizacao',
    // Adicionando índice único programaticamente se necessário, ou na migração
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ['usuario_id', 'data_turno', 'hora_inicio']
    //   }
    // ]
  });
  return Escala;
};

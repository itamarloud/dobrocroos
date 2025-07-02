'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Aviso extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Aviso.belongsTo(models.Usuario, {
        foreignKey: 'publicado_por_id',
        as: 'publicador', // Quem publicou (um admin)
        onDelete: 'SET NULL',
      });
    }
  }
  Aviso.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // data_publicacao é o próprio createdAt (data_criacao)
    publicado_por_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Pode ser nulo se o publicador for deletado
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    data_validade: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    tipo: {
      type: DataTypes.STRING, // 'geral', 'urgente', 'informativo'
      defaultValue: 'geral',
    },
    // data_criacao (será o data_publicacao) e data_atualizacao
  }, {
    sequelize,
    modelName: 'Aviso',
    tableName: 'avisos',
    timestamps: true,
    createdAt: 'data_criacao', // Usaremos data_criacao como data_publicacao
    updatedAt: 'data_atualizacao',
  });
  return Aviso;
};

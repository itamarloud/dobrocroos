'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ferias extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ferias.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
        onDelete: 'CASCADE',
      });
      Ferias.belongsTo(models.Usuario, {
        foreignKey: 'aprovada_por_id',
        as: 'aprovador', // Quem aprovou (um admin)
        onDelete: 'SET NULL',
      });
    }
  }
  Ferias.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    data_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    data_fim: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING, // 'solicitada', 'aprovada', 'rejeitada', 'concluida'
      defaultValue: 'solicitada',
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    solicitada_em: { // Este campo pode ser o próprio createdAt (data_criacao)
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Gerenciado pelo Sequelize como data_criacao
    },
    aprovada_por_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    data_aprovacao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // data_criacao (será solicitada_em) e data_atualizacao
  }, {
    sequelize,
    modelName: 'Ferias',
    tableName: 'ferias',
    timestamps: true,
    createdAt: 'data_criacao', // Usaremos data_criacao como solicitada_em
    updatedAt: 'data_atualizacao',
    // Adicionando índice único programaticamente se necessário, ou na migração
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ['usuario_id', 'data_inicio']
    //   }
    // ]
  });
  return Ferias;
};

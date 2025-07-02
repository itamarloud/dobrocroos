'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ferias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios', // Nome da tabela referenciada
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      data_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      data_fim: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'solicitada'
      },
      observacoes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // solicitada_em será o data_criacao
      aprovada_por_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios', // Nome da tabela referenciada
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      data_aprovacao: {
        type: Sequelize.DATE,
        allowNull: true
      },
      data_criacao: { // Servirá como solicitada_em
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      data_atualizacao: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Adicionando índice único conforme definido no schema.sql
    await queryInterface.addIndex('ferias', ['usuario_id', 'data_inicio'], {
      unique: true,
      name: 'idx_ferias_usuario_data_inicio_unique'
    });

    // Índice para otimizar consultas (já referenciado no schema.sql)
    await queryInterface.addIndex('ferias', ['usuario_id', 'data_inicio', 'data_fim'], {
      name: 'idx_ferias_usuario_datas'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('ferias', 'idx_ferias_usuario_data_inicio_unique');
    await queryInterface.removeIndex('ferias', 'idx_ferias_usuario_datas');
    await queryInterface.dropTable('ferias');
  }
};

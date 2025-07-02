'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('escalas', {
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
      loja_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'lojas', // Nome da tabela referenciada
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      data_turno: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      hora_inicio: {
        type: Sequelize.TIME,
        allowNull: false
      },
      hora_fim: {
        type: Sequelize.TIME,
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      data_criacao: {
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
    await queryInterface.addIndex('escalas', ['usuario_id', 'data_turno', 'hora_inicio'], {
      unique: true,
      name: 'idx_escalas_usuario_data_hora_inicio_unique'
    });

    // Índices para otimizar consultas (já referenciado no schema.sql)
    await queryInterface.addIndex('escalas', ['usuario_id', 'data_turno'], {
      name: 'idx_escalas_usuario_data'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('escalas', 'idx_escalas_usuario_data_hora_inicio_unique');
    await queryInterface.removeIndex('escalas', 'idx_escalas_usuario_data');
    await queryInterface.dropTable('escalas');
  }
};

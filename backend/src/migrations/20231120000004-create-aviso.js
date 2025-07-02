'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('avisos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      conteudo: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      publicado_por_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios', // Nome da tabela referenciada
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      data_validade: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      tipo: {
        type: Sequelize.STRING,
        defaultValue: 'geral'
      },
      data_criacao: { // Servirá como data_publicacao
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

    // Índice para otimizar consultas por data de publicação (data_criacao)
    await queryInterface.addIndex('avisos', ['data_criacao'], {
      name: 'idx_avisos_data_publicacao',
      order: 'DESC' // Se desejar ordenar por mais recente primeiro
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('avisos', 'idx_avisos_data_publicacao');
    await queryInterface.dropTable('avisos');
  }
};

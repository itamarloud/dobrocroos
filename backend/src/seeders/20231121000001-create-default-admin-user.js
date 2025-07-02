'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const emailAdmin = 'itamar@gmail.com';
    const senhaAdmin = 'Ita123456'; // Lembre-se que esta senha será hasheada

    // Verifica se o usuário já existe para evitar duplicidade ao rodar o seeder múltiplas vezes
    const usuarioExistente = await queryInterface.rawSelect('usuarios', {
      where: {
        email: emailAdmin,
      },
    }, ['id']);

    if (usuarioExistente) {
      console.log(`Usuário administrador ${emailAdmin} já existe. Seeder não será executado.`);
      return;
    }

    const senhaHash = await bcrypt.hash(senhaAdmin, 10);

    await queryInterface.bulkInsert('usuarios', [{
      nome: 'Itamar Admin',
      email: emailAdmin,
      senha_hash: senhaHash,
      tipo_usuario: 'administrador',
      cargo: 'Administrador do Sistema',
      ativo: true,
      data_admissao: new Date(), // Pode ser ajustado ou deixado nulo se preferir
      telefone: null, // Pode ser preenchido se desejado
      data_criacao: new Date(),
      data_atualizacao: new Date()
    }], {});

    console.log(`Usuário administrador ${emailAdmin} criado com sucesso.`);
  },

  async down (queryInterface, Sequelize) {
    // Este comando removerá o usuário se o seeder for revertido
    const emailAdmin = 'itamar@gmail.com';
    await queryInterface.bulkDelete('usuarios', { email: emailAdmin }, {});
    console.log(`Usuário administrador ${emailAdmin} removido (seeder revertido).`);
  }
};

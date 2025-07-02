const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas de Teste
app.get('/', (req, res) => {
  res.send('API do Sistema de Gerenciamento de Escalas está rodando!');
});

// Rotas da Aplicação
const authRoutes = require('./routes/authRoutes');
const colaboradorRoutes = require('./routes/colaboradorRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/colaborador', colaboradorRoutes);
app.use('/api/admin', adminRoutes); // Novas rotas de admin adicionadas

// Middleware de tratamento de erros global (opcional, mas bom para capturar erros não tratados)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});

module.exports = app;

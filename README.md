# Projeto de Gerenciamento de Escalas e Comunicação Interna

Este projeto visa criar um sistema completo para visualização de escalas de trabalho, comunicados, férias e informações de lojas, com áreas distintas para colaboradores e administradores.

## Tecnologias

*   **Frontend:** React.js (com Vite)
*   **Backend:** Node.js com Express.js
*   **Banco de Dados:** PostgreSQL
*   **Autenticação:** JWT

## Estrutura do Projeto

```
 raiz-do-projeto/
 |-- backend/        # Código do servidor backend
 |-- frontend/       # Código da aplicação frontend
 |-- database/       # Scripts e configurações do banco de dados
 `-- README.md
```

## Como Iniciar (Desenvolvimento)

**Pré-requisitos:**
*   Node.js (v18+)
*   npm ou yarn
*   PostgreSQL

**Backend:**
```bash
cd backend
npm install
# Configurar .env (ver .env.example)
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
# Configurar .env (ver .env.example)
npm run dev
```

**Banco de Dados:**
*   Certifique-se de que o PostgreSQL está rodando.
*   Crie um banco de dados para a aplicação.
*   Execute os scripts em `database/schema.sql` e as migrações em `database/migrations/`.
```

Em seguida, criarei os arquivos e diretórios para o backend.

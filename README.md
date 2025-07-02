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
*   Crie um banco de dados para a aplicação (ex: `escala_facil_db`).
*   Configure as variáveis de ambiente no arquivo `.env` do backend (copie de `.env.example` e ajuste `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
*   Rode as migrações para criar as tabelas:
    ```bash
    cd backend
    npx sequelize-cli db:migrate
    ```
*   (Opcional, mas recomendado para o primeiro setup) Rode os seeders para popular dados iniciais (incluindo o usuário administrador padrão):
    ```bash
    npx sequelize-cli db:seed:all
    ```
    O usuário administrador padrão é:
    - Email: `itamar@gmail.com`
    - Senha: `Ita123456`
```

Em seguida, criarei os arquivos e diretórios para o backend.

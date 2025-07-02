-- Arquivo: database/schema.sql

-- Extensões (se necessário, como para UUIDs)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuários (Colaboradores e Administradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL DEFAULT 'colaborador', -- 'colaborador', 'administrador'
    cargo VARCHAR(100),
    data_admissao DATE,
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Lojas
CREATE TABLE IF NOT EXISTS lojas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(10),
    telefone VARCHAR(20),
    email_contato VARCHAR(255),
    horario_funcionamento TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Escalas de Trabalho
-- Uma escala pode pertencer a um usuário (colaborador) e opcionalmente a uma loja
CREATE TABLE IF NOT EXISTS escalas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    loja_id INTEGER REFERENCES lojas(id) ON DELETE SET NULL, -- A escala pode não estar atrelada a uma loja específica inicialmente
    data_turno DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    descricao TEXT, -- Ex: "Turno da manhã", "Plantão", etc.
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, data_turno, hora_inicio) -- Evita duplicidade de turno para o mesmo usuário no mesmo horário
);

-- Tabela de Avisos e Comunicados
CREATE TABLE IF NOT EXISTS avisos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    data_publicacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    publicado_por_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL, -- Quem publicou (um admin)
    data_validade DATE, -- Opcional: até quando o aviso é válido
    tipo VARCHAR(50) DEFAULT 'geral', -- 'geral', 'urgente', 'informativo'
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Períodos de Férias
CREATE TABLE IF NOT EXISTS ferias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'solicitada', -- 'solicitada', 'aprovada', 'rejeitada', 'concluida'
    observacoes TEXT,
    solicitada_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    aprovada_por_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL, -- Quem aprovou (um admin)
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, data_inicio) -- Um usuário não pode ter duas férias iniciando no mesmo dia
);

-- Tabela de Permissões (para controle de acesso mais granular, se necessário)
-- Poderia ser simplificado usando apenas o `tipo_usuario` na tabela `usuarios` inicialmente.
-- Esta tabela é mais para um sistema RBAC (Role-Based Access Control) mais complexo.
-- CREATE TABLE IF NOT EXISTS permissoes (
--     id SERIAL PRIMARY KEY,
--     nome_permissao VARCHAR(100) UNIQUE NOT NULL, -- Ex: 'gerenciar_usuarios', 'ver_escalas_globais'
--     descricao TEXT
-- );

-- Tabela de Junção Usuario-Permissao (se a tabela permissoes for usada)
-- CREATE TABLE IF NOT EXISTS usuario_permissoes (
--     usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
--     permissao_id INTEGER NOT NULL REFERENCES permissoes(id) ON DELETE CASCADE,
--     PRIMARY KEY (usuario_id, permissao_id)
-- );


-- Índices para otimizar consultas comuns
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_escalas_usuario_data ON escalas(usuario_id, data_turno);
CREATE INDEX IF NOT EXISTS idx_ferias_usuario_datas ON ferias(usuario_id, data_inicio, data_fim);
CREATE INDEX IF NOT EXISTS idx_avisos_data_publicacao ON avisos(data_publicacao DESC);

-- Função para atualizar `data_atualizacao` automaticamente
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar `data_atualizacao`
CREATE TRIGGER set_timestamp_usuarios
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_lojas
BEFORE UPDATE ON lojas
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_escalas
BEFORE UPDATE ON escalas
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_avisos
BEFORE UPDATE ON avisos
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_ferias
BEFORE UPDATE ON ferias
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Seed data inicial pode ser adicionado aqui ou em arquivos separados em `database/seeds/`

-- Exemplo de usuário administrador inicial (a senha deve ser hash no backend antes de inserir)
-- INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, cargo, data_admissao, ativo)
-- VALUES ('Admin Padrão', 'admin@example.com', 'hash_da_senha_aqui', 'administrador', 'Administrador do Sistema', '2023-01-01', TRUE)
-- ON CONFLICT (email) DO NOTHING;

-- Exemplo de loja inicial
-- INSERT INTO lojas (nome, endereco, cidade, estado, cep, telefone, email_contato, horario_funcionamento)
-- VALUES ('Loja Matriz', 'Rua Principal, 123', 'Cidade Exemplo', 'EX', '12345-678', '(11) 99999-8888', 'contato@lojametriz.com', 'Seg-Sex: 09h-18h, Sab: 09h-13h')
-- ON CONFLICT DO NOTHING;

-- PRINT 'Schema do banco de dados criado com sucesso.';
-- PRINT 'Lembre-se de criar um usuário administrador e popular dados iniciais se necessário.';

-- Para usar com Sequelize (backend Node.js), as migrações e seeders do Sequelize
-- serão os responsáveis por criar e popular essas tabelas programaticamente.
-- Este arquivo `schema.sql` serve como referência e para configuração manual inicial se não usar Sequelize migrations.
-- Se usar Sequelize, o `sequelize-cli` gerará arquivos de migração para cada tabela.
-- Por exemplo, para a tabela 'usuarios': `npx sequelize-cli model:generate --name Usuario --attributes nome:string,email:string,senha_hash:string,tipo_usuario:string`
-- E então editaria o arquivo de migração gerado para corresponder a este schema.
-- Para este projeto, vamos assumir que usaremos as migrações do Sequelize.
-- Este arquivo `schema.sql` é um bom ponto de partida para definir essas migrações.Tool output for `create_file_with_block`:

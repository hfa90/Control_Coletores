-- Sistema de Controle de Coletores - Schema do Banco de Dados
-- Versão: 1.0
-- Banco: PostgreSQL

-- Criação do banco de dados (execute separadamente se necessário)
-- CREATE DATABASE sistema_coletores;

-- Conectar ao banco
\c sistema_coletores;

-- Tabela de usuários/colaboradores
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    setor VARCHAR(100),
    funcao VARCHAR(100),
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de senhas (para autenticação futura)
CREATE TABLE IF NOT EXISTS senhas (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    senha_hash TEXT NOT NULL,
    senha_salt TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_alteracao TIMESTAMP
);

-- Tabela de coletores
CREATE TABLE IF NOT EXISTS coletores (
    id VARCHAR(10) PRIMARY KEY,
    modelo VARCHAR(100) DEFAULT 'Honeywell EDA61k',
    numero_serie VARCHAR(100),
    id_usuario INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    setor VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Disponível para Uso',
    bateria INTEGER DEFAULT 100,
    tempo_uso VARCHAR(20) DEFAULT '00:00',
    problema TEXT,
    observacoes TEXT,
    turno VARCHAR(50),
    data_vigente VARCHAR(20),
    hora_registro VARCHAR(10),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de histórico de atividades
CREATE TABLE IF NOT EXISTS historico_atividades (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    acao VARCHAR(255) NOT NULL,
    detalhes TEXT,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de histórico de uso de coletores
CREATE TABLE IF NOT EXISTS historico_uso_coletores (
    id SERIAL PRIMARY KEY,
    id_coletor VARCHAR(10) REFERENCES coletores(id) ON DELETE CASCADE,
    usuario VARCHAR(255),
    setor VARCHAR(100),
    turno VARCHAR(50),
    status_anterior VARCHAR(50),
    bateria INTEGER,
    tempo_uso VARCHAR(20),
    data_inicio VARCHAR(20),
    hora_inicio VARCHAR(10),
    data_devolucao VARCHAR(20),
    hora_devolucao VARCHAR(10),
    observacoes TEXT,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de histórico por colaborador (mais detalhada)
CREATE TABLE IF NOT EXISTS historico_colaborador (
    id SERIAL PRIMARY KEY,
    id_colaborador INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    nome_colaborador VARCHAR(255),
    matricula VARCHAR(50),
    setor VARCHAR(100),
    id_coletor VARCHAR(10) REFERENCES coletores(id) ON DELETE CASCADE,
    modelo_coletor VARCHAR(100),
    turno VARCHAR(50),
    data_retirada VARCHAR(20),
    hora_retirada VARCHAR(10),
    data_devolucao VARCHAR(20),
    hora_devolucao VARCHAR(10),
    tempo_uso VARCHAR(20),
    bateria_inicial INTEGER,
    bateria_final INTEGER,
    status_coletor VARCHAR(50),
    observacoes TEXT,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de mensagens do chat (para suporte futuro)
CREATE TABLE IF NOT EXISTS chat_mensagens (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    usuario_nome VARCHAR(255),
    usuario_matricula VARCHAR(50),
    mensagem TEXT NOT NULL,
    data_hora VARCHAR(50),
    lida BOOLEAN DEFAULT FALSE,
    respondida BOOLEAN DEFAULT FALSE,
    resposta TEXT,
    data_hora_resposta VARCHAR(50),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_matricula ON usuarios(matricula);
CREATE INDEX IF NOT EXISTS idx_coletores_status ON coletores(status);
CREATE INDEX IF NOT EXISTS idx_coletores_usuario ON coletores(id_usuario);
CREATE INDEX IF NOT EXISTS idx_historico_atividades_usuario ON historico_atividades(id_usuario);
CREATE INDEX IF NOT EXISTS idx_historico_atividades_data ON historico_atividades(data_hora);
CREATE INDEX IF NOT EXISTS idx_historico_uso_coletor ON historico_uso_coletores(id_coletor);
CREATE INDEX IF NOT EXISTS idx_historico_colaborador_colaborador ON historico_colaborador(id_colaborador);
CREATE INDEX IF NOT EXISTS idx_historico_colaborador_coletor ON historico_colaborador(id_coletor);

-- Triggers para atualizar data_atualizacao
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coletores_updated_at 
    BEFORE UPDATE ON coletores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserção de dados iniciais

-- Usuário administrador especial
INSERT INTO usuarios (nome, matricula, setor, funcao, observacoes) 
VALUES 
    ('TÉCNICO TI', 'MA201990', 'TI', 'Administrador do Sistema', 'Usuário especial com permissões administrativas')
ON CONFLICT (matricula) DO NOTHING;

-- Usuários de exemplo (remova em produção)
INSERT INTO usuarios (nome, matricula, setor, funcao) 
VALUES 
    ('GABRIEL SOUSA', '338766', 'Armazenamento', 'Operador'),
    ('AMANDA SILVA', '421980', 'Armazenamento', 'Operadora'),
    ('CARLOS MENDES', '556789', 'Expedição', 'Supervisor'),
    ('MARIA SANTOS', '334455', 'Separação', 'Operadora'),
    ('JOÃO OLIVEIRA', '667788', 'Conferência', 'Operador')
ON CONFLICT (matricula) DO NOTHING;

-- Coletores de exemplo
INSERT INTO coletores (id, modelo, numero_serie, status, bateria) 
VALUES 
    ('001', 'Honeywell EDA61k', 'HW001EDA61K', 'Disponível para Uso', 100),
    ('002', 'Honeywell EDA61k', 'HW002EDA61K', 'Disponível para Uso', 95),
    ('003', 'Honeywell EDA61k', 'HW003EDA61K', 'Disponível para Uso', 88),
    ('004', 'Honeywell EDA61k', 'HW004EDA61K', 'Em manutenção', 0),
    ('005', 'Honeywell EDA61k', 'HW005EDA61K', 'Disponível para Uso', 100),
    ('006', 'Honeywell EDA61k', 'HW006EDA61K', 'Disponível para Uso', 92),
    ('007', 'Honeywell EDA61k', 'HW007EDA61K', 'Disponível para Uso', 85),
    ('008', 'Honeywell EDA61k', 'HW008EDA61K', 'Disponível para Uso', 90),
    ('009', 'Honeywell EDA61k', 'HW009EDA61K', 'Com problema', 45),
    ('010', 'Honeywell EDA61k', 'HW010EDA61K', 'Disponível para Uso', 100)
ON CONFLICT (id) DO NOTHING;

-- Criar views úteis para relatórios
CREATE OR REPLACE VIEW view_coletores_uso AS
SELECT 
    c.id,
    c.modelo,
    c.status,
    c.bateria,
    c.tempo_uso,
    u.nome as usuario_nome,
    u.matricula as usuario_matricula,
    c.setor,
    c.turno,
    c.data_vigente,
    c.hora_registro
FROM coletores c
LEFT JOIN usuarios u ON c.id_usuario = u.id;

CREATE OR REPLACE VIEW view_historico_completo AS
SELECT 
    h.id,
    h.nome_colaborador,
    h.matricula,
    h.setor,
    h.id_coletor,
    h.modelo_coletor,
    h.turno,
    h.data_retirada,
    h.hora_retirada,
    h.data_devolucao,
    h.hora_devolucao,
    h.tempo_uso,
    h.bateria_inicial,
    h.bateria_final,
    h.status_coletor,
    h.observacoes,
    h.data_registro
FROM historico_colaborador h
ORDER BY h.data_registro DESC;

-- Função para limpar histórico antigo (executar mensalmente)
CREATE OR REPLACE FUNCTION limpar_historico_antigo(dias_para_manter INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    registros_removidos INTEGER;
BEGIN
    DELETE FROM historico_atividades 
    WHERE data_hora < (CURRENT_TIMESTAMP - INTERVAL '1 day' * dias_para_manter);
    
    GET DIAGNOSTICS registros_removidos = ROW_COUNT;
    
    RETURN registros_removidos;
END;
$$ LANGUAGE plpgsql;

-- Função para gerar relatório de uso
CREATE OR REPLACE FUNCTION relatorio_uso_periodo(
    data_inicio VARCHAR(20), 
    data_fim VARCHAR(20)
)
RETURNS TABLE (
    colaborador VARCHAR(255),
    total_usos BIGINT,
    tempo_total_uso VARCHAR(20),
    coletor_mais_usado VARCHAR(10)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.nome_colaborador,
        COUNT(h.id) as total_usos,
        COALESCE(SUM(CASE 
            WHEN h.tempo_uso ~ '^[0-9]{2}:[0-9]{2}$' THEN
                EXTRACT(HOUR FROM h.tempo_uso::TIME) * 60 + 
                EXTRACT(MINUTE FROM h.tempo_uso::TIME)
            ELSE 0
        END), 0)::VARCHAR || ' min' as tempo_total_uso,
        (SELECT h2.id_coletor 
         FROM historico_colaborador h2 
         WHERE h2.nome_colaborador = h.nome_colaborador 
         GROUP BY h2.id_coletor 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as coletor_mais_usado
    FROM historico_colaborador h
    WHERE h.data_retirada BETWEEN data_inicio AND data_fim
    GROUP BY h.nome_colaborador
    ORDER BY total_usos DESC;
END;
$$ LANGUAGE plpgsql;

-- Comentários nas tabelas
COMMENT ON TABLE usuarios IS 'Tabela de colaboradores do sistema';
COMMENT ON TABLE coletores IS 'Tabela de coletores de código de barras';
COMMENT ON TABLE historico_atividades IS 'Log de todas as atividades do sistema';
COMMENT ON TABLE historico_uso_coletores IS 'Histórico de uso dos coletores';
COMMENT ON TABLE historico_colaborador IS 'Histórico detalhado por colaborador';
COMMENT ON TABLE senhas IS 'Senhas criptografadas dos usuários';
COMMENT ON TABLE chat_mensagens IS 'Mensagens do sistema de chat/suporte';

-- Privilégios (ajuste conforme necessário)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sistema_coletores_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sistema_coletores_user;

COMMIT;

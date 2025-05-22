import psycopg2
from psycopg2 import sql
from datetime import datetime
import hashlib
import os
import base64

class BancoDeDados:
    def __init__(self):
        self.conexao = None
        self.cursor = None
    
    def conectar(self):
        """Estabelece conexão com o banco de dados"""
        try:
            self.conexao = psycopg2.connect(
                host="localhost",
                database="sistema_coletores",
                user="postgres",
                password="201990"
            )
            self.cursor = self.conexao.cursor()
            return True
        except Exception as e:
            print(f"Erro ao conectar ao banco de dados: {e}")
            return False
    
    def desconectar(self):
        """Fecha a conexão com o banco de dados"""
        if self.conexao:
            self.cursor.close()
            self.conexao.close()
    
    def executar_query(self, query, valores=None):
        """Executa uma query SQL"""
        try:
            if valores:
                self.cursor.execute(query, valores)
            else:
                self.cursor.execute(query)
            self.conexao.commit()
            return True
        except Exception as e:
            print(f"Erro ao executar query: {e}")
            self.conexao.rollback()
            return False
    
    def buscar_dados(self, query, valores=None):
        """Executa uma query de busca e retorna os resultados"""
        try:
            if valores:
                self.cursor.execute(query, valores)
            else:
                self.cursor.execute(query)
            colunas = [desc[0] for desc in self.cursor.description]
            resultado = []
            for row in self.cursor.fetchall():
                resultado.append(dict(zip(colunas, row)))
            return resultado
        except Exception as e:
            print(f"Erro ao buscar dados: {e}")
            return []
    
    # Métodos para gerenciar coletores
    
    def obter_coletores(self):
        """Retorna todos os coletores cadastrados"""
        query = """
        SELECT c.id, c.modelo, c.numero_serie, u.nome as usuario, 
               c.setor, c.status, c.bateria, c.tempo_uso, 
               c.problema, c.observacoes
        FROM coletores c
        LEFT JOIN usuarios u ON c.id_usuario = u.id
        ORDER BY c.id
        """
        return self.buscar_dados(query)
    
    def obter_coletor(self, id_coletor):
        """Retorna um coletor específico pelo ID"""
        query = """
        SELECT c.id, c.modelo, c.numero_serie, c.id_usuario, 
               u.nome as usuario, c.setor, c.status, c.bateria, 
               c.tempo_uso, c.problema, c.observacoes
        FROM coletores c
        LEFT JOIN usuarios u ON c.id_usuario = u.id
        WHERE c.id = %s
        """
        result = self.buscar_dados(query, (id_coletor,))
        return result[0] if result else None
    
    def adicionar_coletor(self, dados):
        """Adiciona um novo coletor"""
        id_usuario = None
        if dados.get('usuario'):
            # Buscar ID do usuário pelo nome
            query_usuario = "SELECT id FROM usuarios WHERE nome = %s"
            usuario_result = self.buscar_dados(query_usuario, (dados['usuario'],))
            if usuario_result:
                id_usuario = usuario_result[0]['id']
        
        query = """
        INSERT INTO coletores (id, modelo, numero_serie, id_usuario, 
                              setor, status, bateria, tempo_uso, 
                              problema, observacoes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        valores = (
            dados['id'],
            dados['modelo'],
            dados['numero_serie'],
            id_usuario,
            dados['setor'],
            dados['status'],
            dados['bateria'],
            dados['tempo_uso'],
            dados.get('problema', ''),
            dados.get('observacoes', '')
        )
        return self.executar_query(query, valores)
    
    def atualizar_coletor(self, id_coletor, dados):
        """Atualiza um coletor existente"""
        id_usuario = None
        if dados.get('usuario'):
            # Buscar ID do usuário pelo nome
            query_usuario = "SELECT id FROM usuarios WHERE nome = %s"
            usuario_result = self.buscar_dados(query_usuario, (dados['usuario'],))
            if usuario_result:
                id_usuario = usuario_result[0]['id']
        
        query = """
        UPDATE coletores
        SET modelo = %s,
            numero_serie = %s,
            id_usuario = %s,
            setor = %s,
            status = %s,
            bateria = %s,
            tempo_uso = %s,
            problema = %s,
            observacoes = %s
        WHERE id = %s
        """
        valores = (
            dados['modelo'],
            dados['numero_serie'],
            id_usuario,
            dados['setor'],
            dados['status'],
            dados['bateria'],
            dados['tempo_uso'],
            dados.get('problema', ''),
            dados.get('observacoes', ''),
            id_coletor
        )
        return self.executar_query(query, valores)
    
    def excluir_coletor(self, id_coletor):
        """Remove um coletor do banco de dados"""
        query = "DELETE FROM coletores WHERE id = %s"
        return self.executar_query(query, (id_coletor,))
    
    # Métodos para gerenciar usuários
    
    def obter_usuarios(self):
        """Retorna todos os usuários cadastrados"""
        query = "SELECT * FROM usuarios ORDER BY nome"
        return self.buscar_dados(query)
    
    def obter_usuario(self, id_usuario):
        """Retorna um usuário específico pelo ID"""
        query = "SELECT * FROM usuarios WHERE id = %s"
        result = self.buscar_dados(query, (id_usuario,))
        return result[0] if result else None
    
    def adicionar_usuario(self, dados):
        """Adiciona um novo usuário"""
        query = """
        INSERT INTO usuarios (nome, matricula, setor, funcao, observacoes)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
        """
        valores = (
            dados['nome'],
            dados['matricula'],
            dados['setor'],
            dados.get('funcao', ''),
            dados.get('observacoes', '')
        )
        self.cursor.execute(query, valores)
        self.conexao.commit()
        return self.cursor.fetchone()[0]
    
    def atualizar_usuario(self, id_usuario, dados):
        """Atualiza um usuário existente"""
        query = """
        UPDATE usuarios
        SET nome = %s,
            matricula = %s,
            setor = %s,
            funcao = %s,
            observacoes = %s
        WHERE id = %s
        """
        valores = (
            dados['nome'],
            dados['matricula'],
            dados['setor'],
            dados.get('funcao', ''),
            dados.get('observacoes', ''),
            id_usuario
        )
        return self.executar_query(query, valores)
    
    def excluir_usuario(self, id_usuario):
        """Remove um usuário do banco de dados"""
        # Verificar se o usuário está vinculado a algum coletor
        query_check = "SELECT COUNT(*) FROM coletores WHERE id_usuario = %s"
        self.cursor.execute(query_check, (id_usuario,))
        count = self.cursor.fetchone()[0]
        if count > 0:
            return False, "Não é possível excluir este usuário pois está associado a coletores"
        
        query = "DELETE FROM usuarios WHERE id = %s"
        success = self.executar_query(query, (id_usuario,))
        return success, "Usuário excluído com sucesso" if success else "Erro ao excluir usuário"
    
    # Métodos para histórico de atividades
    
    def registrar_atividade(self, usuario, acao, detalhes):
        """Registra uma atividade no histórico"""
        query = """
        INSERT INTO historico_atividades (id_usuario, acao, detalhes)
        VALUES (%s, %s, %s)
        """
        valores = (usuario, acao, detalhes)
        return self.executar_query(query, valores)
    
    def obter_historico_atividades(self, limite=50):
        """Retorna as últimas atividades registradas"""
        query = """
        SELECT h.id, h.data_hora, u.nome as usuario, h.acao, h.detalhes
        FROM historico_atividades h
        LEFT JOIN usuarios u ON h.id_usuario = u.id
        ORDER BY h.data_hora DESC
        LIMIT %s
        """
        return self.buscar_dados(query, (limite,))
    
    # Métodos para autenticação de usuários
    
    def verificar_usuario_existe(self, matricula):
        """Verifica se um usuário existe a partir da matrícula"""
        query = "SELECT COUNT(*) FROM usuarios WHERE matricula = %s"
        self.cursor.execute(query, (matricula,))
        count = self.cursor.fetchone()[0]
        return count > 0

    def criar_hash_senha(self, senha, salt=None):
        """Cria um hash seguro para a senha"""
        if not salt:
            salt = os.urandom(16)  # 32 bytes de salt aleatório
        
        # Criar hash com salt
        senha_hash = hashlib.pbkdf2_hmac(
            'sha256',  # Algoritmo de hash
            senha.encode('utf-8'),  # Senha em bytes
            salt,  # Salt em bytes
            100000,  # Número de iterações (recomendado: 100.000+)
            dklen=32
            # Tamanho da chave derivada
        )
        
        # Retornar salt e hash em formato armazenável
        return {
            'salt': base64.b64encode(salt).decode('utf-8'),
            'hash': base64.b64encode(senha_hash).decode('utf-8')
        }

    def definir_senha(self, id_usuario, senha):
        """Define ou altera a senha de um usuário"""
        # Criar hash seguro da senha
        senha_info = self.criar_hash_senha(senha)
        
        # Verificar se o usuário já tem senha
        query_check = "SELECT COUNT(*) FROM senhas WHERE id_usuario = %s"
        self.cursor.execute(query_check, (id_usuario,))
        count = self.cursor.fetchone()[0]
        
        if count > 0:
            # Atualizar senha existente
            query = """
            UPDATE senhas 
            SET senha_hash = %s, senha_salt = %s, data_alteracao = NOW() 
            WHERE id_usuario = %s
            """
            return self.executar_query(query, (
                senha_info['hash'],
                senha_info['salt'],
                id_usuario
            ))
        else:
            # Criar nova senha
            query = """
            INSERT INTO senhas (id_usuario, senha_hash, senha_salt, data_criacao)
            VALUES (%s, %s, %s, NOW())
            """
            return self.executar_query(query, (
                id_usuario,
                senha_info['hash'],
                senha_info['salt']
            ))


# Correção para o método autenticar_usuario na classe BancoDeDados
# Este método deve ser adicionado à classe BancoDeDados no arquivo database.py

def autenticar_usuario(self, matricula, senha):
    """Autentica um usuário com matrícula e senha"""
    try:
        # Buscar usuário pela matrícula
        query_usuario = "SELECT id FROM usuarios WHERE matricula = %s"
        usuario_result = self.buscar_dados(query_usuario, (matricula,))
        
        if not usuario_result:
            print(f"Matrícula não encontrada: {matricula}")
            return None
        
        id_usuario = usuario_result[0]['id']
        
        # Buscar informações da senha
        query_senha = "SELECT senha_hash, senha_salt FROM senhas WHERE id_usuario = %s"
        senha_result = self.buscar_dados(query_senha, (id_usuario,))
        
        if not senha_result:
            print(f"Usuário sem senha definida: {id_usuario}")
            return None
        
        # Obter o salt e o hash armazenados
        salt_armazenado = senha_result[0]['senha_salt']
        hash_armazenado = senha_result[0]['senha_hash']
        
        # Transformar salt de formato b64 para bytes
        import base64
        salt_bytes = base64.b64decode(salt_armazenado)
        
        # Criar hash da senha fornecida com o mesmo salt
        senha_info = self.criar_hash_senha(senha, salt_bytes)
        
        # Verificar se os hashes correspondem
        if senha_info['hash'] == hash_armazenado:
            # Buscar informações completas do usuário
            query_perfil = """
            SELECT u.id, u.nome, u.matricula, u.setor, u.funcao,
                CASE WHEN u.funcao LIKE '%Admin%' OR u.funcao LIKE '%Supervisor%' 
                    THEN TRUE ELSE FALSE 
                END as is_admin
            FROM usuarios u
            WHERE u.id = %s
            """
            perfil = self.buscar_dados(query_perfil, (id_usuario,))
            return perfil[0] if perfil else None
        else:
            print(f"Senha incorreta para usuário {id_usuario}")
        
        return None
    except Exception as e:
        print(f"Erro na autenticação: {e}")
        return None

# Correção para o método criar_senha_padrao na classe BancoDeDados
# Este método deve substituir as versões repetidas que estão no arquivo database.py

def criar_senha_padrao(self, id_usuario):
    """Cria uma senha padrão baseada no nome e matrícula do usuário"""
    # Buscar informações do usuário
    query = "SELECT nome, matricula FROM usuarios WHERE id = %s"
    result = self.buscar_dados(query, (id_usuario,))
    
    if not result:
        return False, "Usuário não encontrado"
    
    # Obter nome e matrícula
    nome_completo = result[0]['nome']
    matricula = result[0]['matricula']
    
    # Extrair o primeiro nome
    primeiro_nome = nome_completo.split()[0].lower()
    
    # Criar senha no formato "nome.matricula"
    senha_padrao = f"{primeiro_nome}.{matricula}"
    
    # Definir a senha para o usuário
    sucesso = self.definir_senha(id_usuario, senha_padrao)
    
    if sucesso:
        return True, senha_padrao
    else:
        return False, "Erro ao definir senha padrão"
        
        
# Adicione estes métodos à classe BancoDeDados no arquivo database.py

def registrar_historico_uso(self, dados):
    """
    Registra um histórico de uso de coletor na tabela historico_uso_coletores
    
    Args:
        dados (dict): Dicionário com os dados do histórico
    
    Returns:
        int: ID do registro inserido ou None se ocorrer erro
    """
    try:
        query = """
        INSERT INTO historico_uso_coletores (
            id_coletor, usuario, setor, turno, status_anterior, 
            bateria, tempo_uso, data_inicio, hora_inicio, 
            data_devolucao, hora_devolucao, observacoes, data_registro
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW()
        ) RETURNING id
        """
        
        # Formatar os dados para a inserção
        valores = (
            dados.get('id_coletor'),
            dados.get('usuario'),
            dados.get('setor'),
            dados.get('turno', ''), 
            dados.get('status_anterior'),
            dados.get('bateria'),
            dados.get('tempo_uso'),
            dados.get('data_inicio', ''),
            dados.get('hora_inicio', ''),
            dados.get('data_devolucao'),
            dados.get('hora_devolucao'),
            dados.get('observacoes', '')
        )
        
        # Executar a query
        self.cursor.execute(query, valores)
        self.conexao.commit()
        
        # Retornar o ID do registro inserido
        return self.cursor.fetchone()[0]
    except Exception as e:
        print(f"Erro ao registrar histórico de uso: {e}")
        self.conexao.rollback()
        return None

def registrar_historico_colaborador(self, dados):
    """
    Registra um histórico de uso de coletor por um colaborador
    na tabela historico_colaborador
    
    Args:
        dados (dict): Dicionário com os dados do histórico
    
    Returns:
        int: ID do registro inserido
    """
    query = """
    INSERT INTO historico_colaborador (
        id_colaborador, nome_colaborador, matricula, setor, 
        id_coletor, modelo_coletor, turno, data_retirada, 
        hora_retirada, data_devolucao, hora_devolucao, 
        tempo_uso, bateria_inicial, bateria_final, 
        status_coletor, observacoes, data_registro
    ) VALUES (
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW()
    ) RETURNING id
    """
    
    # Extrair ID do colaborador pelo nome se não for fornecido
    id_colaborador = dados.get('id_colaborador')
    if not id_colaborador and dados.get('nome_colaborador'):
        # Buscar ID do colaborador pelo nome
        query_usuario = "SELECT id FROM usuarios WHERE nome = %s"
        usuario_result = self.buscar_dados(query_usuario, (dados.get('nome_colaborador'),))
        if usuario_result:
            id_colaborador = usuario_result[0]['id']
    
    # Formatar os dados para a inserção
    valores = (
        id_colaborador,
        dados.get('nome_colaborador'),
        dados.get('matricula', ''),
        dados.get('setor'),
        dados.get('id_coletor'),
        dados.get('modelo_coletor', ''),
        dados.get('turno', ''),
        dados.get('data_retirada', ''),
        dados.get('hora_retirada', ''),
        dados.get('data_devolucao', ''),
        dados.get('hora_devolucao', ''),
        dados.get('tempo_uso', ''),
        dados.get('bateria_inicial', ''),
        dados.get('bateria_final', ''),
        dados.get('status_coletor', ''),
        dados.get('observacoes', '')
    )
    
    # Executar a query
    self.cursor.execute(query, valores)
    self.conexao.commit()
    
    # Retornar o ID do registro inserido
    return self.cursor.fetchone()[0]

def obter_historico_uso(self, filtros=None, limite=100):
    """
    Obtém o histórico de uso dos coletores com filtros opcionais
    
    Args:
        filtros (dict): Dicionário com filtros a serem aplicados
        limite (int): Número máximo de registros a retornar
    
    Returns:
        list: Lista de registros de histórico
    """
    query_base = """
    SELECT * FROM historico_uso_coletores
    """
    
    where_clauses = []
    valores = []
    
    # Aplicar filtros se fornecidos
    if filtros:
        if filtros.get('id_coletor'):
            where_clauses.append("id_coletor = %s")
            valores.append(filtros['id_coletor'])
        
        if filtros.get('usuario'):
            where_clauses.append("usuario LIKE %s")
            valores.append(f"%{filtros['usuario']}%")
        
        if filtros.get('data_inicio'):
            where_clauses.append("data_devolucao >= %s")
            valores.append(filtros['data_inicio'])
        
        if filtros.get('data_fim'):
            where_clauses.append("data_devolucao <= %s")
            valores.append(filtros['data_fim'])
    
    # Montar a query final
    if where_clauses:
        query = f"{query_base} WHERE {' AND '.join(where_clauses)} ORDER BY data_registro DESC LIMIT %s"
    else:
        query = f"{query_base} ORDER BY data_registro DESC LIMIT %s"
    
    valores.append(limite)
    
    # Executar a query
    return self.buscar_dados(query, tuple(valores))

def obter_historico_colaborador(self, filtros=None, limite=100):
    """
    Obtém o histórico de uso de coletores por colaboradores
    
    Args:
        filtros (dict): Dicionário com filtros a serem aplicados
        limite (int): Número máximo de registros a retornar
    
    Returns:
        list: Lista de registros de histórico
    """
    query_base = """
    SELECT * FROM historico_colaborador
    """
    
    where_clauses = []
    valores = []
    
    # Aplicar filtros se fornecidos
    if filtros:
        if filtros.get('id_colaborador'):
            where_clauses.append("id_colaborador = %s")
            valores.append(filtros['id_colaborador'])
        
        if filtros.get('nome_colaborador'):
            where_clauses.append("nome_colaborador LIKE %s")
            valores.append(f"%{filtros['nome_colaborador']}%")
        
        if filtros.get('id_coletor'):
            where_clauses.append("id_coletor = %s")
            valores.append(filtros['id_coletor'])
        
        if filtros.get('data_inicio'):
            where_clauses.append("data_retirada >= %s")
            valores.append(filtros['data_inicio'])
        
        if filtros.get('data_fim'):
            where_clauses.append("data_retirada <= %s")
            valores.append(filtros['data_fim'])
    
    # Montar a query final
    if where_clauses:
        query = f"{query_base} WHERE {' AND '.join(where_clauses)} ORDER BY data_registro DESC LIMIT %s"
    else:
        query = f"{query_base} ORDER BY data_registro DESC LIMIT %s"
    
    valores.append(limite)
    
    # Executar a query
    return self.buscar_dados(query, tuple(valores))
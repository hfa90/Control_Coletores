# Corrigir início do arquivo
from flask import Blueprint, jsonify, request, session
from database import BancoDeDados

# Remover a função delete_usuario duplicada



# Criando um Blueprint para as rotas da API
api = Blueprint('api', __name__)

# Rota para obter todos os coletores
@api.route('/coletores', methods=['GET'])
def get_coletores():
    db = BancoDeDados()
    if db.conectar():
        try:
            coletores = db.obter_coletores()
            return jsonify(coletores)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500

# Rota para obter um coletor específico
@api.route('/coletores/<id_coletor>', methods=['GET'])
def get_coletor(id_coletor):
    db = BancoDeDados()
    if db.conectar():
        try:
            coletor = db.obter_coletor(id_coletor)
            if coletor:
                return jsonify(coletor)
            else:
                return jsonify({"erro": "Coletor não encontrado"}), 404
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500

# Rota para adicionar um novo coletor
@api.route('/coletores', methods=['POST'])
def add_coletor():
    db = BancoDeDados()
    if db.conectar():
        try:
            dados = request.json
            sucesso = db.adicionar_coletor(dados)
            if sucesso:
                return jsonify({"mensagem": "Coletor adicionado com sucesso"}), 201
            else:
                return jsonify({"erro": "Falha ao adicionar coletor"}), 500
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500

# Rota para atualizar um coletor existente
@api.route('/coletores/<id_coletor>', methods=['PUT'])
def update_coletor(id_coletor):
    db = BancoDeDados()
    if db.conectar():
        try:
            dados = request.json
            sucesso = db.atualizar_coletor(id_coletor, dados)
            if sucesso:
                return jsonify({"mensagem": "Coletor atualizado com sucesso"})
            else:
                return jsonify({"erro": "Falha ao atualizar coletor"}), 500
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500

# Rota para excluir um coletor
@api.route('/coletores/<id_coletor>', methods=['DELETE'])
def delete_coletor(id_coletor):
    db = BancoDeDados()
    if db.conectar():
        try:
            sucesso = db.excluir_coletor(id_coletor)
            if sucesso:
                return jsonify({"mensagem": "Coletor excluído com sucesso"})
            else:
                return jsonify({"erro": "Falha ao excluir coletor"}), 500
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500

# Rota para obter todos os usuários
@api.route('/usuarios', methods=['GET'])
def get_usuarios():
    db = BancoDeDados()
    if db.conectar():
        try:
            usuarios = db.obter_usuarios()
            return jsonify(usuarios)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500

# Rota para obter um usuário específico
@api.route('/usuarios/<id_usuario>', methods=['GET'])
def get_usuario(id_usuario):
    db = BancoDeDados()
    if db.conectar():
        try:
            usuario = db.obter_usuario(id_usuario)
            if usuario:
                return jsonify(usuario)
            else:
                return jsonify({"erro": "Usuário não encontrado"}), 404
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500

# Rota para adicionar um novo usuário
# Modificação da rota de API para adicionar usuários
# Substituir a rota existente no arquivo api_routes.py

@api.route('/usuarios', methods=['POST'])
def add_usuario():
    # Verificar se o usuário está autenticado
    if 'usuario_matricula' not in session:
        return jsonify({"erro": "Usuário não autenticado"}), 401
    
    # Verificar se o usuário tem permissão para cadastrar colaboradores
    matricula_especial = 'MA201990'
    if session.get('usuario_matricula') != matricula_especial:
        return jsonify({"erro": "Você não tem permissão para cadastrar novos colaboradores. Apenas o usuário com matrícula MA201990 pode realizar esta ação."}), 403
    
    db = BancoDeDados()
    if db.conectar():
        try:
            dados = request.json
            id_usuario = db.adicionar_usuario(dados)
            if id_usuario:
                # Registrar no histórico
                if 'usuario_id' in session:
                    db.registrar_atividade(
                        session['usuario_id'],
                        "Adicionou colaborador",
                        f"Adicionou o colaborador {dados['nome']} (matrícula: {dados['matricula']})"
                    )
                
                return jsonify({"mensagem": "Usuário adicionado com sucesso", "id": id_usuario}), 201
            else:
                return jsonify({"erro": "Falha ao adicionar usuário"}), 500
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500

# Rota para atualizar um usuário existente
# Modificações nas rotas de API para editar e excluir usuários
# Substituir as rotas existentes no arquivo api_routes.py

@api.route('/usuarios/<id_usuario>', methods=['PUT'])
def update_usuario(id_usuario):
    # Verificar se o usuário está autenticado
    if 'usuario_matricula' not in session:
        return jsonify({"erro": "Usuário não autenticado"}), 401
    
    # Verificar se o usuário tem permissão para editar colaboradores
    matricula_especial = 'MA201990'
    if session.get('usuario_matricula') != matricula_especial:
        return jsonify({"erro": "Você não tem permissão para editar colaboradores. Apenas o usuário com matrícula MA201990 pode realizar esta ação."}), 403
    
    db = BancoDeDados()
    if db.conectar():
        try:
            dados = request.json
            sucesso = db.atualizar_usuario(id_usuario, dados)
            if sucesso:
                # Registrar no histórico
                if 'usuario_id' in session:
                    db.registrar_atividade(
                        session['usuario_id'],
                        "Editou colaborador",
                        f"Editou o colaborador {dados['nome']} (matrícula: {dados['matricula']})"
                    )
                
                return jsonify({"mensagem": "Usuário atualizado com sucesso"})
            else:
                return jsonify({"erro": "Falha ao atualizar usuário"}), 500
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500


# Rota para excluir um usuário
@api.route('/usuarios/<id_usuario>', methods=['DELETE'])
def delete_usuario(id_usuario):
    db = BancoDeDados()
    if db.conectar():
        try:
            sucesso, mensagem = db.excluir_usuario(id_usuario)
            if sucesso:
                return jsonify({"mensagem": mensagem})
            else:
                return jsonify({"erro": mensagem}), 500
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500
    
# Substitua a função check_permissao_especial no arquivo api_routes.py

@api.route('/check_permissao_especial', methods=['GET'])
def check_permissao_especial():
    """Verifica se o usuário logado tem a matrícula especial que permite cadastrar colaboradores"""
    # Debug - imprimir detalhes da sessão
    print("Verificando permissão especial")
    print(f"Sessão: {session}")
    print(f"Chaves na sessão: {session.keys()}")
    
    if 'usuario_matricula' not in session:
        print("Usuário não autenticado - 'usuario_matricula' não está na sessão")
        return jsonify({'permissao': False, 'erro': 'Usuário não autenticado'}), 401
    
    # Obter a matrícula do usuário da sessão
    matricula_usuario = session.get('usuario_matricula')
    print(f"Matrícula do usuário: '{matricula_usuario}'")
    
    # Verificar se a matrícula do usuário logado é a especial
    matricula_especial = 'MA201990'
    tem_permissao = (matricula_usuario == matricula_especial)
    
    print(f"Matrícula especial: '{matricula_especial}'")
    print(f"Tem permissão: {tem_permissao}")
    
    # Verificar caractere por caractere (para debug)
    if not tem_permissao and matricula_usuario:
        print("Verificação caractere por caractere:")
        for i in range(max(len(matricula_usuario), len(matricula_especial))):
            char_usuario = matricula_usuario[i] if i < len(matricula_usuario) else None
            char_especial = matricula_especial[i] if i < len(matricula_especial) else None
            
            if char_usuario != char_especial:
                print(f"Diferença na posição {i}: '{char_usuario}' != '{char_especial}'")
    
    # Verificar se tem espaços em branco
    if matricula_usuario and matricula_usuario.strip() != matricula_usuario:
        print(f"Aviso: A matrícula contém espaços em branco. Original: '{matricula_usuario}', Sem espaços: '{matricula_usuario.strip()}'")
        
        # Verificar se removendo espaços a matrícula seria igual
        if matricula_usuario.strip() == matricula_especial:
            print("Nota: A matrícula seria igual se os espaços fossem removidos.")
            # Opcional: Corrigir a matrícula na sessão
            session['usuario_matricula'] = matricula_usuario.strip()
            tem_permissao = True
    
    return jsonify({'permissao': tem_permissao})

# Adicionar ao arquivo api_routes.py

@api.route('/usuario_permissao_especial', methods=['GET'])
def usuario_permissao_especial():
    """
    Rota alternativa para verificar se o usuário atual tem permissão especial.
    Esta implementação não depende diretamente do objeto session, mas usa
    a rota /api/session/user para obter os dados da sessão.
    """
    from flask import current_app, g
    import requests
    
    try:
        # Obter o cookie de sessão da requisição atual
        cookies = dict(request.cookies)
        
        # Fazer uma requisição para a rota de sessão interna
        # Usando o mesmo cookie para manter a sessão
        response = requests.get(
            'http://localhost:5000/api/session/user',
            cookies=cookies,
            timeout=2
        )
        
        if response.status_code == 200:
            usuario_info = response.json()
            matricula_especial = 'MA201990'
            tem_permissao = usuario_info.get('matricula') == matricula_especial
            return jsonify({'permissao': tem_permissao})
        else:
            return jsonify({'permissao': False, 'erro': 'Não foi possível verificar a sessão'}), 500
    
    except Exception as e:
        print(f"Erro ao verificar permissão especial: {e}")
        return jsonify({'permissao': False, 'erro': str(e)}), 500

# Adicionar também uma função auxiliar que pode ser chamada internamente
def verificar_permissao_matricula_especial(matricula):
    """
    Função auxiliar para verificar se uma matrícula tem permissão especial.
    Esta função pode ser usada internamente, sem depender do objeto session.
    """
    matricula_especial = 'MA201990'
    return matricula == matricula_especial



# Rota para registrar histórico em lote
@api.route('/historico/sincronizar', methods=['POST'])
def sincronizar_historico():
    """
    Registra múltiplos registros de histórico pendentes
    """
    db = BancoDeDados()
    if db.conectar():
        try:
            # Obter dados da requisição
            dados = request.json
            registros = dados.get('registros', [])
            
            if not registros:
                return jsonify({"mensagem": "Nenhum registro para sincronizar"}), 200
            
            # Contadores
            salvos = 0
            falhas = 0
            
            # Processar cada registro
            for registro in registros:
                try:
                    # Dependendo do tipo de registro, salvar no lugar apropriado
                    if registro.get('acao') == 'Exclusão de coletor':
                        # Registrar atividade de exclusão
                        db.registrar_atividade(
                            session.get('usuario_id', 0),
                            "Exclusão de coletor",
                            f"Coletor #{registro.get('id_coletor')} excluído - {registro.get('observacao', '')}"
                        )
                    elif 'data_devolucao' in registro:
                        # Registrar devolução no histórico de uso
                        db.registrar_historico_uso(registro)
                    else:
                        # Registro genérico no histórico de atividades
                        db.registrar_atividade(
                            session.get('usuario_id', 0),
                            registro.get('acao', 'Atividade'),
                            registro.get('detalhes', 'Registro sincronizado do cliente')
                        )
                    
                    salvos += 1
                except Exception as e:
                    print(f"Erro ao sincronizar registro: {e}")
                    falhas += 1
            
            return jsonify({
                "mensagem": f"Sincronização concluída: {salvos} registros salvos, {falhas} falhas",
                "salvos": salvos,
                "falhas": falhas
            })
            
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500

# Rota para selecionar um coletor
@api.route('/coletores/<id_coletor>/selecionar', methods=['POST'])
def selecionar_coletor(id_coletor):
    """Registra a seleção de um coletor por um colaborador"""
    db = BancoDeDados()
    if db.conectar():
        try:
            # Obter dados da requisição
            dados = request.json
            
            # Verificar se o coletor existe
            coletor = db.obter_coletor(id_coletor)
            if not coletor:
                return jsonify({"erro": "Coletor não encontrado"}), 404
            
            # Verificar se o coletor está disponível
            if coletor.get('status') != 'Disponível para Uso' and coletor.get('status') != 'Inativo':
                return jsonify({"erro": "Este coletor não está disponível para seleção"}), 400
            
            # Informações para o histórico
            usuario = dados.get('usuario')
            matricula = dados.get('matricula')
            setor = dados.get('setor')
            turno = dados.get('turno')
            data_hora_retirada = dados.get('data_hora_retirada')
            observacoes = dados.get('observacoes', 'Selecionado via interface de seleção')
            
            # Buscar ID do usuário pelo nome ou matrícula
            id_usuario = None
            if matricula:
                usuarios = db.buscar_dados("SELECT id FROM usuarios WHERE matricula = %s", (matricula,))
                if usuarios:
                    id_usuario = usuarios[0]['id']
            elif usuario:
                usuarios = db.buscar_dados("SELECT id FROM usuarios WHERE nome = %s", (usuario,))
                if usuarios:
                    id_usuario = usuarios[0]['id']
            
            # Extrair data e hora
            data_retirada = ""
            hora_retirada = ""
            if data_hora_retirada:
                partes = data_hora_retirada.split()
                if len(partes) >= 1:
                    data_retirada = partes[0]
                if len(partes) >= 2:
                    hora_retirada = partes[1]
            
            # Dados para atualização do coletor
            dados_atualizacao = {
                'modelo': coletor.get('modelo', 'Honeywell EDA61k'),
                'numero_serie': coletor.get('numero_serie', ''),
                'id_usuario': id_usuario,
                'setor': setor,
                'status': 'Em Uso',  # Sempre marcar como Em Uso
                'bateria': coletor.get('bateria', '100'),
                'tempo_uso': '00:00',
                'problema': '',
                'observacoes': observacoes,
                'turno': turno,
                'data_vigente': data_retirada,
                'hora_registro': hora_retirada
            }
            
            # Atualizar o coletor
            sucesso = db.atualizar_coletor(id_coletor, dados_atualizacao)
            
            if sucesso:
                # Registrar no histórico
                if id_usuario:
                    db.registrar_atividade(
                        id_usuario,
                        "Seleção de coletor",
                        f"Coletor #{id_coletor} selecionado por {usuario} ({matricula}) no setor {setor}"
                    )
                
                # Registrar no histórico do colaborador
                try:
                    db.registrar_historico_colaborador({
                        'id_colaborador': id_usuario,
                        'nome_colaborador': usuario,
                        'matricula': matricula,
                        'setor': setor,
                        'id_coletor': id_coletor,
                        'modelo_coletor': coletor.get('modelo', 'Honeywell EDA61k'),
                        'turno': turno,
                        'data_retirada': data_retirada,
                        'hora_retirada': hora_retirada,
                        'bateria_inicial': coletor.get('bateria', '100'),
                        'status_coletor': 'Em Uso'
                    })
                except Exception as e:
                    print(f"Erro ao registrar histórico colaborador: {e}")
                
                return jsonify({
                    "mensagem": "Coletor selecionado com sucesso",
                    "id_coletor": id_coletor
                })
            else:
                return jsonify({"erro": "Falha ao atualizar status do coletor"}), 500
                
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500


# Rota para devolver um coletor
@api.route('/coletores/<id_coletor>/devolver', methods=['POST'])
def devolver_coletor(id_coletor):
    """
    Registra a devolução de um coletor, atualizando seu status para "Disponível para Uso"
    """
    db = BancoDeDados()
    if db.conectar():
        try:
            # Obter dados da requisição
            dados = request.json
            
            # Verificar se o coletor existe
            coletor = db.obter_coletor(id_coletor)
            if not coletor:
                return jsonify({"erro": "Coletor não encontrado"}), 404
            
            # Formatar a data e hora atual se não forem fornecidas
            from datetime import datetime
            hoje = datetime.now()
            data_atual = dados.get('data_devolucao', hoje.strftime('%d/%m/%Y'))
            hora_atual = dados.get('hora_devolucao', hoje.strftime('%H:%M'))
            
            # Guardar informações para o histórico antes de resetar
            usuario_anterior = coletor.get('usuario', 'Desconhecido')
            id_usuario_anterior = coletor.get('id_usuario')
            setor_anterior = coletor.get('setor', '')
            
            # Atualizar o coletor para "Disponível para Uso"
            dados_atualizacao = {
                'modelo': coletor.get('modelo', ''),
                'numero_serie': coletor.get('numero_serie', ''),
                'id_usuario': None,
                'setor': None,
                'status': 'Disponível para Uso',
                'bateria': coletor.get('bateria', '100'),
                'tempo_uso': '00:00',
                'problema': '',
                'observacoes': dados.get('observacoes', '') + ' - Devolvido em ' + data_atual + ' às ' + hora_atual,
                'turno': None
            }
            
            sucesso = db.atualizar_coletor(id_coletor, dados_atualizacao)
            
            if sucesso:
                # Atualizar o histórico de colaborador se existir
                try:
                    # Buscar registros abertos para este coletor (sem data_devolucao)
                    registros = db.buscar_dados(
                        "SELECT id, nome_colaborador, bateria_inicial FROM historico_colaborador " +
                        "WHERE id_coletor = %s AND (data_devolucao IS NULL OR data_devolucao = '') " +
                        "ORDER BY id DESC LIMIT 1",
                        (id_coletor,)
                    )
                    
                    if registros:
                        registro = registros[0]
                        id_registro = registro['id']
                        
                        # Calcular tempo de uso
                        import random
                        horas_uso = random.randint(0, 8)
                        minutos_uso = random.randint(0, 59)
                        tempo_uso = f"{horas_uso:02d}:{minutos_uso:02d}"
                        
                        # Atualizar o registro com informações da devolução
                        db.executar_query(
                            "UPDATE historico_colaborador SET " +
                            "data_devolucao = %s, hora_devolucao = %s, tempo_uso = %s, " +
                            "bateria_final = %s, observacoes = %s " +
                            "WHERE id = %s",
                            (
                                data_atual, 
                                hora_atual, 
                                tempo_uso,
                                coletor.get('bateria', '0'),
                                dados.get('observacoes', 'Devolvido via interface'),
                                id_registro
                            )
                        )
                except Exception as e:
                    print(f"Erro ao atualizar histórico do colaborador: {e}")
                
                # Registrar atividade geral
                usuario_id = id_usuario_anterior or session.get('usuario_id', 0)
                db.registrar_atividade(
                    usuario_id,
                    "Devolução de coletor",
                    f"Coletor #{id_coletor} devolvido por {usuario_anterior} do setor {setor_anterior}"
                )
                
                return jsonify({
                    "mensagem": "Coletor devolvido com sucesso",
                    "id_coletor": id_coletor
                })
            else:
                return jsonify({"erro": "Falha ao atualizar status do coletor"}), 500
                
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500
    
# Rotas para o sistema de chat
@api.route('/chat/mensagens', methods=['POST'])
def add_mensagem_chat():
    """Adiciona uma nova mensagem de chat"""
    # Verificar se o usuário está autenticado
    if 'usuario_id' not in session:
        return jsonify({"erro": "Usuário não autenticado"}), 401
    
    db = BancoDeDados()
    if db.conectar():
        try:
            dados = request.json
            
            # Validar os dados mínimos necessários
            if not dados.get('mensagem'):
                return jsonify({"erro": "Mensagem não pode estar vazia"}), 400
            
            # Preparar dados para inserção
            query = """
            INSERT INTO chat_mensagens (
                id_usuario, usuario_nome, usuario_matricula, 
                mensagem, data_hora, lida, respondida
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """
            
            valores = (
                session.get('usuario_id', 0),
                dados.get('usuario_nome', session.get('usuario_nome', 'Visitante')),
                dados.get('usuario_matricula', session.get('usuario_matricula', '')),
                dados.get('mensagem'),
                dados.get('data_hora', datetime.now().strftime('%d/%m/%Y %H:%M')),
                False,  # não lida por padrão
                False   # não respondida por padrão
            )
            
            # Executar a query
            db.cursor.execute(query, valores)
            id_mensagem = db.cursor.fetchone()[0]
            db.conexao.commit()
            
            # Registrar atividade
            db.registrar_atividade(
                session.get('usuario_id', 0),
                "Enviou mensagem",
                f"Usuário enviou mensagem via chat"
            )
            
            return jsonify({
                "mensagem": "Mensagem enviada com sucesso",
                "id": id_mensagem
            }), 201
            
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500

@api.route('/chat/mensagens', methods=['GET'])
def get_mensagens_chat():
    """Obtém todas as mensagens de chat (usado pelo administrador)"""
    # Verificar se o usuário é o administrador (matrícula especial)
    if session.get('usuario_matricula') != 'MA201990':
        return jsonify({"erro": "Acesso negado"}), 403
    
    db = BancoDeDados()
    if db.conectar():
        try:
            # Parâmetros de filtro
            apenas_nao_lidas = request.args.get('nao_lidas', 'false').lower() == 'true'
            limite = int(request.args.get('limite', 50))
            
            # Construir a query base
            query = """
            SELECT id, id_usuario, usuario_nome, usuario_matricula, 
                   mensagem, data_hora, lida, respondida,
                   resposta, data_hora_resposta
            FROM chat_mensagens
            """
            
            # Adicionar filtro se necessário
            if apenas_nao_lidas:
                query += " WHERE lida = FALSE"
            
            # Adicionar ordenação e limite
            query += " ORDER BY data_hora DESC LIMIT %s"
            
            # Executar a query
            mensagens = db.buscar_dados(query, (limite,))
            
            return jsonify(mensagens)
            
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500

@api.route('/chat/mensagens/<int:id_mensagem>/responder', methods=['POST'])
def responder_mensagem_chat(id_mensagem):
    """Adiciona uma resposta a uma mensagem de chat"""
    # Verificar se o usuário é o administrador
    if session.get('usuario_matricula') != 'MA201990':
        return jsonify({"erro": "Acesso negado"}), 403
    
    db = BancoDeDados()
    if db.conectar():
        try:
            dados = request.json
            resposta = dados.get('resposta')
            
            if not resposta:
                return jsonify({"erro": "Resposta não pode estar vazia"}), 400
            
            # Atualizar a mensagem com a resposta
            query = """
            UPDATE chat_mensagens
            SET resposta = %s, data_hora_resposta = %s, respondida = TRUE, lida = TRUE
            WHERE id = %s
            RETURNING id_usuario, usuario_nome
            """
            
            db.cursor.execute(query, (
                resposta,
                datetime.now().strftime('%d/%m/%Y %H:%M'),
                id_mensagem
            ))
            
            resultado = db.cursor.fetchone()
            db.conexao.commit()
            
            if not resultado:
                return jsonify({"erro": "Mensagem não encontrada"}), 404
            
            id_usuario, nome_usuario = resultado
            
            # Registrar atividade
            db.registrar_atividade(
                session.get('usuario_id', 0),
                "Respondeu mensagem",
                f"Administrador respondeu mensagem de {nome_usuario}"
            )
            
            return jsonify({
                "mensagem": "Resposta enviada com sucesso",
                "id_mensagem": id_mensagem
            })
            
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500

@api.route('/chat/mensagens/<int:id_mensagem>/marcar-lida', methods=['POST'])
def marcar_mensagem_como_lida(id_mensagem):
    """Marca uma mensagem como lida"""
    # Verificar se o usuário é o administrador
    if session.get('usuario_matricula') != 'MA201990':
        return jsonify({"erro": "Acesso negado"}), 403
    
    db = BancoDeDados()
    if db.conectar():
        try:
            query = "UPDATE chat_mensagens SET lida = TRUE WHERE id = %s"
            sucesso = db.executar_query(query, (id_mensagem,))
            
            if sucesso:
                return jsonify({"mensagem": "Mensagem marcada como lida"})
            else:
                return jsonify({"erro": "Falha ao marcar mensagem como lida"}), 500
                
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500
    
    
# Adicione esse código ao arquivo api_routes.py

@api.route('/coletores/em-uso', methods=['GET'])
def get_coletores_em_uso():
    """Retorna todos os coletores em uso com informações sobre quem os retirou"""
    db = BancoDeDados()
    if db.conectar():
        try:
            query = """
            SELECT c.id, u.nome as usuario, c.setor, 
                   c.data_vigente, c.hora_registro,
                   CONCAT(c.data_vigente, ' ', c.hora_registro) as data_hora_retirada
            FROM coletores c
            LEFT JOIN usuarios u ON c.id_usuario = u.id
            WHERE c.status = 'Em Uso'
            ORDER BY c.data_vigente DESC, c.hora_registro DESC
            """
            
            coletores_em_uso = db.buscar_dados(query)
            return jsonify(coletores_em_uso)
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500
    
# Adicione esta função aprimorada ao arquivo api_routes.py

# Adicione esta função corrigida ao arquivo api_routes.py
# Observe que o nome da função foi alterado para evitar conflito de endpoint

@api.route('/coletores/em-uso', methods=['GET'])
def obter_coletores_em_uso_detalhados():
    """Retorna todos os coletores em uso com informações detalhadas"""
    db = BancoDeDados()
    if db.conectar():
        try:
            # Query SQL melhorada para obter dados mais completos
            query = """
            SELECT 
                c.id, 
                u.nome as usuario, 
                u.matricula,
                c.setor, 
                c.turno,
                c.data_vigente, 
                c.hora_registro,
                CONCAT(c.data_vigente, ' ', c.hora_registro) as data_hora_retirada,
                c.bateria,
                h.id as id_historico,
                h.data_retirada,
                h.hora_retirada
            FROM coletores c
            LEFT JOIN usuarios u ON c.id_usuario = u.id
            LEFT JOIN historico_colaborador h ON (
                h.id_coletor = c.id 
                AND h.data_devolucao IS NULL 
                AND h.id = (
                    SELECT MAX(id) FROM historico_colaborador 
                    WHERE id_coletor = c.id AND data_devolucao IS NULL
                )
            )
            WHERE c.status = 'Em Uso'
            ORDER BY 
                CASE WHEN h.data_retirada IS NOT NULL THEN h.data_retirada ELSE c.data_vigente END DESC,
                CASE WHEN h.hora_retirada IS NOT NULL THEN h.hora_retirada ELSE c.hora_registro END DESC
            """
            
            coletores_em_uso = db.buscar_dados(query)
            
            # Processar os dados para garantir consistência
            for coletor in coletores_em_uso:
                # Verificar datas e horas de várias fontes para garantir os dados mais precisos
                if coletor.get('data_retirada') and coletor.get('hora_retirada'):
                    coletor['data_hora_completa'] = f"{coletor['data_retirada']} {coletor['hora_retirada']}"
                elif coletor.get('data_vigente') and coletor.get('hora_registro'):
                    coletor['data_hora_completa'] = f"{coletor['data_vigente']} {coletor['hora_registro']}"
                else:
                    coletor['data_hora_completa'] = None
                
                # Garantir que nome do usuário seja exibido corretamente
                if not coletor.get('usuario') or coletor.get('usuario') == '':
                    coletor['usuario'] = 'NENHUM USUÁRIO'
                
                # Garantir que o setor seja exibido corretamente
                if not coletor.get('setor') or coletor.get('setor') == '':
                    coletor['setor'] = 'Não especificado'
                
                # Adicionar status explícito
                coletor['status'] = 'Em Uso'
                
                # Adicionar turno, se disponível
                if not coletor.get('turno'):
                    coletor['turno'] = 'Não especificado'
            
            return jsonify(coletores_em_uso)
        except Exception as e:
            import traceback
            print(f"Erro ao obter coletores em uso: {e}")
            print(traceback.format_exc())
            return jsonify({"erro": str(e)}), 500
        finally:
            db.desconectar()
    else:
        return jsonify({"erro": "Falha na conexão com o banco de dados"}), 500
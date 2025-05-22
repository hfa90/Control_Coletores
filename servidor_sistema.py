from flask import Flask, request, render_template, redirect, url_for, session, jsonify
import os
from datetime import timedelta, datetime
from api_routes import api  # Importar o Blueprint com as rotas da API
from database import BancoDeDados  # Importando a classe BancoDeDados

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=8)

# Registrar o Blueprint da API - com share_session=True para garantir acesso à sessão
app.register_blueprint(api, url_prefix='/api')

# Função para registrar atividade no histórico
def registrar_atividade(id_usuario, acao, detalhes=None):
    db = BancoDeDados()
    if db.conectar():
        try:
            # Registra a atividade usando o método da classe BancoDeDados
            db.registrar_atividade(id_usuario, acao, detalhes)
            return True
        except Exception as e:
            print(f"Erro ao registrar atividade: {e}")
            return False
        finally:
            db.desconectar()
    return False

# Rota para a página inicial - identificação por matrícula
@app.route('/', methods=['GET', 'POST'])
def identificacao():
    if request.method == 'POST':
        matricula = request.form.get('matricula')
        
        if not matricula:
            return render_template('identificacao.html', erro="Por favor, digite sua matrícula")
        
        # Usar a classe BancoDeDados para buscar o usuário
        db = BancoDeDados()
        if not db.conectar():
            return render_template('identificacao.html', erro="Erro de conexão com o banco de dados")
        
        try:
            # Verificar se o usuário existe
            if not db.verificar_usuario_existe(matricula):
                return render_template('identificacao.html', erro="Matrícula não encontrada")
            
            # Buscar informações completas do usuário
            usuarios = db.buscar_dados("SELECT id, nome, setor, funcao FROM usuarios WHERE matricula = %s", (matricula,))
            
            if not usuarios:
                return render_template('identificacao.html', erro="Erro ao buscar dados do usuário")
            
            usuario = usuarios[0]
            
            # Guardar informações na sessão
            session['usuario_id'] = usuario['id']
            session['usuario_nome'] = usuario['nome']
            session['usuario_matricula'] = matricula
            session['usuario_setor'] = usuario['setor']
            session['is_admin'] = 'admin' in (usuario['funcao'] or '').lower() if usuario['funcao'] else False
            session['login_time'] = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
            
            # Registrar login no histórico
            registrar_atividade(
                usuario['id'], 
                "Login", 
                f"Usuário {usuario['nome']} fez login no sistema"
            )
            
            # Redirecionar para a página de boas-vindas
            return redirect(url_for('bem_vindo'))
            
        except Exception as e:
            return render_template('identificacao.html', erro=f"Erro: {str(e)}")
        finally:
            db.desconectar()
    
    return render_template('identificacao.html')

# Rota para a página de boas-vindas
@app.route('/bem-vindo')
def bem_vindo():
    if 'usuario_nome' not in session:
        return redirect(url_for('identificacao'))
    
    # Verificar se é o usuário especial com matrícula MA201990
    if session.get('usuario_matricula') == 'MA201990':
        # Redirecionar para a página do sistema
        return redirect(url_for('sistema'))
    else:
        # Redirecionar outros usuários para a página de seleção de coletores
        return redirect(url_for('selecao_coletores'))

# Rota para o sistema principal com restrição de acesso
@app.route('/sistema')
def sistema():
    if 'usuario_id' not in session:
        return redirect(url_for('identificacao'))
    
    # Verificar se o usuário tem a matrícula específica
    if session.get('usuario_matricula') != 'MA201990':
        # Usuário sem permissão, redirecionar para seleção de coletores
        return redirect(url_for('selecao_coletores'))
    
    # Usuário autenticado com permissão, carrega a página principal
    usuario = {
        'id': session.get('usuario_id'),
        'nome': session.get('usuario_nome', 'Visitante'),
        'matricula': session.get('usuario_matricula', ''),
        'setor': session.get('usuario_setor', ''),
        'is_admin': session.get('is_admin', False),
        'ultimo_acesso': session.get('login_time', datetime.now().strftime('%d/%m/%Y %H:%M:%S'))
    }
    
    return render_template('index.html', usuario=usuario)

# Rota para a página de seleção de coletores
@app.route('/selecao-coletores')
def selecao_coletores():
    if 'usuario_id' not in session:
        return redirect(url_for('identificacao'))
    return render_template('selecao_coletores.html')

# Rota para obter informações da sessão do usuário atual via API
@app.route('/api/session/user', methods=['GET'])
def get_session_user():
    if 'usuario_id' not in session:
        return jsonify({'error': 'Não autenticado'}), 401
    
    return jsonify({
        'id': session.get('usuario_id'),
        'nome': session.get('usuario_nome'),
        'matricula': session.get('usuario_matricula'),
        'setor': session.get('usuario_setor'),
        'is_admin': session.get('is_admin', False),
        'ultimo_acesso': session.get('login_time')
    })

# Rota para logout
@app.route('/logout')
def logout():
    # Registrar logout no histórico se o usuário estiver logado
    if 'usuario_id' in session:
        registrar_atividade(
            session['usuario_id'], 
            "Logout", 
            f"Usuário {session.get('usuario_nome')} saiu do sistema"
        )
    
    # Limpar a sessão
    session.clear()
    
    # Redirecionar para a página de login
    return redirect(url_for('identificacao'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)
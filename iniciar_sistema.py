#!/usr/bin/env python
# Arquivo: iniciar_sistema_robusto.py
# Versão robusta do script de inicialização para evitar erros no Windows

import os
import sys
import signal
import threading
import time
from verificar_banco import verificar_integridade_banco, criar_usuario_admin, criar_usuario_especial
from database import BancoDeDados

# Variável global para controlar o shutdown
servidor_rodando = True

def signal_handler(signum, frame):
    """Manipulador de sinais para encerramento gracioso"""
    global servidor_rodando
    print("\nRecebido sinal de encerramento. Finalizando servidor...")
    servidor_rodando = False
    sys.exit(0)

def verificar_conexao_bd():
    """Verifica se é possível conectar ao banco de dados"""
    print("Verificando conexão com o banco de dados...")
    db = BancoDeDados()
    
    if db.conectar():
        print("Conexão com o banco de dados estabelecida com sucesso!")
        db.desconectar()
        return True
    else:
        print("ERRO: Não foi possível conectar ao banco de dados!")
        print("Verifique as configurações de conexão em database.py")
        return False

def verificar_porta_disponivel(host, porta):
    """Verifica se a porta está disponível"""
    import socket
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((host, porta))
        sock.close()
        return result != 0  # Retorna True se a porta estiver livre
    except Exception:
        return False

def iniciar_servidor():
    """Inicia o servidor Flask com tratamento robusto de erros"""
    global servidor_rodando
    
    try:
        # Importar o servidor apenas depois de verificar a conexão com o BD
        from servidor_sistema import app
        
        host = '192.168.x.x'
        porta = 5000
        
        # Verificar se a porta está disponível
        if not verificar_porta_disponivel(host, porta):
            print(f"AVISO: Porta {porta} pode estar em uso. Tentando iniciar mesmo assim...")
        
        print(f"\nIniciando o servidor Flask...")
        print(f"O sistema estará disponível em: http://{host}:{porta}")
        print("Pressione CTRL+C para encerrar o servidor")
        
        # Configurações para Windows
        os.environ['FLASK_ENV'] = 'development'
        os.environ['PYTHONDONTWRITEBYTECODE'] = '1'
        
        # Tentar diferentes configurações baseadas no ambiente
        if os.name == 'nt':  # Windows
            print("Detectado sistema Windows - usando configuração otimizada")
            
            # Primeira tentativa: sem reloader
            try:
                app.run(
                    debug=False,  # Desabilitar debug no Windows
                    host=host,
                    port=porta,
                    use_reloader=False,
                    threaded=True,
                    processes=1
                )
            except Exception as e1:
                print(f"Primeira tentativa falhou: {e1}")
                
                # Segunda tentativa: modo ainda mais simples
                try:
                    print("Tentando modo simplificado...")
                    app.run(
                        host=host,
                        port=porta,
                        debug=False,
                        use_reloader=False
                    )
                except Exception as e2:
                    print(f"Segunda tentativa falhou: {e2}")
                    
                    # Terceira tentativa: porta diferente
                    nova_porta = 5001
                    print(f"Tentando porta alternativa {nova_porta}...")
                    app.run(
                        host=host,
                        port=nova_porta,
                        debug=False,
                        use_reloader=False
                    )
        else:
            # Linux/Mac - configuração padrão
            app.run(
                debug=True,
                host=host,
                port=porta,
                use_reloader=True,
                threaded=True
            )
        
    except KeyboardInterrupt:
        print("\nServidor encerrado pelo usuário.")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"ERRO: Porta {porta} já está em uso!")
            print("Tente encerrar outros processos que possam estar usando a porta")
            print("Ou execute: netstat -ano | findstr :5000")
        else:
            print(f"ERRO de sistema: {e}")
    except Exception as e:
        print(f"ERRO inesperado ao iniciar o servidor: {e}")
        print(f"Tipo do erro: {type(e).__name__}")
        
        # Informações adicionais para debug
        import traceback
        print("\nDetalhes do erro:")
        traceback.print_exc()
    
    finally:
        servidor_rodando = False
        print("Finalizando sistema...")

def main():
    """Função principal com tratamento completo de erros"""
    try:
        # Configurar manipulador de sinais
        signal.signal(signal.SIGINT, signal_handler)
        if hasattr(signal, 'SIGTERM'):
            signal.signal(signal.SIGTERM, signal_handler)
        
        print("=== Iniciando Sistema de Controle de Coletores ===")
        print(f"Sistema operacional: {os.name}")
        print(f"Python: {sys.version}")
        
        # Verificar se é possível conectar ao banco de dados
        if not verificar_conexao_bd():
            input("Pressione Enter para sair...")
            sys.exit(1)
        
        # Verificar se o banco de dados está íntegro
        if not verificar_integridade_banco():
            input("Pressione Enter para sair...")
            sys.exit(1)
        
        # Verificar se existe um usuário administrador
        criar_usuario_admin()
        
        # Verificar se existe o usuário especial
        criar_usuario_especial()
        
        # Iniciar o servidor
        iniciar_servidor()
        
    except KeyboardInterrupt:
        print("\nPrograma interrompido pelo usuário.")
    except Exception as e:
        print(f"ERRO crítico durante a inicialização: {e}")
        import traceback
        traceback.print_exc()
        input("Pressione Enter para sair...")
    finally:
        print("Sistema finalizado.")

if __name__ == "__main__":
    main()

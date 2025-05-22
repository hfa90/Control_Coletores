#!/usr/bin/env python
# Arquivo: iniciar_sistema.py
# Este script verifica a integridade do banco de dados e inicia o servidor

import os
import sys
from verificar_banco import verificar_integridade_banco, criar_usuario_admin, criar_usuario_especial
from database import BancoDeDados

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

def iniciar_servidor():
    """Inicia o servidor Flask"""
    try:
        # Importar o servidor apenas depois de verificar a conexão com o BD
        from servidor_sistema import app
        
        print("\nIniciando o servidor Flask...")
        print("O sistema estará disponível em: http://localhost:5000")
        print("Pressione CTRL+C para encerrar o servidor")
        
        # Iniciar o servidor Flask
        app.run(debug=True, host='192.168.11.67', port=5000)
        
    except Exception as e:
        print(f"ERRO ao iniciar o servidor: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("=== Iniciando Sistema de Controle de Coletores ===")
    
    # Verificar se é possível conectar ao banco de dados
    if not verificar_conexao_bd():
        sys.exit(1)
    
    # Verificar se o banco de dados está íntegro
    if not verificar_integridade_banco():
        sys.exit(1)
    
    # Verificar se existe um usuário administrador
    criar_usuario_admin()
    
    # Verificar se existe o usuário especial
    criar_usuario_especial()
    
    # Iniciar o servidor
    iniciar_servidor()
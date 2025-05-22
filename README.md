# Sistema de Controle de Coletores - CENTRO DE DISTRIBUIÇÃO CD-AM


![Captura de tela 2025-04-21 221554](https://github.com/user-attachments/assets/0f5056d0-23b9-4b04-99bd-74831b00afce)

![Tela Admin](https://github.com/user-attachments/assets/9bedfff5-4ba7-497b-9a4c-3fbde8daeefc)

![Tel_Login](https://github.com/user-attachments/assets/723d146e-f3b7-479b-b3f0-f069ef0e439c)

![image](https://github.com/user-attachments/assets/f39a505a-7f9a-41ee-901f-428e04048214)

![image](https://github.com/user-attachments/assets/97d864a2-01d1-4981-85bb-6021477a8c20)




Um sistema web moderno para gerenciamento e controle de coletores de código de barras em centros de distribuição.

## 📋 Sobre o Sistema

O Sistema de Controle de Coletores é uma aplicação web desenvolvida para facilitar o gerenciamento de dispositivos coletores de código de barras (Honeywell EDA61k) em ambientes industriais. O sistema permite controlar a distribuição, uso e manutenção dos equipamentos de forma eficiente e organizada.

## ✨ Funcionalidades

### 👥 Gestão de Colaboradores
- Cadastro completo de colaboradores com matrícula, setor e função
- Controle de acesso baseado em níveis de permissão
- Histórico de atividades por usuário

### 📱 Controle de Coletores
- Inventário completo dos coletores com status em tempo real
- Rastreamento de uso: quem está usando, desde quando e em qual setor
- Controle de bateria e tempo de uso
- Gestão de status: Disponível, Em Uso, Manutenção, Com Problema

### 🔄 Interface de Seleção
- Interface intuitiva para colaboradores selecionarem coletores
- Sistema de devolução simples e rápido
- Validação de disponibilidade em tempo real
- Painel lateral com coletores em uso

### 📊 Relatórios e Histórico
- Histórico completo de uso dos equipamentos
- Relatórios de tempo de uso por colaborador
- Exportação de dados em formato JSON
- Registro de todas as atividades do sistema

### 🔐 Segurança
- Autenticação por matrícula
- Controle de acesso granular
- Usuário administrador com permissões especiais
- Sessões seguras com timeout automático

## 🚀 Tecnologias Utilizadas

### Backend
- **Python 3.8+** - Linguagem principal
- **Flask** - Framework web
- **PostgreSQL** - Banco de dados
- **psycopg2** - Conector PostgreSQL

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização moderna
- **JavaScript ES6+** - Interatividade
- **Font Awesome** - Ícones

### Arquitetura
- **MVC Pattern** - Separação de responsabilidades
- **REST API** - Comunicação cliente-servidor
- **Blueprint Flask** - Organização modular
- **Session Management** - Controle de estado

## 📁 Estrutura do Projeto

```
sistema-coletores/
├── templates/
│   ├── index.html              # Página principal do sistema
│   ├── selecao_coletores.html  # Interface de seleção
│   └── identificacao.html      # Página de login
├── static/
│   ├── css/
│   ├── js/
│   └── img/
├── servidor_sistema.py         # Servidor principal Flask
├── api_routes.py              # Rotas da API REST
├── database.py                # Classe de conexão com BD
├── seletor_coletores.py       # Lógica de seleção
├── iniciar_sistema.py         # Script de inicialização
├── verificar_banco.py         # Verificação da integridade do BD
├── requirements.txt           # Dependências Python
├── database_schema.sql        # Schema do banco de dados
└── README.md                  # Documentação
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Python 3.8 ou superior
- PostgreSQL 12 ou superior
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/hf90/sistema-coletores.git
cd sistema-coletores
```

### 2. Crie um ambiente virtual
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

### 3. Instale as dependências
```bash
pip install -r requirements.txt
```

### 4. Configure o banco de dados
```bash
# Acesse o PostgreSQL e crie o banco
createdb sistema_coletores

# Execute o schema do banco
psql -d sistema_coletores -f database_schema.sql
```

### 5. Configure as variáveis de ambiente
Edite o arquivo `database.py` com suas configurações:
```python
# Configurações do banco de dados
host="localhost"
database="sistema_coletores"
user="postgres"
password="sua_senha"
```

### 6. Inicie o sistema
```bash
python iniciar_sistema.py
```

O sistema estará disponível em: `http://localhost:5000`

## 👤 Usuários Padrão

### Usuário Administrador
- **Matrícula:** MA201990
- **Permissões:** Acesso completo ao sistema
- **Funcionalidades:** Gerenciar colaboradores, coletores e relatórios

### Usuários Colaboradores
- **Acesso:** Interface de seleção de coletores
- **Funcionalidades:** Selecionar e devolver coletores

## 🎯 Como Usar

### Para Colaboradores
1. Acesse o sistema e digite sua matrícula
2. Selecione um coletor disponível
3. Informe o setor e turno de trabalho
4. Use o coletor durante o expediente
5. Devolva o coletor ao final do turno

### Para Administradores
1. Faça login com a matrícula especial (MA201990)
2. Gerencie colaboradores e coletores
3. Monitore o uso em tempo real
4. Gere relatórios de uso
5. Controle manutenções e problemas

## 📊 Funcionalidades Especiais

### Dashboard em Tempo Real
- Visualização dos coletores em uso
- Status de bateria e tempo de uso
- Alertas de manutenção
- Estatísticas de uso

### Painel Lateral Dinâmico
- Lista de coletores em uso
- Tempo de uso em tempo real
- Informações do colaborador
- Atualização automática

### Sistema de Histórico
- Registro completo de todas as operações
- Auditoria de uso dos equipamentos
- Relatórios personalizáveis
- Exportação de dados

## 🔧 Configurações Avançadas

### Personalização de Setores
Edite os setores disponíveis no arquivo `templates/selecao_coletores.html`:
```html
<option value="Expedição">Expedição</option>
<option value="Armazenamento">Armazenamento</option>
<option value="Separação">Separação</option>
<!-- Adicione novos setores aqui -->
```

### Configuração de Turnos
Personalize os turnos no mesmo arquivo:
```html
<option value="1º Turno">1º Turno</option>
<option value="Intermediário">Intermediário</option>
<option value="2º Turno">2º Turno</option>
```

## 🐛 Solução de Problemas

### Erro de Conexão com Banco
```bash
# Verifique se o PostgreSQL está rodando
sudo systemctl status postgresql

# Teste a conexão
psql -h localhost -U postgres -d sistema_coletores
```

### Erro de Permissões
```bash
# Garanta que o usuário tem permissões no banco
GRANT ALL PRIVILEGES ON DATABASE sistema_coletores TO postgres;
```

### Problemas de Dependências
```bash
# Reinstale as dependências
pip install --upgrade -r requirements.txt
```

## 📈 Melhorias Futuras

- [ ] Integração com APIs de terceiros
- [ ] Notificações push para manutenção
- [ ] App mobile para colaboradores
- [ ] Dashboard analytics avançado
- [ ] Integração com sistemas ERP
- [ ] Backup automático de dados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

  Hayden Fernandes de Andrade
- Email: haydenfernandes.ti@gmail.com
- LinkedIn: https://www.linkedin.com/in/haydenfernandes
- GitHub: https://github.com/hfa90

---------------------------------------------------------------------------------------

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

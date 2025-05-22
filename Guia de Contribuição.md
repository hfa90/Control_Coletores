# Guia de Contribuição

Obrigado por considerar contribuir para o Sistema de Controle de Coletores! Este documento fornece diretrizes para contribuições.

## 🤝 Como Contribuir

### 1. Fork do Repositório
```bash
# Clone seu fork
git clone https://github.com/hf90/sistema-coletores.git
cd sistema-coletores

# Adicione o repositório original como upstream
git remote add upstream https://github.com/hf90/sistema-coletores.git
```

### 2. Configuração do Ambiente de Desenvolvimento
```bash
# Crie um ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instale as dependências
pip install -r requirements.txt

# Configure o banco de dados de teste
createdb sistema_coletores_test
psql -d sistema_coletores_test -f database_schema.sql
```

### 3. Criação de Branch
```bash
# Crie uma branch para sua feature
git checkout -b feature/nova-funcionalidade

# Ou para correção de bug
git checkout -b bugfix/correcao-bug
```

## 📝 Padrões de Código

### Python
- Siga o PEP 8
- Use type hints quando possível
- Mantenha linhas com máximo de 88 caracteres
- Use docstrings para funções e classes

```python
def exemplo_funcao(parametro: str) -> bool:
    """
    Função de exemplo que demonstra os padrões.
    
    Args:
        parametro (str): Descrição do parâmetro
        
    Returns:
        bool: Descrição do retorno
    """
    return True
```

### JavaScript
- Use ES6+ features
- Mantenha consistência na indentação (2 espaços)
- Use nomes descritivos para variáveis e funções
- Adicione comentários em lógicas complexas

### HTML/CSS
- Use indentação consistente
- Mantenha semântica HTML
- Use classes CSS descritivas
- Evite inline styles

## 🧪 Testes

### Executando Testes
```bash
# Execute todos os testes
python -m pytest

# Execute com coverage
python -m pytest --cov=.

# Execute testes específicos
python -m pytest tests/test_database.py
```

### Escrevendo Testes
- Teste todas as novas funcionalidades
- Mantenha coverage acima de 80%
- Use nomes descritivos para testes
- Teste casos de sucesso e falha

```python
def test_adicionar_coletor_sucesso():
    """Testa adição bem-sucedida de coletor"""
    # Arrange
    dados_coletor = {
        'id': '999',
        'modelo': 'Teste',
        'status': 'Disponível para Uso'
    }
    
    # Act
    resultado = db.adicionar_coletor(dados_coletor)
    
    # Assert
    assert resultado is True
```

## 🔍 Code Review

### Checklist do Pull Request
- [ ] Código segue os padrões estabelecidos
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Não há conflitos de merge
- [ ] CI/CD está passando
- [ ] Funcionalidade foi testada manualmente

### Processo de Review
1. **Revisor verifica:**
   - Funcionalidade está conforme especificação
   - Código está limpo e bem documentado
   - Testes cobrem cenários relevantes
   - Não há vulnerabilidades de segurança

2. **Autor do PR:**
   - Responde a comentários construtivamente
   - Faz ajustes solicitados
   - Mantém commits organizados

## 🐛 Reportando Bugs

### Template de Bug Report
```markdown
**Descrição do Bug**
Uma descrição clara do que o bug está causando.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

**Comportamento Esperado**
Descrição clara do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots para ajudar a explicar o problema.

**Ambiente:**
 - OS: [ex. Windows 10]
 - Browser: [ex. Chrome 96]
 - Versão do Python: [ex. 3.9]
 - Versão do PostgreSQL: [ex. 13.5]

**Contexto Adicional**
Qualquer outro contexto sobre o problema.
```

## ✨ Sugerindo Melhorias

### Template de Feature Request
```markdown
**A sua feature request está relacionada a um problema?**
Descrição clara do problema. Ex: Estou sempre frustrado quando [...]

**Descreva a solução que você gostaria**
Descrição clara do que você quer que aconteça.

**Descreva alternativas consideradas**
Descrição de soluções alternativas ou features consideradas.

**Contexto Adicional**
Qualquer outro contexto ou screenshots sobre a feature request.
```

## 📚 Tipos de Contribuição

### 🐛 Correção de Bugs
- Identifique o problema
- Crie um branch específico
- Implemente a correção
- Adicione testes de regressão
- Submeta PR com descrição detalhada

### ✨ Novas Funcionalidades
- Discuta a ideia em uma issue primeiro
- Siga o processo de design/especificação
- Implemente em pequenos commits
- Adicione documentação
- Inclua testes abrangentes

### 📖 Documentação
- Corrija erros de digitação
- Melhore explicações
- Adicione exemplos
- Traduza para outros idiomas
- Mantenha consistência de estilo

### 🎨 Interface/UX
- Melhore usabilidade
- Corrija problemas de responsividade
- Adicione acessibilidade
- Otimize performance frontend
- Mantenha consistência visual

## 🔄 Processo de Merge

### 1. Preparação
```bash
# Atualize seu fork
git fetch upstream
git checkout main
git merge upstream/main
git push origin main

# Atualize sua branch
git checkout sua-branch
git rebase main
```

### 2. Pull Request
- Título descritivo e claro
- Descrição detalhada das mudanças
- Referencie issues relacionadas
- Adicione screenshots se relevante
- Marque reviewers apropriados

### 3. Após Aprovação
- Squash commits se necessário
- Merge será feito pelo maintainer
- Branch será deletada automaticamente

## 🏗️ Estrutura do Projeto

### Diretórios Principais
```
sistema-coletores/
├── templates/          # Templates HTML
├── static/            # CSS, JS, imagens
├── tests/             # Testes automatizados
├── docs/              # Documentação adicional
├── migrations/        # Scripts de migração do BD
└── scripts/           # Scripts utilitários
```

### Arquivos de Configuração
- `database.py` - Configurações do banco
- `requirements.txt` - Dependências Python
- `database_schema.sql` - Schema do banco
- `.github/workflows/` - CI/CD

## 🚀 Deploy e Ambiente

### Ambientes
- **Development**: Desenvolvimento local
- **Testing**: Testes automatizados
- **Staging**: Pré-produção
- **Production**: Ambiente de produção

### Variáveis de Ambiente
```bash
# Desenvolvimento
DATABASE_URL=postgresql://user:pass@localhost/sistema_coletores
FLASK_ENV=development
SECRET_KEY=your-secret-key

# Produção
DATABASE_URL=postgresql://user:pass@prod-host/sistema_coletores
FLASK_ENV=production
SECRET_KEY=secure-production-key
```

## 📧 Comunicação

### Canais
- **GitHub Issues**: Bugs e feature requests
- **GitHub Discussions**: Discussões gerais
- **Pull Requests**: Code review
- **Email**: Contato direto com maintainers

### Boas Práticas
- Seja respeitoso e construtivo
- Forneça contexto suficiente
- Use templates quando disponíveis
- Acompanhe discussões que iniciou

## 🏆 Reconhecimento

Contribuidores são reconhecidos:
- Na seção de contribuidores do README
- Em releases notes para contribuições significativas
- Em commits através de co-authored-by

## 📋 Checklist Final

Antes de submeter seu PR:

- [ ] ✅ Código testado localmente
- [ ] ✅ Testes passando
- [ ] ✅ Documentação atualizada
- [ ] ✅ Padrões de código seguidos
- [ ] ✅ Commit messages descritivos
- [ ] ✅ Sem arquivos sensíveis commitados
- [ ] ✅ Branch atualizada com main
- [ ] ✅ PR template preenchido

## ❓ Dúvidas

Se você tiver dúvidas sobre como contribuir:

1. Verifique a documentação existente
2. Procure em issues fechadas
3. Abra uma issue com a tag `question`
4. Entre em contato com os maintainers

**Obrigado por contribuir! 🎉**

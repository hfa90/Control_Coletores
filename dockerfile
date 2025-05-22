# Sistema de Controle de Coletores - Dockerfile

FROM python:3.9-slim

# Metadados
LABEL maintainer="Gabriel Sousa <gabriel@exemplo.com>"
LABEL description="Sistema de Controle de Coletores para Centro de Distribuição"
LABEL version="1.0"

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primeiro (para cache do Docker)
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Criar usuário não-root para segurança
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expor porta
EXPOSE 5000

# Variáveis de ambiente
ENV FLASK_APP=servidor_sistema.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/ || exit 1

# Comando padrão
CMD ["python", "iniciar_sistema.py"]

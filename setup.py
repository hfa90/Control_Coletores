#!/usr/bin/env python
"""
Setup script para o Sistema de Controle de Coletores
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="sistema-coletores",
    version="1.0.0",
    author="Gabriel Sousa",
    author_email="gabriel@exemplo.com",
    description="Sistema de controle e gerenciamento de coletores de código de barras",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/hf90/sistema-coletores",
    project_urls={
        "Bug Tracker": "https://github.com/hf90/sistema-coletores/issues",
        "Documentation": "https://github.com/hf90/sistema-coletores/wiki",
        "Source Code": "https://github.com/hf90/sistema-coletores",
    },
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: End Users/Desktop",
        "Topic :: Office/Business :: Financial :: Point-Of-Sale",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Operating System :: OS Independent",
        "Framework :: Flask",
        "Environment :: Web Environment",
    ],
    packages=find_packages(),
    python_requires=">=3.8",
    install_requires=requirements,
    extras_require={
        "dev": [
            "pytest>=7.0",
            "pytest-flask>=1.2.0",
            "black>=23.0",
            "flake8>=6.0",
            "bandit>=1.7.0",
        ],
        "production": [
            "gunicorn>=20.1.0",
            "psycopg2-binary>=2.9.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "sistema-coletores=iniciar_sistema:main",
        ],
    },
    include_package_data=True,
    package_data={
        "": ["*.html", "*.css", "*.js", "*.sql", "*.md"],
    },
    zip_safe=False,
    keywords="coletores, barcode, inventory, management, flask, postgresql",
)

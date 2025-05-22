document.addEventListener('DOMContentLoaded', function() {
    // Encontrar o botão flutuante pelo ID
    const floatingButton = document.getElementById('openCollectorsPanel');
    
    if (floatingButton) {
        // Remover o conteúdo atual (ícone FontAwesome)
        floatingButton.innerHTML = '';
        
        // Criar a imagem SVG
        const img = document.createElement('img');
        img.src = '/static/img/icons/red-circle.svg';
        img.alt = 'Ver Coletores em Uso';
        img.style.width = '24px';
        img.style.height = '24px';
        
        // Adicionar a imagem ao botão
        floatingButton.appendChild(img);
        
        // Ajustar o estilo do botão, se necessário
        floatingButton.style.display = 'flex';
        floatingButton.style.alignItems = 'center';
        floatingButton.style.justifyContent = 'center';
    }
});
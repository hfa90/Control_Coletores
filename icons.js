// Script para adicionar ícones personalizados aos cards de estatísticas
// Salve este arquivo como /static/js/icons.js

document.addEventListener('DOMContentLoaded', function() {
    // Definir caminho base para os ícones
    const iconsPath = '/static/img/icons/';
    
    // Estrutura para mapear cada card com seu ícone correspondente
    const iconsMappings = [
        {
            elementId: 'totalCollectors',
            iconFileName: 'total-collectors.svg', // Arquivo do ícone para Total de Coletores
            parentSelector: '.stat-card-icon'
        },
        {
            elementId: 'activeCollectors',
            iconFileName: 'active-collectors.svg', // Arquivo do ícone para Em Uso Agora
            parentSelector: '.stat-card-icon'
        },
        {
            elementId: 'issueCollectors',
            iconFileName: 'problem-collectors.svg', // Arquivo do ícone para Com Problemas
            parentSelector: '.stat-card-icon'
        },
        {
            elementId: 'maintenanceCollectors',
            iconFileName: 'maintenance-collectors.svg', // Arquivo do ícone para Manutenções Pendentes
            parentSelector: '.stat-card-icon'
        }
    ];
    
    // Função para substituir os ícones existentes pelos novos
    function replaceIcons() {
        iconsMappings.forEach(mapping => {
            // Encontrar o elemento pelo ID
            const element = document.getElementById(mapping.elementId);
            
            if (element) {
                // Pegar o card pai do elemento
                const card = element.closest('.stat-card');
                
                if (card) {
                    // Encontrar o container do ícone dentro do card
                    const iconContainer = card.querySelector(mapping.parentSelector);
                    
                    if (iconContainer) {
                        // Limpar o container (remover ícone FontAwesome)
                        iconContainer.innerHTML = '';
                        
                        // Criar uma nova tag de imagem para o ícone
                        const iconImg = document.createElement('img');
                        iconImg.src = iconsPath + mapping.iconFileName;
                        iconImg.alt = mapping.elementId;
                        iconImg.style.width = '30px';
                        iconImg.style.height = '30px';
                        
                        // Adicionar a imagem ao container
                        iconContainer.appendChild(iconImg);
                    }
                }
            }
        });
    }
    
    // Chamar a função quando o DOM estiver carregado
    replaceIcons();
    
    // Opcional: Chamar novamente caso os dados sejam atualizados dinamicamente
    // (por exemplo, após o carregamento de dados ou atualização da interface)
    const refreshButtons = document.querySelectorAll('#refreshActiveCollectors, #btnLoadLocal');
    refreshButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Dar um pequeno delay para garantir que os dados foram atualizados
            setTimeout(replaceIcons, 100);
        });
    });
});
// Dados dos coletores (simulando enquanto não temos o banco de dados)
let collectors = [];

// Dados dos colaboradores (simulando enquanto não temos o banco de dados)
let users = [];

// Variável para controlar o modo de edição do usuário
let editUserId = null;

// Elementos DOM - Estatísticas
const totalCollectorsEl = document.getElementById('totalCollectors');
const activeCollectorsEl = document.getElementById('activeCollectors');
const issueCollectorsEl = document.getElementById('issueCollectors');
const maintenanceCollectorsEl = document.getElementById('maintenanceCollectors');
const activeCollectorsListEl = document.getElementById('activeCollectorsList');
const collectorsTableBodyEl = document.getElementById('collectorsTableBody');

// Elementos DOM - Coletores Modal
const collectorModal = document.getElementById('collectorModal');
const collectorForm = document.getElementById('collectorForm');
const modalTitle = document.getElementById('modalTitle');
const collectorIdInput = document.getElementById('collectorId');
const collectorSerialInput = document.getElementById('collectorSerial');
const collectorUserSelect = document.getElementById('collectorUser');
const collectorSectorSelect = document.getElementById('collectorSector');
const collectorStatusSelect = document.getElementById('collectorStatus');
const collectorBatteryInput = document.getElementById('collectorBattery');
const collectorUsageTimeInput = document.getElementById('collectorUsageTime');
const collectorIssueTextarea = document.getElementById('collectorIssue');
const collectorNotesTextarea = document.getElementById('collectorNotes');
const issueGroup = document.getElementById('issueGroup');

// Elementos DOM - Usuários Modal
const usersModal = document.getElementById('usersModal');
const usersTableBodyEl = document.getElementById('usersTableBody');
const userFormContainer = document.getElementById('userFormContainer');
const userForm = document.getElementById('userForm');
const userFormTitle = document.getElementById('userFormTitle');
const userNameInput = document.getElementById('userName');
const userCodeInput = document.getElementById('userCode');
const userSectorSelect = document.getElementById('userSector');
const userRoleInput = document.getElementById('userRole');
const userNotesTextarea = document.getElementById('userNotes');

// Botões - Principais
const btnAddCollector = document.getElementById('btnAddCollector');
const btnManageUsers = document.getElementById('btnManageUsers');
const btnExportReport = document.getElementById('btnExportReport');
const refreshActiveCollectorsBtn = document.getElementById('refreshActiveCollectors');
const btnExportJSON = document.getElementById('btnExportJSON');
const btnImportJSON = document.getElementById('btnImportJSON');
const btnSaveLocal = document.getElementById('btnSaveLocal');
const btnLoadLocal = document.getElementById('btnLoadLocal');
const openCollectorsPanelBtn = document.getElementById('openCollectorsPanel');

// Botões - Modal de Coletores
const closeModalBtn = document.getElementById('closeModal');
const cancelModalBtn = document.getElementById('cancelModal');
const saveCollectorBtn = document.getElementById('saveCollector');

// Botões - Modal de Usuários
const closeUsersModalBtn = document.getElementById('closeUsersModal');
const cancelUsersModalBtn = document.getElementById('cancelUsersModal');
const btnAddUser = document.getElementById('btnAddUser');
const cancelUserFormBtn = document.getElementById('cancelUserForm');
const saveUserBtn = document.getElementById('saveUser');

// Função para carregar coletores da API
// Função para carregar coletores da API (MODIFICADA)
function loadCollectors() {
    fetch('/api/coletores')
        .then(response => {
            // Verificar se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error(`Erro ao carregar coletores: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            collectors = data;
            updateStats();
            renderActiveCollectors();
            renderCollectorsTable();
        })
        .catch(error => {
            console.error('Erro ao carregar coletores:', error);
            // Mostrar mensagem de erro ao usuário
            alert('Erro ao conectar ao banco de dados: ' + error.message);
        });
}

// Função para carregar usuários da API (MODIFICADA)
function loadUsers() {
    fetch('/api/usuarios')
        .then(response => {
            // Verificar se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error(`Erro ao carregar usuários: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            users = data;
            updateUserSelect();
        })
        .catch(error => {
            console.error('Erro ao carregar usuários:', error);
            // Mostrar mensagem de erro ao usuário
            alert('Erro ao conectar ao banco de dados: ' + error.message);
        });
}

// Função para carregar dados mockados se a API falhar
function loadMockData() {
    // Dados mockados de coletores
    collectors = [
        {
            id: "012",
            modelo: "Honeywell EDA61k",
            numero_serie: "HD6183-6021C",
            usuario: "Pedro Lima",
            setor: "Conferência",
            status: "Ativo",
            bateria: 72,
            tempo_uso: "1h 30m",
            problema: "",
            observacoes: ""
        },
        {
            id: "023",
            modelo: "Honeywell EDA61k",
            numero_serie: "HD6183-6542D",
            usuario: "Carlos Silva",
            setor: "Armazenamento",
            status: "Com problema",
            bateria: 60,
            tempo_uso: "55m",
            problema: "Erro de leitura",
            observacoes: "Scanner não está lendo alguns códigos"
        },
        {
            id: "018",
            modelo: "Honeywell EDA61k",
            numero_serie: "HD6183-6103E",
            usuario: "Amanda Gomes",
            setor: "Separação",
            status: "Ativo",
            bateria: 45,
            tempo_uso: "3h 05m",
            problema: "",
            observacoes: ""
        }
    ];

    // Dados mockados de usuários
    users = [
        {
            id: 1,
            nome: "João Rodrigues",
            matricula: "MA12345",
            setor: "Expedição",
            funcao: "Operador",
            observacoes: "Treinado para operações de expedição"
        },
        {
            id: 2,
            nome: "Mariana Santos",
            matricula: "MA23456",
            setor: "Separação",
            funcao: "Supervisora",
            observacoes: "Responsável pelo turno da manhã"
        },
        {
            id: 3,
            nome: "Pedro Lima",
            matricula: "MA34567",
            setor: "Conferência",
            funcao: "Operador",
            observacoes: ""
        },
        {
            id: 4,
            nome: "Carlos Silva",
            matricula: "MA45678",
            setor: "Armazenamento",
            funcao: "Operador",
            observacoes: "Novo colaborador - em treinamento"
        },
        {
            id: 5,
            nome: "Amanda Gomes",
            matricula: "MA56789",
            setor: "Separação",
            funcao: "Operadora",
            observacoes: ""
        }
    ];

    // Atualizar a interface
    updateStats();
    renderActiveCollectors();
    renderCollectorsTable();
    updateUserSelect();
}

// Função para atualizar as estatísticas
function updateStats() {
    totalCollectorsEl.textContent = collectors.length;

    const activeCount = collectors.filter(c => c.status === 'Ativo').length;
    activeCollectorsEl.textContent = activeCount;

    const issueCount = collectors.filter(c => c.status === 'Com problema').length;
    issueCollectorsEl.textContent = issueCount;

    const maintenanceCount = collectors.filter(c => c.status === 'Em manutenção').length;
    maintenanceCollectorsEl.textContent = maintenanceCount;

    // Simular mudanças
    document.getElementById('activeChange').textContent = `+${Math.floor(Math.random() * 5)} desde ontem`;
    document.getElementById('issueChange').textContent = `+${Math.floor(Math.random() * 3)} desde ontem`;
    document.getElementById('maintenancePriority').textContent = `${Math.floor(Math.random() * 3)} prioritárias`;
}

// Função para renderizar a lista de coletores ativos
function renderActiveCollectors() {
    activeCollectorsListEl.innerHTML = '';

    const activeCollectors = collectors.filter(c => c.status === 'Ativo' || (c.status === 'Com problema' && c.usuario));

    activeCollectors.forEach(collector => {
        const statusClass = collector.status === 'Ativo' ? 'indicator-active' : 'indicator-warning';
        const statusText = collector.status === 'Ativo' ? 'Ativo' : collector.problema;

        // Determinar classes de avatar com base no nome do usuário
        const initials = collector.usuario ? collector.usuario.split(' ').map(n => n[0]).join('') : '--';
        const avatarIndex = collector.usuario ? (collector.usuario.charCodeAt(0) % 6) + 1 : 1;

        const collectorItem = document.createElement('div');
        collectorItem.className = 'collector-usage-item';
        collectorItem.innerHTML = `
            <div class="avatar bg-${avatarIndex}">${initials}</div>
            <div class="collector-usage-info">
                <div class="collector-id">
                    <span>Coletor #${collector.id}</span>
                    <div class="indicator ${statusClass}">
                        <div class="indicator-dot"></div>
                        <span>${statusText}</span>
                    </div>
                </div>
                <div class="collector-user">
                    <i class="fas fa-user"></i>
                    <span>${collector.usuario}</span>
                    <span class="time-badge">${collector.tempo_uso}</span>
                </div>
            </div>
        `;

        activeCollectorsListEl.appendChild(collectorItem);
    });
}

// Função para renderizar a tabela de coletores
function renderCollectorsTable() {
    collectorsTableBodyEl.innerHTML = '';

    collectors.forEach(collector => {
        let statusClass = '';
        switch (collector.status) {
            case 'Ativo':
                statusClass = 'status-active';
                break;
            case 'Inativo':
                statusClass = 'status-inactive';
                break;
            case 'Com problema':
                statusClass = 'status-warning';
                break;
            case 'Em manutenção':
                statusClass = 'status-error';
                break;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${collector.id}</td>
            <td>${collector.usuario || '-'}</td>
            <td>${collector.setor || '-'}</td>
            <td><span class="status ${statusClass}">${collector.status}</span></td>
            <td>${collector.tempo_uso || '-'}</td>
            <td>${collector.bateria}%</td>
            <td>
                <div class="actions">
                    <button class="btn-icon btn-view" data-id="${collector.id}"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon btn-edit" data-id="${collector.id}"><i class="fas fa-pen"></i></button>
                </div>
            </td>
        `;

        collectorsTableBodyEl.appendChild(row);
    });

    // Adicionar eventos aos botões de ação
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const collectorId = btn.dataset.id;
            openEditModal(collectorId);
        });
    });

    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => {
            const collectorId = btn.dataset.id;
            viewCollectorDetails(collectorId);
        });
    });
}

// Função para visualizar detalhes de um coletor
function viewCollectorDetails(collectorId) {
    const collector = collectors.find(c => c.id === collectorId);
    if (!collector) return;

    alert(`Detalhes do Coletor #${collectorId}\n\nModelo: ${collector.modelo}\nSerial: ${collector.numero_serie}\nUsuário: ${collector.usuario || '-'}\nStatus: ${collector.status}\nSetor: ${collector.setor || '-'}\nTempo de uso: ${collector.tempo_uso || '-'}\nBateria: ${collector.bateria}%\n${collector.problema ? `Problema: ${collector.problema}\n` : ''}${collector.observacoes ? `Observações: ${collector.observacoes}` : ''}`);
}

// Função para renderizar a tabela de usuários
function renderUsersTable() {
    usersTableBodyEl.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.nome}</td>
            <td>${user.matricula}</td>
            <td>${user.setor}</td>
            <td>
                <div class="actions">
                    <button class="btn-icon btn-edit-user" data-id="${user.id}"><i class="fas fa-pen"></i></button>
                    <button class="btn-icon btn-delete-user" data-id="${user.id}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;

        usersTableBodyEl.appendChild(row);
    });

    // Adicionar eventos aos botões de ação
    document.querySelectorAll('.btn-edit-user').forEach(btn => {
        btn.addEventListener('click', () => {
            const userId = parseInt(btn.dataset.id);
            openEditUserForm(userId);
        });
    });

    document.querySelectorAll('.btn-delete-user').forEach(btn => {
        btn.addEventListener('click', () => {
            const userId = parseInt(btn.dataset.id);
            if (confirm('Tem certeza que deseja remover este colaborador?')) {
                deleteUser(userId);
            }
        });
    });
}

// Função para atualizar o select de usuários
function updateUserSelect() {
    // Limpar options existentes, mantendo apenas o primeiro (vazio)
    while (collectorUserSelect.options.length > 1) {
        collectorUserSelect.remove(1);
    }

    // Adicionar usuários ao select
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.nome;
        option.textContent = user.nome;
        collectorUserSelect.appendChild(option);
    });
}

// Função para abrir o modal de edição de coletor
function openEditModal(collectorId) {
    const collector = collectors.find(c => c.id === collectorId);
    if (!collector) return;

    modalTitle.textContent = `Editar Coletor #${collectorId}`;
    collectorIdInput.value = collector.id;
    collectorIdInput.readOnly = true; // Não permitir edição do ID em modo de edição
    collectorSerialInput.value = collector.numero_serie;
    collectorUserSelect.value = collector.usuario || '';
    collectorSectorSelect.value = collector.setor || '';
    collectorStatusSelect.value = collector.status;
    collectorBatteryInput.value = collector.bateria;
    collectorUsageTimeInput.value = collector.tempo_uso || '';
    collectorIssueTextarea.value = collector.problema || '';
    collectorNotesTextarea.value = collector.observacoes || '';

    // Mostrar campo de problema se o status for problema ou manutenção
    issueGroup.style.display =
        (collector.status === 'Com problema' || collector.status === 'Em manutenção')
            ? 'block' : 'none';

    openModal();
}

// Função para abrir o modal de adição de coletor
function openAddModal() {
    modalTitle.textContent = 'Adicionar Novo Coletor';
    collectorForm.reset();
    collectorIdInput.readOnly = false; // Permitir edição do ID em modo de adição
    issueGroup.style.display = 'none';

    openModal();
}

// Função para abrir o modal de edição de usuário
function openEditUserForm(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    editUserId = userId;
    userFormTitle.textContent = `Editar Colaborador: ${user.nome}`;
    userNameInput.value = user.nome;
    userCodeInput.value = user.matricula;
    userSectorSelect.value = user.setor || '';
    userRoleInput.value = user.funcao || '';
    userNotesTextarea.value = user.observacoes || '';

    // Mostrar o formulário
    userFormContainer.style.display = 'block';


    // Definir o foco no campo de nome (NOVO)
    setTimeout(() => {
        userNameInput.focus();
    }, 100);

}

// Função para abrir o formulário de adição de usuário
function openAddUserForm() {
    editUserId = null;
    userFormTitle.textContent = 'Adicionar Colaborador';
    userForm.reset();

    // Mostrar o formulário
    userFormContainer.style.display = 'block';

    // Definir o foco no campo de nome (NOVO)
    setTimeout(() => {
        userNameInput.focus();
    }, 100);
}

// Função para deletar um usuário
function deleteUser(userId) {
    // Verificar se o usuário está associado a algum coletor
    const associatedCollector = collectors.find(c => c.usuario === users.find(u => u.id === userId)?.nome);

    if (associatedCollector) {
        alert(`Não é possível excluir este usuário pois está associado ao coletor #${associatedCollector.id}`);
        return;
    }

    // Se estiver usando a API, enviar requisição DELETE
    try {
        fetch(`/api/usuarios/${userId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert(data.erro);
                } else {
                    // Remover usuário do array local
                    users = users.filter(u => u.id !== userId);
                    renderUsersTable();
                    alert(data.mensagem || "Usuário excluído com sucesso!");
                }
            })
            .catch(error => {
                console.error('Erro ao excluir usuário na API:', error);
                // Fallback para comportamento local
                users = users.filter(u => u.id !== userId);
                renderUsersTable();
                alert("Usuário excluído com sucesso!");
            });
    } catch (error) {
        // Fallback para comportamento local em caso de erro
        users = users.filter(u => u.id !== userId);
        renderUsersTable();
        alert("Usuário excluído com sucesso!");
    }
}

// Função para abrir o modal de coletores
function openModal() {
    collectorModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Função para fechar o modal de coletores
function closeModal() {
    collectorModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Função para abrir o modal de usuários
function openUsersModal() {
    // Renderizar a tabela de usuários
    renderUsersTable();

    // Ocultar o formulário
    userFormContainer.style.display = 'none';

    // Mostrar o modal
    usersModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Função para fechar o modal de usuários
function closeUsersModal() {
    usersModal.classList.remove('active');
    document.body.style.overflow = '';
}

// REMOVER ou COMENTAR a função loadMockData() para que ela não seja usada como fallback

// Função para salvar o coletor (MODIFICADA)
function saveCollector() {
    // Verificar se o formulário é válido
    if (!collectorForm.checkValidity()) {
        collectorForm.reportValidity();
        return;
    }

    const id = collectorIdInput.value;
    const isEdit = collectorIdInput.readOnly;

    const collectorData = {
        id: id,
        modelo: "Honeywell EDA61k",
        numero_serie: collectorSerialInput.value,
        usuario: collectorUserSelect.value,
        setor: collectorSectorSelect.value,
        status: collectorStatusSelect.value,
        bateria: parseInt(collectorBatteryInput.value, 10),
        tempo_uso: collectorUsageTimeInput.value,
        problema: collectorIssueTextarea.value,
        observacoes: collectorNotesTextarea.value
    };

    // Tentar salvar na API
    const url = isEdit ? `/api/coletores/${id}` : '/api/coletores';
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(collectorData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao salvar coletor: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                alert(data.erro);
            } else {
                // Recarregar dados atualizados do servidor em vez de atualizar localmente
                loadCollectors();

                // Fechar modal
                closeModal();

                alert(data.mensagem || "Coletor salvo com sucesso!");
            }
        })
        .catch(error => {
            console.error('Erro ao salvar coletor:', error);
            alert('Erro ao salvar coletor: ' + error.message);
        });
}

// Função para salvar o usuário (MODIFICADA)
function saveUser() {
    // Verificar se o formulário é válido
    if (!userForm.checkValidity()) {
        userForm.reportValidity();
        return;
    }

    const userData = {
        nome: userNameInput.value,
        matricula: userCodeInput.value,
        setor: userSectorSelect.value,
        funcao: userRoleInput.value,
        observacoes: userNotesTextarea.value
    };

    // Tentar salvar na API
    const url = editUserId !== null ? `/api/usuarios/${editUserId}` : '/api/usuarios';
    const method = editUserId !== null ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao salvar usuário: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                alert(data.erro);
            } else {
                // Recarregar dados atualizados do servidor em vez de atualizar localmente
                loadUsers();

                // Ocultar o formulário
                userFormContainer.style.display = 'none';

                alert(data.mensagem || "Usuário salvo com sucesso!");
            }
        })
        .catch(error => {
            console.error('Erro ao salvar usuário:', error);
            alert('Erro ao salvar usuário: ' + error.message);
        });
}

// Função para excluir um usuário (MODIFICADA)
function deleteUser(userId) {
    fetch(`/api/usuarios/${userId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao excluir usuário: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                alert(data.erro);
            } else {
                // Recarregar dados atualizados do servidor em vez de atualizar localmente
                loadUsers();
                renderUsersTable();
                alert(data.mensagem || "Usuário excluído com sucesso!");
            }
        })
        .catch(error => {
            console.error('Erro ao excluir usuário:', error);
            alert('Erro ao excluir usuário: ' + error.message);
        });
}

// Função para salvar o usuário
function saveUser() {
    // Verificar se o formulário é válido
    if (!userForm.checkValidity()) {
        userForm.reportValidity();
        return;
    }

    const userData = {
        nome: userNameInput.value,
        matricula: userCodeInput.value,
        setor: userSectorSelect.value,
        funcao: userRoleInput.value,
        observacoes: userNotesTextarea.value
    };

    try {
        // Tentar salvar na API
        const url = editUserId !== null ? `/api/usuarios/${editUserId}` : '/api/usuarios';
        const method = editUserId !== null ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert(data.erro);
                } else {
                    // Atualizar os dados locais após sucesso na API
                    if (editUserId !== null) {
                        // Atualizar usuário existente
                        const index = users.findIndex(u => u.id === editUserId);
                        if (index >= 0) {
                            userData.id = editUserId;
                            users[index] = userData;
                        }
                    } else {
                        // Adicionar novo usuário com o ID retornado pela API
                        if (data.id) {
                            userData.id = data.id;
                        } else {
                            // Se a API não retornar um ID, gerar um localmente
                            userData.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
                        }
                        users.push(userData);
                    }

                    // Atualizar interface
                    renderUsersTable();
                    updateUserSelect();

                    // Ocultar o formulário
                    userFormContainer.style.display = 'none';

                    alert(data.mensagem || "Usuário salvo com sucesso!");
                }
            })
            .catch(error => {
                console.error('Erro ao salvar usuário na API:', error);
                // Fallback para comportamento local
                savingUserLocally(userData);
            });
    } catch (error) {
        // Fallback para comportamento local em caso de erro
        savingUserLocally(userData);
    }
}

// Função auxiliar para salvar usuário localmente (fallback)
function savingUserLocally(userData) {
    if (editUserId !== null) {
        // Atualizar usuário existente
        const userIndex = users.findIndex(u => u.id === editUserId);
        if (userIndex >= 0) {
            userData.id = editUserId;
            users[userIndex] = userData;
        }
    } else {
        // Verificar se já existe um usuário com esta matrícula
        const existingUser = users.find(u => u.matricula === userData.matricula);
        if (existingUser) {
            alert("Um usuário com esta matrícula já existe!");
            return;
        }

        // Adicionar novo usuário com ID gerado
        userData.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push(userData);
    }

    // Atualizar interface
    renderUsersTable();
    updateUserSelect();

    // Ocultar o formulário
    userFormContainer.style.display = 'none';

    alert("Usuário salvo com sucesso!");
}

// Função para exportar relatório
function exportReport() {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    let reportText = `RELATÓRIO DE COLETORES DROGASIL\n`;
    reportText += `Gerado em: ${date} às ${time}\n\n`;
    reportText += `Total de Coletores: ${collectors.length}\n`;
    reportText += `Ativos: ${collectors.filter(c => c.status === 'Ativo').length}\n`;
    reportText += `Com Problemas: ${collectors.filter(c => c.status === 'Com problema').length}\n`;
    reportText += `Em Manutenção: ${collectors.filter(c => c.status === 'Em manutenção').length}\n`;
    reportText += `Inativos: ${collectors.filter(c => c.status === 'Inativo').length}\n\n`;

    reportText += `LISTA DE COLETORES:\n`;
    collectors.forEach(c => {
        reportText += `\nID: #${c.id}\n`;
        reportText += `Modelo: ${c.modelo}\n`;
        reportText += `Número de Série: ${c.numero_serie}\n`;
        reportText += `Status: ${c.status}\n`;
        if (c.usuario) reportText += `Usuário: ${c.usuario}\n`;
        if (c.setor) reportText += `Setor: ${c.setor}\n`;
        reportText += `Bateria: ${c.bateria}%\n`;
        if (c.status === 'Com problema' || c.status === 'Em manutenção') {
            reportText += `Problema: ${c.problema}\n`;
        }
        if (c.observacoes) reportText += `Observações: ${c.observacoes}\n`;
    });

    reportText += `\n\nLISTA DE COLABORADORES:\n`;
    users.forEach(u => {
        reportText += `\nNome: ${u.nome}\n`;
        reportText += `Matrícula: ${u.matricula}\n`;
        reportText += `Setor: ${u.setor}\n`;
        if (u.funcao) reportText += `Função: ${u.funcao}\n`;
        if (u.observacoes) reportText += `Observações: ${u.observacoes}\n`;
    });

    // Criar um blob e um link para download
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_coletores_${date.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Função para exportar dados para JSON
function exportToJSON() {
    const data = {
        collectors: collectors,
        users: users,
        exportDate: new Date().toISOString()
    };

    // Criar um blob e um link para download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coletores-drogasil-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("Dados exportados com sucesso!");
}

// Função para importar dados de JSON
function importFromJSON() {
    // Criar um input de arquivo temporário
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);

                // Validar os dados
                if (!importedData.collectors || !Array.isArray(importedData.collectors) ||
                    !importedData.users || !Array.isArray(importedData.users)) {
                    throw new Error('O arquivo não contém dados válidos.');
                }

                // Confirmar a substituição de dados
                const replaceConfirm = confirm("Deseja substituir os dados existentes? Clique em OK para substituir ou Cancelar para mesclar com os dados atuais.");

                if (replaceConfirm) {
                    // Substituir todos os dados
                    collectors = importedData.collectors;
                    users = importedData.users;
                } else {
                    // Mesclar dados (preservar existentes e adicionar novos)
                    // Para coletores, verificar por ID
                    importedData.collectors.forEach(importedCollector => {
                        const existingIndex = collectors.findIndex(c => c.id === importedCollector.id);
                        if (existingIndex >= 0) {
                            collectors[existingIndex] = importedCollector;
                        } else {
                            collectors.push(importedCollector);
                        }
                    });

                    // Para usuários, verificar por ID
                    importedData.users.forEach(importedUser => {
                        const existingIndex = users.findIndex(u => u.id === importedUser.id);
                        if (existingIndex >= 0) {
                            users[existingIndex] = importedUser;
                        } else {
                            users.push(importedUser);
                        }
                    });
                }

                // Atualizar interface
                updateStats();
                renderActiveCollectors();
                renderCollectorsTable();
                updateUserSelect();

                alert("Dados importados com sucesso!");

            } catch (error) {
                alert(`Erro ao importar dados: ${error.message}`);
                console.error('Erro ao importar dados:', error);
            }
        };

        reader.onerror = () => {
            alert("Erro ao ler o arquivo.");
        };

        reader.readAsText(file);
    };

    input.click();
}

// Funções para persistência de dados no localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('collectors', JSON.stringify(collectors));
        localStorage.setItem('users', JSON.stringify(users));
        alert('Dados salvos com sucesso no navegador!');
    } catch (error) {
        alert('Erro ao salvar dados: ' + error.message);
        console.error('Erro ao salvar no localStorage:', error);
    }
}

// Correção para o método de carregar dados do localStorage (MODIFICADA)
function loadFromLocalStorage() {
    try {
        const savedCollectors = localStorage.getItem('collectors');
        const savedUsers = localStorage.getItem('users');

        if (savedCollectors) {
            collectors = JSON.parse(savedCollectors);
            updateStats();
            renderActiveCollectors();
            renderCollectorsTable();
        }

        if (savedUsers) {
            users = JSON.parse(savedUsers);
            updateUserSelect();
        }

        alert('Dados carregados com sucesso do navegador!');

        // Perguntar se deseja sincronizar com o banco de dados
        if (confirm('Deseja sincronizar esses dados com o banco de dados?')) {
            // Aqui você poderia implementar a sincronização
            // Por exemplo, enviar cada item para a API
            alert('Função de sincronização com o banco de dados será implementada em breve.');
        }
    } catch (error) {
        alert('Erro ao carregar dados: ' + error.message);
        console.error('Erro ao carregar do localStorage:', error);
    }
}

// Função para criar o painel administrativo
function createAdminPanel() {
    // Verificar se o painel já existe
    if (document.getElementById('adminPanel')) {
        toggleAdminPanel();
        return;
    }

    // Criar o container do painel
    const adminPanel = document.createElement('div');
    adminPanel.id = 'adminPanel';
    adminPanel.className = 'admin-panel';
    adminPanel.style.transform = 'translateY(-10px)';
    adminPanel.style.opacity = '0';

    // Criar o cabeçalho do painel
    const panelHeader = document.createElement('div');
    panelHeader.className = 'admin-panel-header';

    const panelTitle = document.createElement('h3');
    panelTitle.className = 'admin-panel-title';
    panelTitle.textContent = 'Painel do Administrador';

    const closeButton = document.createElement('button');
    closeButton.className = 'admin-panel-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = toggleAdminPanel;

    panelHeader.appendChild(panelTitle);
    panelHeader.appendChild(closeButton);

    // Criar o corpo do painel
    const panelBody = document.createElement('div');
    panelBody.className = 'admin-panel-body';

    // Adicionar ações de administrador
    const actions = [
        { icon: 'fas fa-user-shield', text: 'Gerenciar Permissões', action: () => alert('Módulo de Permissões será aberto') },
        { icon: 'fas fa-cog', text: 'Configurações do Sistema', action: () => alert('Configurações do Sistema serão abertas') },
        { icon: 'fas fa-database', text: 'Backup de Dados', action: exportToJSON },
        { icon: 'fas fa-file-import', text: 'Importar Dados', action: importFromJSON },
        { icon: 'fas fa-chart-line', text: 'Relatórios Avançados', action: () => alert('Módulo de Relatórios Avançados será aberto') },
        { icon: 'fas fa-history', text: 'Histórico de Atividades', action: showActivityLog }
    ];

    actions.forEach(item => {
        const actionButton = document.createElement('button');
        actionButton.className = 'admin-action-btn';

        const icon = document.createElement('i');
        icon.className = item.icon;

        const text = document.createElement('span');
        text.textContent = item.text;

        actionButton.appendChild(icon);
        actionButton.appendChild(text);
        actionButton.onclick = item.action;

        panelBody.appendChild(actionButton);
    });

    // Adicionar informações do usuário
    const userInfoSection = document.createElement('div');
    userInfoSection.className = 'user-info-section';

    const userTitle = document.createElement('div');
    userTitle.className = 'user-info-title';
    userTitle.textContent = 'Informações do Usuário';

    const userDetails = document.createElement('div');
    userDetails.className = 'user-info-details';
    userDetails.innerHTML = `
        <div class="user-info-item"><strong>Usuário:</strong> Administrador</div>
        <div class="user-info-item"><strong>Nível:</strong> Super Admin</div>
        <div class="user-info-item"><strong>Último acesso:</strong> ${new Date().toLocaleString()}</div>
    `;

    // Botão de logout
    const logoutButton = document.createElement('button');
    logoutButton.className = 'btn btn-primary logout-btn';
    logoutButton.innerHTML = '<i class="fas fa-sign-out-alt" style="margin-right: 5px;"></i> Sair';
    logoutButton.onclick = () => {
        if (confirm("Tem certeza que deseja sair do sistema?")) {
            alert("Em um sistema real, você seria redirecionado para a tela de login.");
        }
    };

    userInfoSection.appendChild(userTitle);
    userInfoSection.appendChild(userDetails);
    userInfoSection.appendChild(logoutButton);

    panelBody.appendChild(userInfoSection);

    // Adicionar elementos ao painel
    adminPanel.appendChild(panelHeader);
    adminPanel.appendChild(panelBody);

    // Adicionar o painel ao corpo do documento
    document.body.appendChild(adminPanel);

    // Exibir o painel com animação
    setTimeout(() => {
        adminPanel.style.transform = 'translateY(0)';
        adminPanel.style.opacity = '1';
    }, 10);
}

// Função para alternar a visibilidade do painel de administrador
function toggleAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (!adminPanel) return;

    if (adminPanel.style.opacity === '1') {
        adminPanel.style.transform = 'translateY(-10px)';
        adminPanel.style.opacity = '0';

        // Remover o painel após a animação
        setTimeout(() => {
            if (adminPanel && adminPanel.parentNode) {
                adminPanel.parentNode.removeChild(adminPanel);
            }
        }, 300);
    } else {
        adminPanel.style.transform = 'translateY(0)';
        adminPanel.style.opacity = '1';
    }
}

// Função para mostrar o histórico de atividades
function showActivityLog() {
    // Criar dados simulados para o histórico
    const activities = [
        { user: 'Admin', action: 'Adicionou novo coletor #045', time: '18/04/2025 09:32' },
        { user: 'Carlos Silva', action: 'Reportou problema no coletor #023', time: '18/04/2025 08:15' },
        { user: 'Amanda Gomes', action: 'Devolveu o coletor #018', time: '17/04/2025 17:45' },
        { user: 'Admin', action: 'Exportou relatório de coletores', time: '17/04/2025 15:20' },
        { user: 'Pedro Lima', action: 'Retirou o coletor #012', time: '17/04/2025 09:05' },
        { user: 'Admin', action: 'Adicionou novo usuário: João Rodrigues', time: '16/04/2025 14:30' }
    ];

    // Criar a estrutura do modal
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop active';
    modalBackdrop.id = 'activityLogModal';

    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
        <div class="modal-header">
            <h3 class="modal-title">Histórico de Atividades</h3>
            <button class="modal-close" id="closeActivityLog">&times;</button>
        </div>
        <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
            <table class="activity-log-table">
                <thead>
                    <tr>
                        <th>Data/Hora</th>
                        <th>Usuário</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    ${activities.map(activity => `
                        <tr>
                            <td>${activity.time}</td>
                            <td>${activity.user}</td>
                            <td>${activity.action}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" id="exportActivityLog">Exportar Histórico</button>
            <button class="btn btn-outline" id="closeActivityLogBtn">Fechar</button>
        </div>
    `;

    modalBackdrop.appendChild(modal);
    document.body.appendChild(modalBackdrop);

    // Adicionar eventos
    document.getElementById('closeActivityLog').addEventListener('click', () => {
        document.body.removeChild(modalBackdrop);
    });

    document.getElementById('closeActivityLogBtn').addEventListener('click', () => {
        document.body.removeChild(modalBackdrop);
    });

    document.getElementById('exportActivityLog').addEventListener('click', () => {
        alert('Em um sistema real, o histórico seria exportado em formato CSV ou PDF.');
    });
}

// Função para criar o painel flutuante de Coletores em Uso
function createCollectorsPanel() {
    // Verificar se o painel já existe
    if (document.getElementById('collectorsFloatingPanel')) {
        toggleCollectorsPanel();
        return;
    }

    // Obter os dados dos coletores em uso
    const activeCollectors = collectors.filter(c => c.status === 'Ativo' || (c.status === 'Com problema' && c.usuario));

    // Criar o container do painel
    const collectorsPanel = document.createElement('div');
    collectorsPanel.id = 'collectorsFloatingPanel';
    collectorsPanel.style.transform = 'translateY(-10px)';
    collectorsPanel.style.opacity = '0';

    // Criar o cabeçalho do painel
    const panelHeader = document.createElement('div');
    panelHeader.className = 'admin-panel-header';

    const panelTitle = document.createElement('h3');
    panelTitle.className = 'admin-panel-title';
    panelTitle.textContent = 'Coletores em Uso Agora';

    const closeButton = document.createElement('button');
    closeButton.className = 'admin-panel-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = toggleCollectorsPanel;

    panelHeader.appendChild(panelTitle);
    panelHeader.appendChild(closeButton);

    // Criar o corpo do painel
    const panelBody = document.createElement('div');
    panelBody.style.padding = '10px';
    panelBody.style.maxHeight = '400px';
    panelBody.style.overflowY = 'auto';

    // Adicionar os coletores em uso
    if (activeCollectors.length > 0) {
        activeCollectors.forEach(collector => {
            const statusClass = collector.status === 'Ativo' ? 'indicator-active' : 'indicator-warning';
            const statusText = collector.status === 'Ativo' ? 'Ativo' : collector.problema;

            // Determinar classes de avatar com base no nome do usuário
            const initials = collector.usuario ? collector.usuario.split(' ').map(n => n[0]).join('') : '--';
            const avatarIndex = collector.usuario ? (collector.usuario.charCodeAt(0) % 6) + 1 : 1;

            // Container principal do item
            const collectorItem = document.createElement('div');
            collectorItem.className = 'collector-usage-item';

            // Avatar
            const avatarDiv = document.createElement('div');
            avatarDiv.className = `avatar bg-${avatarIndex}`;
            avatarDiv.textContent = initials;

            // Informações do coletor
            const infoDiv = document.createElement('div');
            infoDiv.className = 'collector-usage-info';

            // ID e status do coletor
            const idDiv = document.createElement('div');
            idDiv.className = 'collector-id';

            const idSpan = document.createElement('span');
            idSpan.textContent = `Coletor #${collector.id}`;

            const statusDiv = document.createElement('div');
            statusDiv.className = `indicator ${statusClass}`;

            const statusDot = document.createElement('div');
            statusDot.className = 'indicator-dot';

            const statusSpan = document.createElement('span');
            statusSpan.textContent = statusText;

            statusDiv.appendChild(statusDot);
            statusDiv.appendChild(statusSpan);

            idDiv.appendChild(idSpan);
            idDiv.appendChild(statusDiv);

            // Usuário e tempo de uso
            const userDiv = document.createElement('div');
            userDiv.className = 'collector-user';

            const userIcon = document.createElement('i');
            userIcon.className = 'fas fa-user';

            const userSpan = document.createElement('span');
            userSpan.textContent = collector.usuario;

            const timeSpan = document.createElement('span');
            timeSpan.className = 'time-badge';
            timeSpan.textContent = collector.tempo_uso;

            userDiv.appendChild(userIcon);
            userDiv.appendChild(userSpan);
            userDiv.appendChild(timeSpan);

            infoDiv.appendChild(idDiv);
            infoDiv.appendChild(userDiv);

            // Container para o botão de excluir
            const actionDiv = document.createElement('div');
            actionDiv.style.marginLeft = 'auto';

            // Botão de excluir
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn-icon';
            deleteButton.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
            deleteButton.style.color = 'var(--danger)';
            deleteButton.setAttribute('data-id', collector.id);

            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash';
            deleteButton.appendChild(deleteIcon);

            // Adicionar efeito hover
            deleteButton.onmouseover = function () {
                this.style.backgroundColor = 'var(--danger)';
                this.style.color = 'white';
            };
            deleteButton.onmouseout = function () {
                this.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                this.style.color = 'var(--danger)';
            };

            // Adicionar evento de clique para excluir o coletor
            deleteButton.addEventListener('click', function () {
                const collectorId = this.getAttribute('data-id');
                if (confirm(`Tem certeza que deseja excluir o Coletor #${collectorId}?`)) {
                    // Tentar excluir na API
                    try {
                        fetch(`/api/coletores/${collectorId}`, {
                            method: 'DELETE'
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.erro) {
                                    alert(data.erro);
                                } else {
                                    // Remover localmente
                                    collectors = collectors.filter(c => c.id !== collectorId);
                                    updateStats();
                                    renderActiveCollectors();
                                    renderCollectorsTable();
                                    toggleCollectorsPanel();
                                    createCollectorsPanel();
                                    alert(data.mensagem || `Coletor #${collectorId} excluído com sucesso!`);
                                }
                            })
                            .catch(error => {
                                console.error('Erro ao excluir coletor na API:', error);
                                // Fallback para exclusão local
                                collectors = collectors.filter(c => c.id !== collectorId);
                                updateStats();
                                renderActiveCollectors();
                                renderCollectorsTable();
                                toggleCollectorsPanel();
                                createCollectorsPanel();
                                alert(`Coletor #${collectorId} excluído com sucesso!`);
                            });
                    } catch (error) {
                        // Fallback para exclusão local
                        collectors = collectors.filter(c => c.id !== collectorId);
                        updateStats();
                        renderActiveCollectors();
                        renderCollectorsTable();
                        toggleCollectorsPanel();
                        createCollectorsPanel();
                        alert(`Coletor #${collectorId} excluído com sucesso!`);
                    }
                }
            });

            actionDiv.appendChild(deleteButton);

            // Montar o item completo
            collectorItem.appendChild(avatarDiv);
            collectorItem.appendChild(infoDiv);
            collectorItem.appendChild(actionDiv);

            panelBody.appendChild(collectorItem);
        });
    } else {
        // Mensagem para quando não há coletores em uso
        const noCollectorsMsg = document.createElement('div');
        noCollectorsMsg.style.padding = '20px';
        noCollectorsMsg.style.textAlign = 'center';
        noCollectorsMsg.style.color = 'var(--gray)';
        noCollectorsMsg.innerHTML = '<i class="fas fa-info-circle" style="margin-right: 5px;"></i> Não há coletores em uso no momento.';
        panelBody.appendChild(noCollectorsMsg);
    }

    // Adicionar botão de atualizar
    const refreshBtn = document.createElement('div');
    refreshBtn.style.padding = '15px';
    refreshBtn.style.textAlign = 'center';
    refreshBtn.style.borderTop = '1px solid var(--gray-light)';

    const btnRefresh = document.createElement('button');
    btnRefresh.className = 'btn btn-outline';
    btnRefresh.innerHTML = '<i class="fas fa-sync"></i> Atualizar';
    btnRefresh.style.width = '100%';
    btnRefresh.onclick = function () {
        document.body.removeChild(collectorsPanel);
        createCollectorsPanel();
    };

    refreshBtn.appendChild(btnRefresh);

    // Adicionar elementos ao painel
    collectorsPanel.appendChild(panelHeader);
    collectorsPanel.appendChild(panelBody);
    collectorsPanel.appendChild(refreshBtn);

    // Adicionar o painel ao corpo do documento
    document.body.appendChild(collectorsPanel);

    // Exibir o painel com animação
    setTimeout(() => {
        collectorsPanel.style.transform = 'translateY(0)';
        collectorsPanel.style.opacity = '1';
    }, 10);
}

// Função para alternar a visibilidade do painel de coletores
function toggleCollectorsPanel() {
    const collectorsPanel = document.getElementById('collectorsFloatingPanel');
    if (!collectorsPanel) return;

    if (collectorsPanel.style.opacity === '1') {
        collectorsPanel.style.transform = 'translateY(-10px)';
        collectorsPanel.style.opacity = '0';

        // Remover o painel após a animação
        setTimeout(() => {
            if (collectorsPanel && collectorsPanel.parentNode) {
                collectorsPanel.parentNode.removeChild(collectorsPanel);
            }
        }, 300);
    } else {
        collectorsPanel.style.transform = 'translateY(0)';
        collectorsPanel.style.opacity = '1';
    }
}

// Event Listeners - Principais
document.addEventListener('DOMContentLoaded', function () {
    // Carregar os dados do banco de dados ou usar dados mockados
    loadCollectors();
    loadUsers();

    // Configurar eventos para os botões
    btnAddCollector.addEventListener('click', openAddModal);
    btnManageUsers.addEventListener('click', openUsersModal);
    btnExportReport.addEventListener('click', exportReport);
    refreshActiveCollectorsBtn.addEventListener('click', renderActiveCollectors);
    btnExportJSON.addEventListener('click', exportToJSON);
    btnImportJSON.addEventListener('click', importFromJSON);
    btnSaveLocal.addEventListener('click', saveToLocalStorage);
    btnLoadLocal.addEventListener('click', loadFromLocalStorage);
    openCollectorsPanelBtn.addEventListener('click', createCollectorsPanel);

    // Event Listeners - Modal de Coletores
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    saveCollectorBtn.addEventListener('click', saveCollector);

    // Event Listeners - Modal de Usuários
    closeUsersModalBtn.addEventListener('click', closeUsersModal);
    cancelUsersModalBtn.addEventListener('click', closeUsersModal);
    btnAddUser.addEventListener('click', openAddUserForm);
    cancelUserFormBtn.addEventListener('click', () => {
        userFormContainer.style.display = 'none';
    });
    saveUserBtn.addEventListener('click', saveUser);

    // Mostrar/ocultar campo de problema com base no status
    collectorStatusSelect.addEventListener('change', () => {
        issueGroup.style.display =
            (collectorStatusSelect.value === 'Com problema' || collectorStatusSelect.value === 'Em manutenção')
                ? 'block' : 'none';
    });

    // Adicionar evento para o painel de administrador
    document.querySelector('.user-info').addEventListener('click', createAdminPanel);
});

// Adicionar evento para o botão de logout rápido se existir
const quickLogoutBtn = document.getElementById('quickLogout');
if (quickLogoutBtn) {
    quickLogoutBtn.addEventListener('click', () => {
        if (confirm("Tem certeza que deseja sair do sistema?")) {
            window.location.href = '/logout';
        }
    });
}

// Função para buscar informações de sessão do usuário
function fetchUserSessionInfo() {
    // Em um ambiente real, esta seria uma chamada AJAX ao servidor
    // Aqui usaremos a variável global window.userInfo que foi definida no index.html

    if (!window.userInfo) {
        console.error('Informações do usuário não disponíveis');
        return;
    }

    // Atualizar a exibição do nome do usuário no cabeçalho
    updateUserHeaderInfo(window.userInfo);
}

// Função para atualizar as informações do usuário no cabeçalho
function updateUserHeaderInfo(userInfo) {
    if (!userInfo) return;

    const userInfoElement = document.querySelector('.user-info span');
    if (userInfoElement) {
        if (userInfo.matricula) {
            userInfoElement.textContent = `${userInfo.nome} (${userInfo.matricula})`;
        } else {
            userInfoElement.textContent = userInfo.nome;
        }
    }
}

// Função para exportar histórico de atividades
function exportActivityLog(activities) {
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    let reportText = `HISTÓRICO DE ATIVIDADES - SISTEMA DE COLETORES\n`;
    reportText += `Gerado em: ${new Date().toLocaleString()}\n\n`;

    reportText += `DATA/HORA\t\tUSUÁRIO\t\tAÇÃO\t\tDETALHES\n`;
    reportText += `${'='.repeat(100)}\n`;

    activities.forEach(activity => {
        reportText += `${activity.data_hora}\t${activity.usuario}\t\t${activity.acao}\t${activity.detalhes || ''}\n`;
    });

    // Criar um blob e um link para download
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico_atividades_${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("Histórico exportado com sucesso!");
}

// Função para buscar histórico de atividades (simulada)
function fetchHistoricoAtividades() {
    // Em um ambiente real, isso seria uma chamada AJAX para o servidor
    // Como simulação, vamos criar dados fictícios
    return new Promise((resolve) => {
        setTimeout(() => {
            const activities = [
                { data_hora: '18/04/2025 09:32', usuario: 'Admin', acao: 'Adicionou', detalhes: 'Adicionou novo coletor #045' },
                { data_hora: '18/04/2025 08:15', usuario: 'Carlos Silva', acao: 'Reportou problema', detalhes: 'Reportou problema no coletor #023' },
                { data_hora: '17/04/2025 17:45', usuario: 'Amanda Gomes', acao: 'Devolveu', detalhes: 'Devolveu o coletor #018' },
                { data_hora: '17/04/2025 15:20', usuario: 'Admin', acao: 'Exportou', detalhes: 'Exportou relatório de coletores' },
                { data_hora: '17/04/2025 09:05', usuario: 'Pedro Lima', acao: 'Retirou', detalhes: 'Retirou o coletor #012' },
                { data_hora: '16/04/2025 14:30', usuario: 'Admin', acao: 'Adicionou', detalhes: 'Adicionou novo usuário: João Rodrigues' }
            ];
            resolve(activities);
        }, 500);
    });
}

// Adicionar esta função ao arquivo script.js

// Variável global para armazenar se o usuário tem permissão especial
let temPermissaoEspecial = false;

// Função para verificar se o usuário tem permissão para gerenciar colaboradores
// Atualizar a função de verificação de permissão especial no arquivo script.js

/**
 * Verifica se o usuário atual tem permissão especial
 * Tenta primeiro a rota principal e, se falhar, usa a rota alternativa
 */
function verificarPermissaoEspecial() {
    fetch('/api/check_permissao_especial')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na primeira verificação: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            temPermissaoEspecial = data.permissao;

            // Atualizar a interface com base na permissão
            atualizarBotoesGerenciamento();

            // Configurar evento do botão após determinar as permissões
            configurarEventoBotaoGerenciarUsuarios();
        })
        .catch(error => {
            console.error('Erro na primeira verificação de permissão. Tentando método alternativo:', error);

            // Tentar o método alternativo de verificação
            fetch('/api/usuario_permissao_especial')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro na verificação alternativa: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    temPermissaoEspecial = data.permissao;

                    // Atualizar a interface com base na permissão
                    atualizarBotoesGerenciamento();

                    // Configurar evento do botão após determinar as permissões
                    configurarEventoBotaoGerenciarUsuarios();
                })
                .catch(secondError => {
                    console.error('Erro na verificação alternativa de permissão:', secondError);
                    temPermissaoEspecial = false;
                    atualizarBotoesGerenciamento();
                    configurarEventoBotaoGerenciarUsuarios();
                });
        });
}

// Também adicionar uma mensagem de depuração para quando o usuário fizer login
// Adicionar esta parte no método DOMContentLoaded

document.addEventListener('DOMContentLoaded', function () {
    // ... código existente ...

    // Verificar e exibir informações de depuração sobre o usuário atual
    fetch('/api/session/user')
        .then(response => response.json())
        .then(data => {
            console.log('Usuário atual:', data);
            console.log('Matrícula atual:', data.matricula);

            // Verificar se é o usuário especial
            if (data.matricula === 'MA201990') {
                console.log('✓ Usuário com permissão especial detectado!');
            }
        })
        .catch(error => console.error('Erro ao verificar sessão do usuário:', error));
});

// Função para atualizar os botões de gerenciamento com base na permissão
function atualizarBotoesGerenciamento() {
    // Botão principal de gerenciar colaboradores
    const btnManageUsers = document.getElementById('btnManageUsers');

    if (btnManageUsers) {
        if (temPermissaoEspecial) {
            btnManageUsers.style.display = 'flex';
        } else {
            btnManageUsers.style.display = 'none';
        }




    }

    // Modal de usuários - botão de adicionar
    const btnAddUser = document.getElementById('btnAddUser');
    if (btnAddUser) {
        btnAddUser.style.display = temPermissaoEspecial ? 'block' : 'none';
    }

    // Botões de editar e excluir usuários (estes são criados dinamicamente)
    const actionsButtons = document.querySelectorAll('.btn-edit-user, .btn-delete-user');
    actionsButtons.forEach(btn => {
        btn.style.display = temPermissaoEspecial ? 'flex' : 'none';
    });
}

// Modificar a função renderUsersTable para aplicar as permissões
function renderUsersTable() {
    usersTableBodyEl.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.nome}</td>
            <td>${user.matricula}</td>
            <td>${user.setor}</td>
            <td>
                <div class="actions">
                    <button class="btn-icon btn-edit-user" data-id="${user.id}" style="display: ${temPermissaoEspecial ? 'flex' : 'none'}"><i class="fas fa-pen"></i></button>
                    <button class="btn-icon btn-delete-user" data-id="${user.id}" style="display: ${temPermissaoEspecial ? 'flex' : 'none'}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;

        usersTableBodyEl.appendChild(row);
    });

    // Adicionar eventos aos botões de ação se o usuário tiver permissão
    if (temPermissaoEspecial) {
        document.querySelectorAll('.btn-edit-user').forEach(btn => {
            btn.addEventListener('click', () => {
                const userId = parseInt(btn.dataset.id);
                openEditUserForm(userId);
            });
        });

        document.querySelectorAll('.btn-delete-user').forEach(btn => {
            btn.addEventListener('click', () => {
                const userId = parseInt(btn.dataset.id);
                if (confirm('Tem certeza que deseja remover este colaborador?')) {
                    deleteUser(userId);
                }
            });
        });
    }
}

// Modificar a função openUsersModal para garantir que as permissões sejam verificadas
function openUsersModal() {
    // Verificar permissões antes de abrir o modal
    verificarPermissaoEspecial();

    // Renderizar a tabela de usuários
    renderUsersTable();

    // Ocultar o formulário
    userFormContainer.style.display = 'none';

    // Mostrar o modal
    usersModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Modificar as funções saveUser e deleteUser para verificar permissões antes de enviar requisições
function saveUser() {
    // Verificar se tem permissão para manipular usuários
    if (!temPermissaoEspecial) {
        alert('Você não tem permissão para adicionar ou editar colaboradores. Apenas o usuário com matrícula MA201990 pode realizar esta ação.');
        return;
    }

    // O resto da função permanece igual...
    // Verificar se o formulário é válido
    if (!userForm.checkValidity()) {
        userForm.reportValidity();
        return;
    }

    const userData = {
        nome: userNameInput.value,
        matricula: userCodeInput.value,
        setor: userSectorSelect.value,
        funcao: userRoleInput.value,
        observacoes: userNotesTextarea.value
    };

    // Tentar salvar na API
    const url = editUserId !== null ? `/api/usuarios/${editUserId}` : '/api/usuarios';
    const method = editUserId !== null ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.erro || `Erro ao salvar usuário: ${response.status} ${response.statusText}`);
                });
            }
            return response.json();
        })
        .then(data => {
            // Recarregar dados atualizados do servidor
            loadUsers();

            // Ocultar o formulário
            userFormContainer.style.display = 'none';

            alert(data.mensagem || "Usuário salvo com sucesso!");
        })
        .catch(error => {
            console.error('Erro ao salvar usuário:', error);
            alert(error.message);
        });
}

function deleteUser(userId) {
    // Verificar se tem permissão para manipular usuários
    if (!temPermissaoEspecial) {
        alert('Você não tem permissão para excluir colaboradores. Apenas o usuário com matrícula MA201990 pode realizar esta ação.');
        return;
    }

    fetch(`/api/usuarios/${userId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.erro || `Erro ao excluir usuário: ${response.status} ${response.statusText}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                alert(data.erro);
            } else {
                // Recarregar dados atualizados do servidor
                loadUsers();
                renderUsersTable();
                alert(data.mensagem || "Usuário excluído com sucesso!");
            }
        })
        .catch(error => {
            console.error('Erro ao excluir usuário:', error);
            alert(error.message);
        });
}

// Adicionar chamada inicial para verificar permissões quando o documento for carregado
document.addEventListener('DOMContentLoaded', function () {
    // Verificar permissões após carregar a página
    verificarPermissaoEspecial();

    // Resto do código existente...
    // Carregar os dados do banco de dados ou usar dados mockados
    loadCollectors();
    loadUsers();

    // ... (outros event listeners)
});

// Adicionar esta função ao arquivo script.js

// Função para exibir aviso de permissão negada
function exibirAvisoPermissao() {
    // Criar o container do aviso
    const avisoContainer = document.createElement('div');
    avisoContainer.className = 'modal-backdrop active';
    avisoContainer.id = 'avisoPermissao';
    avisoContainer.style.zIndex = '2000'; // Garantir que fique acima de outros modais

    const avisoModal = document.createElement('div');
    avisoModal.className = 'modal';
    avisoModal.style.maxWidth = '450px';

    avisoModal.innerHTML = `
        <div class="modal-header" style="background-color: var(--danger); color: white;">
            <h3 class="modal-title">Permissão Negada</h3>
            <button class="modal-close" id="fecharAviso">&times;</button>
        </div>
        <div class="modal-body">
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-lock" style="font-size: 48px; color: var(--danger); margin-bottom: 15px;"></i>
                <p>Você não tem permissão para gerenciar colaboradores.</p>
                <p style="margin-top: 10px;"><strong>Apenas o usuário com matrícula MA201990 pode realizar esta ação.</strong></p>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" id="entendidoBtn">Entendido</button>
        </div>
    `;

    avisoContainer.appendChild(avisoModal);
    document.body.appendChild(avisoContainer);

    // Adicionar eventos aos botões
    document.getElementById('fecharAviso').addEventListener('click', () => {
        document.body.removeChild(avisoContainer);
    });

    document.getElementById('entendidoBtn').addEventListener('click', () => {
        document.body.removeChild(avisoContainer);
    });
}

// Modificar a função de clique no botão de gerenciar usuários
document.addEventListener('DOMContentLoaded', function () {
    // ... (outros eventos do DOMContentLoaded)

    // Modificar o evento de clique no botão de gerenciar usuários
    btnManageUsers.addEventListener('click', function () {
        if (temPermissaoEspecial) {
            openUsersModal();
        } else {
            exibirAvisoPermissao();
        }
    });


});

// Adicionar esta função ao arquivo script.js

/**
 * Exibe uma notificação ao usuário especial após o login
 * Esta função deve ser chamada na página principal do sistema
 */
function verificarEExibirNotificacaoUsuarioEspecial() {
    // Verificar se o usuário tem privilégios especiais
    fetch('/api/check_permissao_especial')
        .then(response => response.json())
        .then(data => {
            if (data.permissao) {
                // Criar a notificação
                exibirNotificacaoUsuarioEspecial();
            }
        })
        .catch(error => {
            console.error('Erro ao verificar permissão para notificação:', error);
        });
}

/**
 * Cria e exibe uma notificação flutuante para o usuário especial
 */
function exibirNotificacaoUsuarioEspecial() {
    // Verificar se o usuário já viu esta notificação hoje
    const hoje = new Date().toDateString();
    const notificacaoJaVista = localStorage.getItem('notificacaoEspecialVista') === hoje;

    if (notificacaoJaVista) {
        return; // Não mostrar a notificação novamente no mesmo dia
    }

    // Criar o elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao-especial';
    notificacao.innerHTML = `
        <div class="notificacao-conteudo">
            <div class="notificacao-icone">
                <i class="fas fa-key"></i>
            </div>
            <div class="notificacao-texto">
                <h4>Acesso Privilegiado</h4>
                <p>Você possui permissão especial para gerenciar colaboradores no sistema.</p>
            </div>
            <button class="notificacao-fechar">&times;</button>
        </div>
    `;

    // Adicionar estilos
    const estilos = document.createElement('style');
    estilos.textContent = `
        .notificacao-especial {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2000;
            max-width: 350px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .notificacao-conteudo {
            display: flex;
            padding: 15px;
            align-items: center;
            border-left: 4px solid var(--success);
        }
        
        .notificacao-icone {
            background-color: rgba(40, 167, 69, 0.1);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: var(--success);
            font-size: 18px;
        }
        
        .notificacao-texto {
            flex: 1;
        }
        
        .notificacao-texto h4 {
            margin: 0 0 5px 0;
            color: var(--secondary);
        }
        
        .notificacao-texto p {
            margin: 0;
            font-size: 14px;
            color: var(--gray-dark);
        }
        
        .notificacao-fechar {
            background: none;
            border: none;
            color: var(--gray);
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            margin-left: 10px;
            transition: color 0.2s;
        }
        
        .notificacao-fechar:hover {
            color: var(--danger);
        }
    `;

    // Adicionar ao DOM
    document.head.appendChild(estilos);
    document.body.appendChild(notificacao);

    // Configurar o botão de fechar
    const btnFechar = notificacao.querySelector('.notificacao-fechar');
    btnFechar.addEventListener('click', () => {
        // Remover a notificação com animação
        notificacao.style.animation = 'slideOut 0.5s ease-out forwards';
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.parentNode.removeChild(notificacao);
            }
        }, 500);

        // Salvar que o usuário já viu a notificação hoje
        localStorage.setItem('notificacaoEspecialVista', hoje);
    });

    // Fechar automaticamente após 8 segundos
    setTimeout(() => {
        if (notificacao.parentNode) {
            notificacao.style.animation = 'slideOut 0.5s ease-out forwards';
            setTimeout(() => {
                if (notificacao.parentNode) {
                    notificacao.parentNode.removeChild(notificacao);
                }
            }, 500);
        }
    }, 8000);

    // Adicionar animação de saída
    const estiloSaida = document.createElement('style');
    estiloSaida.textContent = `
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(estiloSaida);
}

// Modificar a função DOMContentLoaded para incluir a verificação e exibição da notificação
document.addEventListener('DOMContentLoaded', function () {
    // ... Código existente ...

    // Verificar se deve exibir a notificação para usuário especial
    verificarEExibirNotificacaoUsuarioEspecial();
});

// Adicione este código no início do seu arquivo script.js para depuração
console.log("Verificando permissões...");

// Verificar explicitamente a matrícula do usuário logado
fetch('/api/session/user')
    .then(response => response.json())
    .then(data => {
        console.log("Dados da sessão:", data);
        console.log("Matrícula do usuário:", data.matricula);

        // Verificar se é o usuário especial
        if (data.matricula === 'MA201990') {
            console.log("✓ Usuário com permissão especial detectado!");

            // Mostrar o botão de gerenciar colaboradores
            const btnManageUsers = document.getElementById('btnManageUsers');
            if (btnManageUsers) {
                btnManageUsers.style.display = 'flex';
                console.log("Botão de gerenciar colaboradores exibido!");
            } else {
                console.log("Botão de gerenciar colaboradores não encontrado!");
            }
        } else {
            console.log("✗ Usuário sem permissão especial.");
        }
    })
    .catch(error => console.error('Erro ao verificar sessão do usuário:', error));

// Script para modificar o botão flutuante para verde e adicionar interações
document.addEventListener('DOMContentLoaded', function () {
    // Encontrar o botão flutuante pelo ID
    const botaoFlutuante = document.getElementById('openCollectorsPanel');

    if (botaoFlutuante) {
        console.log("Botão flutuante encontrado, aplicando modificações...");

        // 1. Mudar a cor para verde
        botaoFlutuante.style.backgroundColor = '#28a745';
        botaoFlutuante.style.borderColor = '#28a745';

        // Remover classes antigas e adicionar classe de sucesso (verde)
        botaoFlutuante.classList.remove('btn-primary');
        botaoFlutuante.classList.add('btn-success');

        // 2. Adicionar efeitos de interação

        // Efeito de hover - aumentar ligeiramente o tamanho
        botaoFlutuante.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.5)';
        });

        botaoFlutuante.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        });

        // Efeito ao clicar - cor mais escura
        botaoFlutuante.addEventListener('mousedown', function () {
            this.style.backgroundColor = '#218838';
            this.style.transform = 'scale(0.95)';
        });

        botaoFlutuante.addEventListener('mouseup', function () {
            this.style.backgroundColor = '#28a745';
            this.style.transform = 'scale(1.1)';
        });

        // Adicionar uma pequena animação de pulso
        botaoFlutuante.style.transition = 'all 0.3s ease';

        // Se houver um ícone dentro do botão, ajustar a cor
        const icone = botaoFlutuante.querySelector('i');
        if (icone) {
            icone.style.color = 'white';
        }

        // Se houver uma imagem SVG, ajustar para branco
        const svg = botaoFlutuante.querySelector('img');
        if (svg) {
            svg.style.filter = 'brightness(0) invert(1)';
        }

        console.log("Modificações aplicadas com sucesso ao botão flutuante");
    } else {
        console.log("Botão flutuante não encontrado");
    }
});

// Sistema de histórico de uso de coletores por colaborador
document.addEventListener('DOMContentLoaded', function () {
    // Função para registrar quando um colaborador pega um coletor
    function registrarRetiradaColetor() {
        console.log("Configurando registro de retirada de coletores...");

        // Encontrar o botão de salvar no modal de coletor
        const saveButton = document.getElementById('saveCollector');

        if (saveButton) {
            // Preservar o evento original de clique
            const originalClickHandler = saveButton.onclick;

            // Substituir com nossa própria função
            saveButton.onclick = function (event) {
                // Capturar dados do formulário
                const dados = capturarDadosFormulario();

                // Verificar se há um usuário selecionado (para registrar a retirada)
                if (dados.usuario && dados.usuario !== '-') {
                    // Registrar a retirada do coletor
                    const dadosHistorico = {
                        id_colaborador: dados.usuario_id || "ID não disponível",
                        nome_colaborador: dados.usuario,
                        matricula: dados.matricula || "Não registrada",
                        setor: dados.setor,
                        id_coletor: dados.id,
                        modelo_coletor: dados.modelo,
                        turno: dados.turno,
                        data_retirada: dados.data_vigente,
                        hora_retirada: dados.hora_registro,
                        bateria_inicial: dados.bateria.replace('%', ''),
                        status_coletor: dados.status,
                        observacoes: "Coletor atribuído via formulário"
                    };

                    // Salvar no histórico
                    salvarHistoricoColaborador(dadosHistorico, 'retirada');
                }

                // Chamar o handler original para preservar a funcionalidade existente
                if (typeof originalClickHandler === 'function') {
                    return originalClickHandler.call(this, event);
                }
            };

            console.log("Registro de retirada configurado com sucesso");
        }
    }

    // Função para registrar quando um coletor é devolvido
    function configurarRegistroDevolucao() {
        // Este código será executado quando o botão Devolver for clicado
        document.addEventListener('click', function (event) {
            const botaoDevolver = event.target.closest('.btn-return');

            if (botaoDevolver) {
                // O código de devolução já está sendo tratado em outro lugar
                // Aqui apenas adicionamos o registro no histórico do colaborador
                const linha = botaoDevolver.closest('tr');
                if (!linha) return;

                // Obter dados da linha
                const idColetor = linha.querySelector('td:first-child').textContent.replace('#', '').trim();
                const usuarioCell = linha.querySelector('td:nth-child(2)');
                const setorCell = linha.querySelector('td:nth-child(3)');
                const bateriaCell = linha.querySelector('td:nth-child(6)');

                // Obter valores
                const usuario = usuarioCell ? usuarioCell.textContent.trim() : '-';

                // Somente proceder se houver um usuário
                if (usuario !== '-') {
                    setTimeout(function () {
                        // A esta altura, os dados na linha já foram atualizados com o tempo de uso
                        const tempoUsoCell = linha.querySelector('td:nth-child(5)');
                        const tempoUso = tempoUsoCell ? tempoUsoCell.textContent.trim() : '00:00';

                        // Dados do histórico de devolução
                        const dadosHistorico = {
                            id_colaborador: "ID não disponível", // Seria ideal ter este dado
                            nome_colaborador: usuario,
                            setor: setorCell ? setorCell.textContent.trim() : '-',
                            id_coletor: idColetor,
                            data_devolucao: formatarData(),
                            hora_devolucao: formatarHora(),
                            tempo_uso: tempoUso,
                            bateria_final: bateriaCell ? bateriaCell.textContent.trim().replace('%', '') : '0',
                            observacoes: "Coletor devolvido via botão Devolver"
                        };

                        // Salvar no histórico
                        salvarHistoricoColaborador(dadosHistorico, 'devolucao');
                    }, 100); // Pequeno delay para garantir que os dados foram atualizados
                }
            }
        });
    }

    // Função para capturar dados do formulário
    function capturarDadosFormulario() {
        // Função existente para capturar dados do formulário
        // ...

        // Dados simulados (substitua pelo seu código real)
        return {
            id: document.getElementById('collectorId') ? document.getElementById('collectorId').value : '',
            modelo: document.getElementById('collectorModel') ? document.getElementById('collectorModel').value : '',
            usuario: document.getElementById('collectorUser') ?
                typeof document.getElementById('collectorUser').value === 'string' ?
                    document.getElementById('collectorUser').value :
                    document.getElementById('collectorUser').options[document.getElementById('collectorUser').selectedIndex].text : '',
            usuario_id: document.getElementById('collectorUser') ? document.getElementById('collectorUser').value : '',
            matricula: "", // Obter a matrícula se disponível
            setor: document.getElementById('collectorSector') ?
                typeof document.getElementById('collectorSector').value === 'string' ?
                    document.getElementById('collectorSector').value :
                    document.getElementById('collectorSector').options[document.getElementById('collectorSector').selectedIndex].text : '',
            status: document.getElementById('collectorStatus') ?
                typeof document.getElementById('collectorStatus').value === 'string' ?
                    document.getElementById('collectorStatus').value :
                    document.getElementById('collectorStatus').options[document.getElementById('collectorStatus').selectedIndex].text : '',
            bateria: document.getElementById('collectorBattery') ? document.getElementById('collectorBattery').value : '100%',
            turno: document.getElementById('collectorTurno') ?
                typeof document.getElementById('collectorTurno').value === 'string' ?
                    document.getElementById('collectorTurno').value :
                    document.getElementById('collectorTurno').options[document.getElementById('collectorTurno').selectedIndex].text : '',
            data_vigente: document.getElementById('collectorDataTop') ?
                document.getElementById('collectorDataTop').textContent :
                formatarData(),
            hora_registro: document.getElementById('collectorHorarioTop') ?
                document.getElementById('collectorHorarioTop').textContent :
                formatarHora()
        };
    }

    // Função para salvar no histórico do colaborador
    function salvarHistoricoColaborador(dados, tipo) {
        console.log(`Salvando histórico de ${tipo} no banco de dados:`, dados);

        try {
            // 1. Tentar salvar usando localStorage como fallback
            if (window.localStorage) {
                // Obter histórico existente
                let historico = JSON.parse(localStorage.getItem('historicoColaboradores') || '[]');

                // Se for uma retirada, criar novo registro
                if (tipo === 'retirada') {
                    historico.push({
                        ...dados,
                        timestamp: Date.now()
                    });

                    console.log("Registro de retirada adicionado ao histórico local");
                }
                // Se for uma devolução, atualizar registro existente
                else if (tipo === 'devolucao') {
                    // Encontrar o registro mais recente deste coletor com este colaborador sem data de devolução
                    const index = historico
                        .map((item, idx) => ({ idx, item }))
                        .filter(x =>
                            x.item.id_coletor === dados.id_coletor &&
                            x.item.nome_colaborador === dados.nome_colaborador &&
                            !x.item.data_devolucao
                        )
                        .sort((a, b) => b.item.timestamp - a.item.timestamp) // Mais recente primeiro
                        .map(x => x.idx)[0];

                    if (index !== undefined) {
                        // Atualizar o registro com dados de devolução
                        historico[index] = {
                            ...historico[index],
                            data_devolucao: dados.data_devolucao,
                            hora_devolucao: dados.hora_devolucao,
                            tempo_uso: dados.tempo_uso,
                            bateria_final: dados.bateria_final,
                            observacoes: historico[index].observacoes + " | " + dados.observacoes
                        };
                        console.log("Registro de devolução atualizado no histórico local");
                    } else {
                        // Não encontrou registro anterior, criar novo
                        historico.push({
                            ...dados,
                            timestamp: Date.now()
                        });
                        console.log("Novo registro de devolução adicionado ao histórico local");
                    }
                }

                // Salvar de volta no localStorage
                localStorage.setItem('historicoColaboradores', JSON.stringify(historico));
            }

            // 2. Usar AJAX para enviar para o servidor
            if (window.fetch) {
                fetch('/api/historico-colaborador', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        dados: dados,
                        tipo: tipo
                    })
                })
                    .then(response => {
                        if (response.ok) {
                            console.log("Histórico enviado para o servidor via AJAX");
                        } else {
                            console.error("Erro ao enviar histórico para o servidor:", response.statusText);
                        }
                    })
                    .catch(error => {
                        console.error("Erro de rede ao enviar histórico:", error);
                    });
            }

        } catch (error) {
            console.error("Erro ao salvar histórico no banco de dados:", error);
        }
    }

    // Função para formatar a data atual (DD/MM/YYYY)
    function formatarData() {
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    // Função para formatar a hora atual (HH:MM)
    function formatarHora() {
        const agora = new Date();
        const horas = String(agora.getHours()).padStart(2, '0');
        const minutos = String(agora.getMinutes()).padStart(2, '0');
        return `${horas}:${minutos}`;
    }

    // Adicionar interface para visualizar o histórico
    function adicionarBotaoHistorico() {
        console.log("Adicionando botão para visualizar histórico...");

        // Encontrar a barra de navegação ou container de botões
        const navbar = document.querySelector('.navbar') || document.querySelector('.header-buttons');

        if (navbar) {
            // Verificar se o botão já existe
            if (!document.getElementById('btnViewHistory')) {
                // Criar botão de histórico
                const botaoHistorico = document.createElement('button');
                botaoHistorico.id = 'btnViewHistory';
                botaoHistorico.className = 'btn btn-primary';
                botaoHistorico.innerHTML = '<i class="fas fa-history"></i> Histórico de Uso';
                botaoHistorico.style.marginLeft = '10px';

                // Adicionar evento ao botão
                botaoHistorico.addEventListener('click', abrirModalHistorico);

                // Adicionar botão à navbar
                navbar.appendChild(botaoHistorico);

                console.log("Botão de histórico adicionado com sucesso");
            }
        } else {
            console.log("Container para botão de histórico não encontrado");
        }
    }

    // Função para abrir modal de histórico
    function abrirModalHistorico() {
        console.log("Abrindo modal de histórico...");

        // Criar modal se não existir
        if (!document.getElementById('historicoModal')) {
            const modal = document.createElement('div');
            modal.id = 'historicoModal';
            modal.className = 'modal';

            // Estrutura do modal
            modal.innerHTML = `
          <div class="modal-content">
            <div class="modal-header">
              <h2 id="modalHistoricoTitle">Histórico de Uso de Coletores</h2>
              <span class="close">&times;</span>
            </div>
            <div class="modal-body">
              <div class="historico-filtros">
                <div class="form-row">
                  <div class="form-col">
                    <div class="form-group">
                      <label class="form-label" for="filtroColaborador">Colaborador</label>
                      <select class="form-control" id="filtroColaborador">
                        <option value="">Todos os Colaboradores</option>
                        <!-- Opções serão adicionadas dinamicamente -->
                      </select>
                    </div>
                  </div>
                  <div class="form-col">
                    <div class="form-group">
                      <label class="form-label" for="filtroColetor">Coletor</label>
                      <select class="form-control" id="filtroColetor">
                        <option value="">Todos os Coletores</option>
                        <!-- Opções serão adicionadas dinamicamente -->
                      </select>
                    </div>
                  </div>
                  <div class="form-col">
                    <div class="form-group">
                      <label class="form-label" for="filtroDataInicio">Data Início</label>
                      <input type="date" class="form-control" id="filtroDataInicio">
                    </div>
                  </div>
                  <div class="form-col">
                    <div class="form-group">
                      <label class="form-label" for="filtroDataFim">Data Fim</label>
                      <input type="date" class="form-control" id="filtroDataFim">
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-col">
                    <button id="btnFiltrarHistorico" class="btn btn-primary">Filtrar</button>
                    <button id="btnExportarHistorico" class="btn btn-secondary">Exportar CSV</button>
                  </div>
                </div>
              </div>
              
              <div class="historico-tabela">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Colaborador</th>
                      <th>Coletor</th>
                      <th>Data Retirada</th>
                      <th>Hora Retirada</th>
                      <th>Data Devolução</th>
                      <th>Hora Devolução</th>
                      <th>Tempo de Uso</th>
                      <th>Turno</th>
                      <th>Setor</th>
                    </tr>
                  </thead>
                  <tbody id="historicoTableBody">
                    <!-- Dados serão adicionados dinamicamente -->
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" id="btnCloseHistorico">Fechar</button>
            </div>
          </div>
        `;

            // Adicionar modal ao body
            document.body.appendChild(modal);

            // Configurar eventos do modal
            const closeBtn = modal.querySelector('.close');
            const btnClose = modal.querySelector('#btnCloseHistorico');

            closeBtn.onclick = fecharModalHistorico;
            btnClose.onclick = fecharModalHistorico;

            // Configurar evento de filtragem
            const btnFiltrar = modal.querySelector('#btnFiltrarHistorico');
            btnFiltrar.onclick = filtrarHistorico;

            // Configurar evento de exportação
            const btnExportar = modal.querySelector('#btnExportarHistorico');
            btnExportar.onclick = exportarHistoricoCsv;

            console.log("Modal de histórico criado com sucesso");
        }

        // Exibir modal
        const modal = document.getElementById('historicoModal');
        if (modal) {
            modal.style.display = 'block';

            // Carregar dados para os filtros
            carregarOpcoesParaFiltros();

            // Carregar histórico inicial
            carregarHistorico();
        }
    }

    // Função para fechar o modal de histórico
    function fecharModalHistorico() {
        const modal = document.getElementById('historicoModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Função para carregar opções para os filtros
    function carregarOpcoesParaFiltros() {
        console.log("Carregando opções para filtros...");

        // Obter histórico do localStorage
        const historico = JSON.parse(localStorage.getItem('historicoColaboradores') || '[]');

        // Extrair colaboradores únicos
        const colaboradores = [...new Set(historico.map(item => item.nome_colaborador))];
        const selectColaborador = document.getElementById('filtroColaborador');

        if (selectColaborador) {
            // Manter a opção "Todos" e adicionar colaboradores
            selectColaborador.innerHTML = '<option value="">Todos os Colaboradores</option>';

            colaboradores.forEach(colaborador => {
                if (colaborador && colaborador !== '-') {
                    const option = document.createElement('option');
                    option.value = colaborador;
                    option.textContent = colaborador;
                    selectColaborador.appendChild(option);
                }
            });
        }

        // Extrair coletores únicos
        const coletores = [...new Set(historico.map(item => item.id_coletor))];
        const selectColetor = document.getElementById('filtroColetor');

        if (selectColetor) {
            // Manter a opção "Todos" e adicionar coletores
            selectColetor.innerHTML = '<option value="">Todos os Coletores</option>';

            coletores.forEach(coletor => {
                if (coletor) {
                    const option = document.createElement('option');
                    option.value = coletor;
                    option.textContent = `#${coletor}`;
                    selectColetor.appendChild(option);
                }
            });
        }

        console.log("Opções de filtro carregadas com sucesso");
    }

    // Função para carregar o histórico na tabela
    function carregarHistorico() {
        console.log("Carregando histórico...");

        // Obter histórico do localStorage
        const historico = JSON.parse(localStorage.getItem('historicoColaboradores') || '[]');

        // Aplicar filtros ativos
        const colaboradorFiltro = document.getElementById('filtroColaborador')?.value || '';
        const coletorFiltro = document.getElementById('filtroColetor')?.value || '';
        const dataInicioFiltro = document.getElementById('filtroDataInicio')?.value || '';
        const dataFimFiltro = document.getElementById('filtroDataFim')?.value || '';

        // Filtrar dados
        const dadosFiltrados = historico.filter(item => {
            let passaFiltro = true;

            // Filtro de colaborador
            if (colaboradorFiltro && item.nome_colaborador !== colaboradorFiltro) {
                passaFiltro = false;
            }

            // Filtro de coletor
            if (coletorFiltro && item.id_coletor !== coletorFiltro) {
                passaFiltro = false;
            }

            // Filtro de data início
            if (dataInicioFiltro) {
                const dataRetiradaObj = converterDataParaObj(item.data_retirada);
                const dataInicioObj = new Date(dataInicioFiltro);

                if (dataRetiradaObj < dataInicioObj) {
                    passaFiltro = false;
                }
            }

            // Filtro de data fim
            if (dataFimFiltro) {
                const dataRetiradaObj = converterDataParaObj(item.data_retirada);
                const dataFimObj = new Date(dataFimFiltro);
                dataFimObj.setHours(23, 59, 59); // Fim do dia

                if (dataRetiradaObj > dataFimObj) {
                    passaFiltro = false;
                }
            }

            return passaFiltro;
        });

        // Ordenar por data/hora de retirada (mais recente primeiro)
        dadosFiltrados.sort((a, b) => {
            const dataA = converterDataParaObj(a.data_retirada);
            const dataB = converterDataParaObj(b.data_retirada);

            if (dataA.getTime() !== dataB.getTime()) {
                return dataB.getTime() - dataA.getTime();
            }

            // Se as datas forem iguais, comparar horas
            const horaA = a.hora_retirada.split(':').map(Number);
            const horaB = b.hora_retirada.split(':').map(Number);

            if (horaA[0] !== horaB[0]) {
                return horaB[0] - horaA[0];
            }

            return horaB[1] - horaA[1];
        });

        // Atualizar tabela
        const tbody = document.getElementById('historicoTableBody');
        if (tbody) {
            tbody.innerHTML = '';

            if (dadosFiltrados.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="9" class="text-center">Nenhum registro encontrado</td>';
                tbody.appendChild(tr);
            } else {
                dadosFiltrados.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
              <td>${item.nome_colaborador || '-'}</td>
              <td>#${item.id_coletor || '-'}</td>
              <td>${item.data_retirada || '-'}</td>
              <td>${item.hora_retirada || '-'}</td>
              <td>${item.data_devolucao || '-'}</td>
              <td>${item.hora_devolucao || '-'}</td>
              <td>${item.tempo_uso || '-'}</td>
              <td>${item.turno || '-'}</td>
              <td>${item.setor || '-'}</td>
            `;
                    tbody.appendChild(tr);
                });
            }
        }

        console.log("Histórico carregado com sucesso");
    }

    // Função para filtrar o histórico
    function filtrarHistorico() {
        carregarHistorico();
    }

    // Função para exportar o histórico em CSV
    function exportarHistoricoCsv() {
        console.log("Exportando histórico em CSV...");

        // Obter dados filtrados
        const tbody = document.getElementById('historicoTableBody');
        const linhas = tbody.querySelectorAll('tr');

        // Cabeçalhos
        const cabecalhos = [
            'Colaborador',
            'Coletor',
            'Data Retirada',
            'Hora Retirada',
            'Data Devolução',
            'Hora Devolução',
            'Tempo de Uso',
            'Turno',
            'Setor'
        ];

        // Criar conteúdo CSV
        let csvContent = cabecalhos.join(',') + '\n';

        linhas.forEach(linha => {
            // Pular linha "Nenhum registro encontrado"
            if (linha.cells.length === 1) return;

            // Obter células da linha
            const celulas = linha.querySelectorAll('td');
            const valoresCelulas = Array.from(celulas).map(celula => {
                // Escapar aspas e adicionar aspas em volta do valor
                const valor = celula.textContent.trim();
                return `"${valor.replace(/"/g, '""')}"`;
            });

            csvContent += valoresCelulas.join(',') + '\n';
        });

        // Criar blob e link para download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // Criar link e simular clique
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `historico_coletores_${formatarData().replace(/\//g, '-')}.csv`);
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("Histórico exportado com sucesso");
    }

    // Função auxiliar para converter string de data DD/MM/YYYY para objeto Date
    function converterDataParaObj(dataStr) {
        if (!dataStr) return new Date(0);

        const partes = dataStr.split('/');
        if (partes.length !== 3) return new Date(0);

        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1; // Mês em JS é 0-11
        const ano = parseInt(partes[2], 10);

        return new Date(ano, mes, dia);
    }

    // Observar a abertura do modal de coletores para configurar monitoramento
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' &&
                mutation.attributeName === 'class' &&
                mutation.target.id === 'collectorModal' &&
                mutation.target.classList.contains('active')) {

                // Modal foi aberto, configurar registro de retirada
                setTimeout(registrarRetiradaColetor, 300);
            }
        });
    });

    // Configurar o observer para monitorar mudanças no modal
    const collectorModal = document.getElementById('collectorModal');
    if (collectorModal) {
        observer.observe(collectorModal, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // Inicialização
    setTimeout(function () {
        adicionarBotaoHistorico();
        configurarRegistroDevolucao();
    }, 1000);
});

// Logs de teste para verificar funcionamento do histórico
console.log("Verificando sistema de histórico...");
console.log("localStorage disponível:", !!window.localStorage);
console.log("Histórico atual:", localStorage.getItem('historicoColaboradores'));
console.log("Botão histórico criado:", !!document.getElementById('btnViewHistory'));

// Função para processar a devolução do coletor (comunicando com o banco de dados)
function devolverColetor(id, linha) {
    console.log(`Iniciando devolução do coletor #${id}`);

    // Obter informações do coletor
    const usuarioCell = linha.querySelector('td:nth-child(2)');
    const setorCell = linha.querySelector('td:nth-child(3)');
    const statusCell = linha.querySelector('td:nth-child(4)');
    const tempoUsoCell = linha.querySelector('td:nth-child(5)');
    const bateriaCell = linha.querySelector('td:nth-child(6)');

    const usuarioAtual = usuarioCell ? usuarioCell.textContent.trim() : '-';
    const setorAtual = setorCell ? setorCell.textContent.trim() : '-';
    const bateriaAtual = bateriaCell ? bateriaCell.textContent.trim() : '100%';

    // Calcular tempo de uso
    const startTime = linha.getAttribute('data-start-time') || Date.now() - 3600000;
    const tempoUso = calcularTempoUso(Number(startTime));

    // Obter data e hora atual
    const dataAtual = formatarData();
    const horaAtual = formatarHora();

    // Confirmar a devolução
    if (confirm(`Tem certeza que deseja devolver o coletor #${id}?\n\nUsuário: ${usuarioAtual}\nTempo de uso: ${tempoUso}`)) {
        // Preparar dados para enviar ao banco
        const dadosDevolucao = {
            id_coletor: id,
            usuario_anterior: usuarioAtual,
            setor_anterior: setorAtual,
            data_devolucao: dataAtual,
            hora_devolucao: horaAtual,
            tempo_uso: tempoUso,
            bateria: bateriaAtual.replace('%', '')
        };

        // Fazer requisição AJAX para atualizar o banco de dados
        fetch('/api/devolver-coletor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosDevolucao)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Erro na requisição');
            })
            .then(data => {
                if (data.success) {
                    // Atualizar a interface
                    if (usuarioCell) usuarioCell.textContent = '-';
                    if (setorCell) setorCell.textContent = '-';

                    // Atualizar o status na tabela
                    if (statusCell) {
                        const statusSpan = statusCell.querySelector('span');
                        if (statusSpan) {
                            statusSpan.classList.remove('status-active', 'status-inactive', 'status-warning', 'status-error');
                            statusSpan.classList.add('status-disponivel');
                            statusSpan.textContent = 'Disponível para Uso';
                        } else {
                            statusCell.textContent = 'Disponível para Uso';
                            statusCell.classList.add('status-disponivel');
                        }
                    }

                    // Atualizar tempo de uso
                    if (tempoUsoCell) tempoUsoCell.textContent = '00:00';

                    // Remover o botão de devolução
                    const botaoDevolver = linha.querySelector('.btn-return');
                    if (botaoDevolver) botaoDevolver.remove();

                    // Remover o atributo de tempo inicial
                    linha.removeAttribute('data-start-time');

                    // Atualizar card de coletores em uso
                    atualizarColetoresEmUso();

                    // Mostrar mensagem de sucesso
                    alert(`Coletor #${id} devolvido com sucesso!\nTempo de uso: ${tempoUso}`);
                } else {
                    alert(`Erro ao devolver coletor: ${data.message || 'Erro desconhecido'}`);
                }
            })
            .catch(error => {
                console.error('Erro na devolução:', error);
                alert('Ocorreu um erro ao devolver o coletor. Tente novamente ou contate o suporte.');
            });
    }
}

// Função para atualizar contador de coletores em uso
function atualizarColetoresEmUso() {
    // Fazer requisição AJAX para obter contagem atualizada
    fetch('/api/contagem-coletores')
        .then(response => response.json())
        .then(data => {
            // Atualizar os elementos na interface
            const emUsoElement = document.querySelector('.card .number:nth-of-type(2)');
            if (emUsoElement && data.em_uso !== undefined) {
                emUsoElement.textContent = data.em_uso;
            }

            // Atualizar outros elementos conforme necessário
        })
        .catch(error => {
            console.error('Erro ao atualizar contagem:', error);
        });
}


/**
* Sistema de Controle de Coletores - Scripts de Sincronização
* 
* Este script melhora a comunicação entre o frontend e o backend,
* especialmente para operações de remoção de coletores, e implementa
* um sistema de cache que evita recarregar dados a cada atualização.
*/

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    console.log("Inicializando sistema de sincronização de coletores...");

    // Configurações do sistema de cache
    const CONFIG = {
        STORAGE_KEY: 'sistema_coletores_cache',
        CACHE_DURATION: 30 * 60 * 1000, // 30 minutos em milissegundos
        API_ENDPOINTS: {
            COLETORES: '/api/coletores',
            HISTORICO: '/api/historico',
            USUARIOS: '/api/usuarios'
        }
    };

    // ===== Sistema de Cache =====
    const CacheManager = {
        /**
         * Salva dados no cache local com timestamp
         */
        saveToCache: function (key, data) {
            try {
                const cacheData = {
                    timestamp: Date.now(),
                    data: data
                };
                localStorage.setItem(`${CONFIG.STORAGE_KEY}_${key}`, JSON.stringify(cacheData));
                console.log(`Dados salvos no cache: ${key}`);
                return true;
            } catch (error) {
                console.error(`Erro ao salvar no cache: ${error.message}`);
                return false;
            }
        },

        /**
         * Recupera dados do cache se não estiverem expirados
         */
        getFromCache: function (key) {
            try {
                const cachedData = localStorage.getItem(`${CONFIG.STORAGE_KEY}_${key}`);
                if (!cachedData) return null;

                const parsedData = JSON.parse(cachedData);
                const now = Date.now();

                // Verificar se o cache expirou
                if (now - parsedData.timestamp > CONFIG.CACHE_DURATION) {
                    console.log(`Cache expirado para: ${key}`);
                    localStorage.removeItem(`${CONFIG.STORAGE_KEY}_${key}`);
                    return null;
                }

                console.log(`Dados recuperados do cache: ${key}`);
                return parsedData.data;
            } catch (error) {
                console.error(`Erro ao ler do cache: ${error.message}`);
                return null;
            }
        },

        /**
         * Limpa cache específico
         */
        clearCache: function (key) {
            localStorage.removeItem(`${CONFIG.STORAGE_KEY}_${key}`);
        },

        /**
         * Limpa todo o cache do sistema
         */
        clearAllCache: function () {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CONFIG.STORAGE_KEY)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            console.log("Cache do sistema limpo");
        }
    };

    // ===== API Service =====
    const ApiService = {
        /**
         * Carrega coletores do banco de dados ou do cache
         */
        loadColetores: function (forceRefresh = false) {
            return new Promise((resolve, reject) => {
                // Verificar se podemos usar o cache
                if (!forceRefresh) {
                    const cachedData = CacheManager.getFromCache('coletores');
                    if (cachedData) {
                        console.log('Carregando coletores do cache');

                        // Atualizar variável global e UI
                        window.collectors = cachedData;
                        updateUI(cachedData);

                        return resolve(cachedData);
                    }
                }

                // Buscar dados do servidor
                console.log('Carregando coletores do servidor');
                fetch(CONFIG.API_ENDPOINTS.COLETORES)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Erro ao carregar coletores: ${response.status} ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Salvar dados no cache
                        CacheManager.saveToCache('coletores', data);

                        // Atualizar variável global e UI
                        window.collectors = data;
                        updateUI(data);

                        resolve(data);
                    })
                    .catch(error => {
                        console.error('Erro ao carregar coletores:', error);

                        // Tentar usar dados mockados como último recurso
                        if (typeof loadMockData === 'function') {
                            console.log('Usando dados mockados como fallback');
                            loadMockData();
                        }

                        reject(error);
                    });
            });
        },

        /**
         * Remove um coletor do banco de dados
         */
        excluirColetor: function (idColetor) {
            return new Promise((resolve, reject) => {
                // Confirmar exclusão com o usuário
                if (!confirm(`Tem certeza que deseja remover o coletor #${idColetor}?`)) {
                    return reject(new Error('Operação cancelada pelo usuário'));
                }

                console.log(`Excluindo coletor #${idColetor}`);

                // Obter dados do coletor antes de excluir (para registro histórico)
                const coletorParaExcluir = window.collectors?.find(c => c.id === idColetor);

                // Requisição para excluir o coletor
                fetch(`${CONFIG.API_ENDPOINTS.COLETORES}/${idColetor}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(data => {
                                throw new Error(data.erro || `Erro ao excluir coletor: ${response.status} ${response.statusText}`);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Resposta do servidor:', data);

                        // Registrar no histórico, se houver dados
                        if (coletorParaExcluir) {
                            registrarHistoricoExclusao(coletorParaExcluir);
                        }

                        // Atualizar o cache
                        const cachedColetores = CacheManager.getFromCache('coletores');
                        if (cachedColetores) {
                            const updatedCache = cachedColetores.filter(c => c.id !== idColetor);
                            CacheManager.saveToCache('coletores', updatedCache);
                        }

                        // Atualizar a lista global de coletores
                        if (window.collectors && Array.isArray(window.collectors)) {
                            window.collectors = window.collectors.filter(c => c.id !== idColetor);
                        }

                        // Atualizar a UI
                        updateUI(window.collectors);

                        // Mostrar mensagem de sucesso
                        alert(data.mensagem || "Coletor excluído com sucesso!");

                        resolve(data);
                    })
                    .catch(error => {
                        console.error('Erro ao excluir coletor:', error);
                        alert(`Erro ao excluir coletor: ${error.message}`);
                        reject(error);
                    });
            });
        },

        /**
         * Registra a devolução de um coletor
         */
        devolverColetor: function (idColetor, dadosDevolucao) {
            return new Promise((resolve, reject) => {
                // Confirmar a devolução
                if (!confirm(`Confirmar devolução do coletor #${idColetor}?`)) {
                    return reject(new Error('Operação cancelada pelo usuário'));
                }

                // Preparar dados para o registro
                const dataAtual = formatarData();
                const horaAtual = formatarHora();
                const dados = {
                    id_coletor: idColetor,
                    data_devolucao: dataAtual,
                    hora_devolucao: horaAtual,
                    ...dadosDevolucao
                };

                // Enviar requisição para registrar a devolução
                fetch(`${CONFIG.API_ENDPOINTS.COLETORES}/${idColetor}/devolver`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(data => {
                                throw new Error(data.erro || `Erro ao devolver coletor: ${response.status} ${response.statusText}`);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Resposta do servidor:', data);

                        // Limpar cache para forçar recarregamento
                        CacheManager.clearCache('coletores');

                        // Recarregar dados da API
                        return ApiService.loadColetores(true);
                    })
                    .then(() => {
                        // Mensagem de sucesso
                        alert(`Coletor #${idColetor} devolvido com sucesso!`);
                        resolve();
                    })
                    .catch(error => {
                        console.error('Erro ao devolver coletor:', error);
                        alert(`Erro ao devolver coletor: ${error.message}`);
                        reject(error);
                    });
            });
        }
    };

    // ===== Funções de Registro no Histórico =====

    /**
     * Registra a exclusão de um coletor no histórico
     */
    function registrarHistoricoExclusao(coletor) {
        // Dados para o histórico
        const registro = {
            acao: 'Exclusão de coletor',
            id_coletor: coletor.id,
            modelo: coletor.modelo,
            numero_serie: coletor.numero_serie,
            ultimo_usuario: coletor.usuario || 'Nenhum',
            ultimo_setor: coletor.setor || 'Nenhum',
            ultimo_status: coletor.status || 'Desconhecido',
            data_registro: formatarData(),
            hora_registro: formatarHora(),
            observacao: "Coletor excluído do sistema"
        };

        // Enviar para o endpoint de histórico
        fetch(`${CONFIG.API_ENDPOINTS.HISTORICO}/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registro)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao registrar histórico: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Histórico registrado com sucesso:', data);
            })
            .catch(error => {
                console.error('Erro ao registrar histórico:', error);
                // Armazenar localmente para sincronização posterior
                salvarHistoricoLocal(registro);
            });
    }

    /**
     * Salva histórico localmente caso falhe o envio ao servidor
     */
    function salvarHistoricoLocal(registro) {
        try {
            // Recuperar histórico existente
            const historicoLocal = localStorage.getItem('historico_pendente');
            const historico = historicoLocal ? JSON.parse(historicoLocal) : [];

            // Adicionar novo registro
            historico.push({
                ...registro,
                pendente: true,
                timestamp: Date.now()
            });

            // Salvar de volta no localStorage
            localStorage.setItem('historico_pendente', JSON.stringify(historico));
            console.log('Histórico salvo localmente para sincronização posterior');
        } catch (error) {
            console.error('Erro ao salvar histórico localmente:', error);
        }
    }

    // ===== Funções de UI =====

    /**
     * Adiciona o botão excluir em cada linha da tabela
     */
    function adicionarBotaoExcluir() {
        // Encontrar todas as linhas da tabela
        const linhasTabela = document.querySelectorAll('#collectorsTableBody tr');

        linhasTabela.forEach(linha => {
            // Verificar se já existe o botão
            const celulasAcoes = linha.querySelector('td:last-child .actions');
            if (!celulasAcoes || celulasAcoes.querySelector('.btn-delete')) return;

            // Obter ID do coletor
            const idColetor = linha.querySelector('td:first-child')?.textContent.replace('#', '').trim();
            if (!idColetor) return;

            // Criar botão de excluir
            const botaoExcluir = document.createElement('button');
            botaoExcluir.className = 'btn-icon btn-delete';
            botaoExcluir.setAttribute('data-id', idColetor);
            botaoExcluir.setAttribute('title', 'Excluir coletor');
            botaoExcluir.innerHTML = '<i class="fas fa-trash"></i>';

            // Estilizar o botão
            botaoExcluir.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
            botaoExcluir.style.color = '#dc3545';

            // Adicionar evento de clique
            botaoExcluir.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const id = this.getAttribute('data-id');
                ApiService.excluirColetor(id)
                    .then(() => {
                        // A UI será atualizada dentro do método excluirColetor
                    })
                    .catch(error => console.error('Falha ao excluir:', error));
            });

            // Adicionar botão ao contêiner de ações
            celulasAcoes.appendChild(botaoExcluir);
        });
    }

    /**
     * Adiciona o botão devolver em cada linha com coletor em uso
     */
    function adicionarBotaoDevolver() {
        // Encontrar todas as linhas da tabela
        const linhasTabela = document.querySelectorAll('#collectorsTableBody tr');

        linhasTabela.forEach(linha => {
            // Verificar se o botão já existe
            const celulasAcoes = linha.querySelector('td:last-child .actions');
            if (!celulasAcoes || celulasAcoes.querySelector('.btn-return')) return;

            // Obter ID do coletor
            const idColetor = linha.querySelector('td:first-child')?.textContent.replace('#', '').trim();
            if (!idColetor) return;

            // Verificar se o coletor está em uso (tem usuário)
            const usuarioCell = linha.querySelector('td:nth-child(2)');
            const statusCell = linha.querySelector('td:nth-child(4)');

            const usuarioAtual = usuarioCell?.textContent.trim();
            const statusAtual = statusCell?.textContent.trim();

            // Só adicionar botão se tiver usuário e não for "Disponível para Uso"
            if (usuarioAtual === '-' || usuarioAtual === '' || statusAtual === 'Disponível para Uso') return;

            // Criar botão devolver
            const botaoDevolver = document.createElement('button');
            botaoDevolver.className = 'btn-icon btn-return';
            botaoDevolver.setAttribute('data-id', idColetor);
            botaoDevolver.setAttribute('title', 'Devolver coletor');
            botaoDevolver.innerHTML = '<i class="fas fa-undo"></i>';

            // Estilizar o botão
            botaoDevolver.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
            botaoDevolver.style.color = '#ffc107';

            // Adicionar evento de clique para devolver o coletor
            botaoDevolver.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const id = this.getAttribute('data-id');

                // Calcular tempo de uso
                const startTime = linha.getAttribute('data-start-time') || Date.now() - 3600000; // default: 1h atrás
                const tempoUso = calcularTempoUso(Number(startTime));

                // Obter dados do coletor para devolução
                const setorAtual = linha.querySelector('td:nth-child(3)')?.textContent.trim() || '-';
                const bateriaAtual = linha.querySelector('td:nth-child(6)')?.textContent.trim() || '100%';

                // Dados para a devolução
                const dadosDevolucao = {
                    usuario: usuarioAtual,
                    setor: setorAtual,
                    tempo_uso: tempoUso,
                    bateria_final: bateriaAtual.replace('%', ''),
                    status_anterior: statusAtual,
                    observacoes: "Devolvido via botão Devolver"
                };

                ApiService.devolverColetor(id, dadosDevolucao)
                    .then(() => {
                        // A UI será atualizada após recarregar os dados
                    })
                    .catch(error => console.error('Falha ao devolver:', error));
            });

            // Adicionar botão às ações
            celulasAcoes.appendChild(botaoDevolver);

            // Adicionar tempo inicial se não existir
            if (!linha.hasAttribute('data-start-time')) {
                linha.setAttribute('data-start-time', Date.now());
            }
        });
    }

    /**
     * Atualiza a interface com os dados carregados
     */
    function updateUI(data) {
        console.log('Atualizando UI com dados', data ? data.length : 0, 'coletores');

        // Verificar se os dados existem
        if (!data || !Array.isArray(data)) {
            console.warn('Dados inválidos para atualizar a UI');
            return;
        }

        // Atualizar tabela
        if (typeof renderCollectorsTable === 'function') {
            renderCollectorsTable();
        } else {
            console.warn('Função renderCollectorsTable não encontrada');
        }

        // Atualizar estatísticas
        if (typeof updateStats === 'function') {
            updateStats();
        } else {
            console.warn('Função updateStats não encontrada');
        }

        // Atualizar lista de coletores ativos
        if (typeof renderActiveCollectors === 'function') {
            renderActiveCollectors();
        } else {
            console.warn('Função renderActiveCollectors não encontrada');
        }

        // Adicionar botões após atualização
        setTimeout(() => {
            adicionarBotaoExcluir();
            adicionarBotaoDevolver();
        }, 100);
    }

    // ===== Funções Auxiliares =====

    /**
     * Calcula o tempo de uso a partir do timestamp inicial
     */
    function calcularTempoUso(startTime) {
        const agora = Date.now();
        const tempoDecorrido = agora - startTime;

        // Calcular horas e minutos
        const segundos = Math.floor(tempoDecorrido / 1000);
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);

        // Formatar o tempo (HH:MM)
        return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
    }

    /**
     * Formata a data atual como DD/MM/YYYY
     */
    function formatarData() {
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    /**
     * Formata a hora atual como HH:MM
     */
    function formatarHora() {
        const agora = new Date();
        const horas = String(agora.getHours()).padStart(2, '0');
        const minutos = String(agora.getMinutes()).padStart(2, '0');
        return `${horas}:${minutos}`;
    }

    // ===== Monitor de DOM =====

    /**
     * Configura observadores para mudanças no DOM
     */
    function configurarObservadores() {
        // Observador para a tabela de coletores
        const observerTabela = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList' &&
                    (mutation.target.id === 'collectorsTableBody' ||
                        mutation.target.closest('#collectorsTableBody'))) {
                    setTimeout(() => {
                        adicionarBotaoExcluir();
                        adicionarBotaoDevolver();
                    }, 100);
                }
            });
        });

        // Configurar o observador para a tabela
        const tableBody = document.getElementById('collectorsTableBody');
        if (tableBody) {
            observerTabela.observe(tableBody, {
                childList: true,
                subtree: true
            });
            console.log('Observador configurado para a tabela de coletores');
        }
    }

    // ===== Sobrescrita de funções existentes =====

    /**
     * Sobrescreve a função loadCollectors original
     */
    function sobrescreverLoadCollectors() {
        if (typeof window.loadCollectors === 'function') {
            console.log('Sobrescrevendo função loadCollectors');

            const originalLoadCollectors = window.loadCollectors;

            window.loadCollectors = function (forceRefresh = false) {
                // Se forçar atualização ou a função já estiver definida, usar nossa implementação
                if (forceRefresh) {
                    console.log('Forçando atualização de coletores');
                    CacheManager.clearCache('coletores');
                    return ApiService.loadColetores(true);
                }

                // Verificar cache primeiro
                const cachedData = CacheManager.getFromCache('coletores');
                if (cachedData) {
                    console.log('Usando cache de coletores');
                    window.collectors = cachedData;
                    updateUI(cachedData);
                    return Promise.resolve(cachedData);
                }

                // Tentar usar a função original
                try {
                    return originalLoadCollectors();
                } catch (error) {
                    console.error('Erro na função original loadCollectors:', error);
                    return ApiService.loadColetores();
                }
            };
        } else {
            // Definir a função se não existir
            window.loadCollectors = function (forceRefresh = false) {
                return ApiService.loadColetores(forceRefresh);
            };
        }

        console.log('Função loadCollectors substituída com sucesso');
    }

    /**
     * Sobrescreve a função excluirColetor ou a adiciona se não existir
     */
    function sobrescreverExcluirColetor() {
        window.excluirColetor = function (idColetor) {
            return ApiService.excluirColetor(idColetor);
        };

        console.log('Função excluirColetor definida/sobrescrita com sucesso');
    }

    /**
     * Adiciona estilos CSS necessários
     */
    function adicionarEstilosCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Botão excluir */
            .btn-delete {
                background-color: rgba(220, 53, 69, 0.1) !important;
                color: #dc3545 !important;
                transition: all 0.3s ease !important;
            }
            
            .btn-delete:hover {
                background-color: #dc3545 !important;
                color: white !important;
            }
            
            /* Botão devolver */
            .btn-return {
                background-color: rgba(255, 193, 7, 0.1) !important;
                color: #ffc107 !important;
                transition: all 0.3s ease !important;
            }
            
            .btn-return:hover {
                background-color: #ffc107 !important;
                color: white !important;
            }
            
            /* Animação para remoção de linha */
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; transform: translateX(30px); }
            }
            
            .removing-row {
                animation: fadeOut 0.5s ease forwards;
            }
        `;
        document.head.appendChild(style);
        console.log('Estilos CSS adicionados com sucesso');
    }

    // ===== Sincronização Periódica =====

    /**
     * Verifica a cada intervalo se há histórico pendente para sincronizar
     */
    function configurarSincronizacaoPeriodica() {
        // Verificar a cada 5 minutos se há histórico pendente
        setInterval(function () {
            try {
                const historicoLocal = localStorage.getItem('historico_pendente');
                if (!historicoLocal) return;

                const historico = JSON.parse(historicoLocal);
                if (!historico.length) return;

                console.log(`Sincronizando ${historico.length} registros de histórico pendentes`);

                // Enviar lote de registros pendentes
                fetch(`${CONFIG.API_ENDPOINTS.HISTORICO}/sincronizar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ registros: historico })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Erro na sincronização: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Histórico sincronizado com sucesso:', data);
                        localStorage.removeItem('historico_pendente');
                    })
                    .catch(error => {
                        console.error('Erro ao sincronizar histórico:', error);
                    });
            } catch (error) {
                console.error('Erro ao verificar histórico pendente:', error);
            }
        }, 5 * 60 * 1000); // 5 minutos
    }

    // ===== Inicialização =====

    /**
     * Inicializa o sistema
     */
    function init() {
        console.log("Inicializando sistema de sincronização...");

        // Adicionar estilos CSS
        adicionarEstilosCSS();

        // Sobrescrever funções existentes
        sobrescreverLoadCollectors();
        sobrescreverExcluirColetor();

        // Configurar observadores DOM
        configurarObservadores();

        // Configurar sincronização periódica
        configurarSincronizacaoPeriodica();

        // Adicionar evento ao botão de atualizar
        const refreshButton = document.getElementById('refreshActiveCollectors');
        if (refreshButton) {
            refreshButton.addEventListener('click', function () {
                CacheManager.clearCache('coletores');
                window.loadCollectors(true);
            });
        }

        // Inicializar os botões na tabela existente
        setTimeout(() => {
            adicionarBotaoExcluir();
            adicionarBotaoDevolver();
        }, 500);

        // Carregar coletores do cache ou servidor
        window.loadCollectors();

        console.log("Sistema de sincronização iniciado com sucesso");
    }

    // Iniciar o sistema
    init();
});


document.addEventListener('DOMContentLoaded', function () {
    // Carregar informações do usuário atual da sessão
    carregarDadosUsuario();

    // Carregar coletores do banco de dados
    carregarColetoresDoBanco();

    // Adicionar eventos aos botões de filtro
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function () {
            // Remover classe active de todos os botões
            document.querySelectorAll('.filter-button').forEach(btn => {
                btn.classList.remove('active');
            });

            // Adicionar classe active ao botão clicado
            this.classList.add('active');

            // Filtrar os coletores com base no botão clicado
            const filter = this.getAttribute('data-filter');
            renderizarColetores(filter);
        });
    });

    // Eventos para os modais
    document.getElementById('closeSelectModal').addEventListener('click', fecharModalSelecao);
    document.getElementById('cancelSelectModal').addEventListener('click', fecharModalSelecao);
    document.getElementById('confirmSelectCollector').addEventListener('click', function () {
        const collectorId = document.getElementById('modalCollectorId').textContent;
        selecionarColetor(collectorId);
    });

    document.getElementById('closeReturnModal').addEventListener('click', fecharModalDevolucao);
    document.getElementById('cancelReturnModal').addEventListener('click', fecharModalDevolucao);
    document.getElementById('confirmReturnCollector').addEventListener('click', function () {
        const collectorId = document.getElementById('modalReturnCollectorId').textContent;
        devolverColetor(collectorId);
    });
});

// Variáveis globais
let coletores = [];
let usuarioAtual = {
    id: 0,
    nome: '',
    matricula: '',
    setor: ''
};

// Função para carregar dados do usuário atual
function carregarDadosUsuario() {
    fetch('/api/session/user')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar dados do usuário: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            usuarioAtual = {
                id: data.id || 0,
                nome: data.nome || 'Usuário',
                matricula: data.matricula || '',
                setor: data.setor || ''
            };

            // Atualizar o nome na interface
            document.getElementById('userName').textContent = `Olá, ${usuarioAtual.nome}`;

            // Atualizar o avatar com as iniciais
            const userAvatar = document.querySelector('.user-avatar');
            if (userAvatar) {
                const initials = usuarioAtual.nome.split(' ').map(n => n[0]).join('');
                userAvatar.textContent = initials;
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados do usuário:', error);
            alert('Erro ao carregar dados do usuário. Recarregue a página e tente novamente.');
        });
}

// Função para carregar coletores do banco de dados
function carregarColetoresDoBanco() {
    fetch('/api/coletores')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar coletores: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Converter os dados para o formato que a interface espera
            coletores = data.map(c => ({
                id: c.id,
                status: converterStatus(c.status),
                usuario: c.usuario || '',
                setor: c.setor || '',
                battery: c.bateria || '100',
                model: c.modelo || 'Honeywell EDA61k'
            }));

            // Renderizar os coletores na interface
            renderizarColetores('all');
        })
        .catch(error => {
            console.error('Erro ao carregar coletores:', error);
            alert('Erro ao carregar coletores do banco de dados. Recarregue a página e tente novamente.');
        });
}

// Função para converter o status do banco para o formato da interface
function converterStatus(status) {
    switch (status) {
        case 'Disponível para Uso':
            return 'available';
        case 'Em Uso':
        case 'Ativo':
            return 'in-use';
        case 'Em manutenção':
        case 'Com problema':
        case 'Inativo':
            return 'maintenance';
        default:
            return 'available';
    }
}

// Função para renderizar os coletores na interface
function renderizarColetores(filter = 'all') {
    const grid = document.getElementById('collectorsGrid');
    grid.innerHTML = '';

    // Filtrar coletores conforme selecionado
    let filteredCollectors;
    if (filter === 'all') {
        filteredCollectors = coletores;
    } else {
        filteredCollectors = coletores.filter(c => c.status === filter);
    }

    if (filteredCollectors.length === 0) {
        grid.innerHTML = `
            <div class="no-collectors">
                <i class="fas fa-search"></i>
                <p>Nenhum coletor encontrado</p>
            </div>
        `;
        return;
    }

    // Criar card para cada coletor
    filteredCollectors.forEach(coletor => {
        const card = document.createElement('div');
        card.className = `collector-card collector-${coletor.status}`;
        card.setAttribute('data-id', coletor.id);

        // Determinar o status e a ação disponível
        let statusText, actionButton;
        if (coletor.status === 'available') {
            statusText = 'Disponível';
            actionButton = `<button class="action-button select" title="Selecionar coletor" data-id="${coletor.id}"><i class="fas fa-check"></i></button>`;
        } else if (coletor.status === 'in-use') {
            statusText = 'Em Uso';

            // Se o coletor está sendo usado pelo usuário atual, mostrar botão de devolução
            if (coletor.usuario === usuarioAtual.nome) {
                actionButton = `<button class="action-button return" title="Devolver coletor" data-id="${coletor.id}"><i class="fas fa-undo"></i></button>`;
            } else {
                actionButton = '';
            }
        } else { // maintenance
            statusText = 'Manutenção';
            actionButton = '';
        }

        // Conteúdo do card
        card.innerHTML = `
            <div class="collector-header">
                #${coletor.id}
                <div class="collector-status"></div>
            </div>
            <div class="collector-info">
                <div class="collector-user">${coletor.usuario || 'Nenhum usuário'}</div>
                <div class="collector-sector">${coletor.setor || 'Nenhum setor'}</div>
                <div class="collector-details">
                    <span><i class="fas fa-battery-half"></i> ${coletor.battery}%</span>
                    <span><i class="fas fa-tablet-alt"></i> ${coletor.model}</span>
                </div>
                ${actionButton}
            </div>
        `;

        grid.appendChild(card);
    });

    // Adicionar eventos aos botões de ação
    document.querySelectorAll('.action-button.select').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const collectorId = this.getAttribute('data-id');
            abrirModalSelecao(collectorId);
        });
    });

    document.querySelectorAll('.action-button.return').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const collectorId = this.getAttribute('data-id');
            abrirModalDevolucao(collectorId);
        });
    });

    // Adicionar evento de clique no card inteiro
    document.querySelectorAll('.collector-card').forEach(card => {
        card.addEventListener('click', function () {
            const collectorId = this.getAttribute('data-id');
            const coletor = coletores.find(c => c.id === collectorId);

            if (coletor.status === 'available') {
                abrirModalSelecao(collectorId);
            } else if (coletor.status === 'in-use' && coletor.usuario === usuarioAtual.nome) {
                abrirModalDevolucao(collectorId);
            }
        });
    });
}

// Função para abrir o modal de seleção de coletor
function abrirModalSelecao(collectorId) {
    document.getElementById('modalCollectorId').textContent = collectorId;
    document.getElementById('selectModal').classList.add('active');

    // Preencher o setor do usuário atual como padrão
    document.getElementById('userSector').value = usuarioAtual.setor || '';
}

// Função para abrir o modal de devolução de coletor
function abrirModalDevolucao(collectorId) {
    document.getElementById('modalReturnCollectorId').textContent = collectorId;
    document.getElementById('returnModal').classList.add('active');
}

// Função para fechar o modal de seleção
function fecharModalSelecao() {
    document.getElementById('selectModal').classList.remove('active');
}

// Função para fechar o modal de devolução
function fecharModalDevolucao() {
    document.getElementById('returnModal').classList.remove('active');
}

// Função para selecionar um coletor
function selecionarColetor(collectorId) {
    // Validar formulário
    const setor = document.getElementById('userSector').value;
    const turno = document.getElementById('userTurno').value;
    const observacoes = document.getElementById('userObservation').value;

    if (!setor || !turno) {
        alert('Por favor, preencha o setor e o turno.');
        return;
    }

    // Preparar dados para enviar ao servidor
    const dados = {
        usuario: usuarioAtual.nome,
        setor: setor,
        turno: turno,
        observacoes: observacoes || ""
    };

    // Enviar requisição para a API
    fetch(`/api/coletores/${collectorId}/selecionar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.erro || 'Erro ao selecionar coletor');
                });
            }
            return response.json();
        })
        .then(data => {
            // Fechar o modal
            fecharModalSelecao();

            // Recarregar os coletores
            carregarColetoresDoBanco();

            // Mostrar mensagem de sucesso
            alert(`Coletor #${collectorId} selecionado com sucesso!`);
        })
        .catch(error => {
            console.error('Erro ao selecionar coletor:', error);
            alert(`Erro ao selecionar coletor: ${error.message}`);
        });
}

// Função para devolver um coletor
function devolverColetor(collectorId) {
    // Obter observações
    const observacoes = document.getElementById('returnObservation').value;

    // Preparar dados para enviar ao servidor
    const dados = {
        observacoes: observacoes || "Devolvido via interface de seleção"
    };

    // Enviar requisição para a API
    fetch(`/api/coletores/${collectorId}/devolver`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.erro || 'Erro ao devolver coletor');
                });
            }
            return response.json();
        })
        .then(data => {
            // Fechar o modal
            fecharModalDevolucao();

            // Recarregar os coletores
            carregarColetoresDoBanco();

            // Mostrar mensagem de sucesso
            alert(`Coletor #${collectorId} devolvido com sucesso!`);
        })
        .catch(error => {
            console.error('Erro ao devolver coletor:', error);
            alert(`Erro ao devolver coletor: ${error.message}`);
        });

    // Adicione este código ao arquivo JavaScript da página de seleção de coletores
    // ou modifique o código existente na função selecionarColetor()

    function selecionarColetor(collectorId) {
        // Validar formulário
        const setor = document.getElementById('userSector').value;
        const turno = document.getElementById('userTurno').value;
        const observacoes = document.getElementById('userObservation').value;
        const dataHoraRetirada = document.getElementById('selectDateTime').value;

        if (!setor || !turno) {
            mostrarAlerta('Por favor, preencha o setor e o turno.', 'error');
            return;
        }

        // Mostrar loading no botão
        const btnConfirm = document.getElementById('confirmSelectCollector');
        const btnText = btnConfirm.textContent;
        btnConfirm.disabled = true;
        btnConfirm.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';

        // Preparar dados para enviar ao servidor
        const dados = {
            usuario: usuarioAtual.nome,
            matricula: usuarioAtual.matricula,
            setor: setor,
            turno: turno,
            data_hora_retirada: dataHoraRetirada,
            observacoes: observacoes || "",
            status: "Em Uso"
        };

        // Enviar requisição para a API
        fetch(`/api/coletores/${collectorId}/selecionar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.erro || 'Erro ao selecionar coletor');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Fechar o modal
                fecharModalSelecao();

                // Atualizar o coletor na lista local
                const index = coletores.findIndex(c => c.id === collectorId);
                if (index !== -1) {
                    coletores[index].status = 'in-use';
                    coletores[index].statusOriginal = 'Em Uso';
                    coletores[index].usuario = usuarioAtual.nome;
                    coletores[index].matricula = usuarioAtual.matricula; // Adicionado
                    coletores[index].setor = setor;
                    coletores[index].turno = turno; // Adicionado
                    coletores[index].dataRetirada = dataHoraRetirada.split(' ')[0]; // Adicionado
                    coletores[index].horaRetirada = dataHoraRetirada.split(' ')[1]; // Adicionado
                }

                // Recarregar os coletores
                renderizarColetores(document.querySelector('.filter-button.active').getAttribute('data-filter'));

                // Mostrar mensagem de sucesso
                mostrarAlerta(`Coletor #${collectorId} selecionado com sucesso por ${usuarioAtual.nome}!`, 'success');

                // Armazenar localmente os coletores do usuário atual
                salvarColetoresDoUsuario();
            })
            .catch(error => {
                console.error('Erro ao selecionar coletor:', error);
                mostrarAlerta(`Erro ao selecionar coletor: ${error.message}`, 'error');
            })
            .finally(() => {
                // Restaurar botão
                btnConfirm.disabled = false;
                btnConfirm.textContent = btnText;
            });
    }

    // Função para salvar localmente os coletores do usuário
    function salvarColetoresDoUsuario() {
        if (!usuarioAtual.matricula) return;

        // Filtrar apenas os coletores em uso pelo usuário atual
        const coletoresDoUsuario = coletores.filter(c =>
            c.status === 'in-use' && c.usuario === usuarioAtual.nome);

        // Salvar no localStorage
        localStorage.setItem(`coletores_${usuarioAtual.matricula}`,
            JSON.stringify(coletoresDoUsuario));
    }

    // Modificação na função renderizarColetores para mostrar melhor as informações do usuário
    function renderizarColetores(filter = 'all') {
        const grid = document.getElementById('collectorsGrid');
        grid.innerHTML = '';

        // Filtrar coletores conforme selecionado
        let filteredCollectors;
        if (filter === 'all') {
            filteredCollectors = coletores;
        } else {
            filteredCollectors = coletores.filter(c => c.status === filter);
        }

        if (filteredCollectors.length === 0) {
            grid.innerHTML = `
            <div class="no-collectors">
                <i class="fas fa-search"></i>
                <p>Nenhum coletor encontrado</p>
            </div>
        `;
            return;
        }

        // Criar card para cada coletor
        filteredCollectors.forEach(coletor => {
            const card = document.createElement('div');
            card.className = `collector-card collector-${coletor.status}`;
            card.setAttribute('data-id', coletor.id);

            // Determinar o status e a ação disponível
            let statusText, actionButton;
            let infoExtra = '';

            if (coletor.status === 'available') {
                statusText = 'Disponível';
                actionButton = `<button class="action-button select" title="Selecionar coletor" data-id="${coletor.id}"><i class="fas fa-check"></i></button>`;
            } else if (coletor.status === 'in-use') {
                statusText = 'Em Uso';

                // Informações extras para coletores em uso
                if (coletor.dataRetirada && coletor.horaRetirada) {
                    infoExtra = `
                    <div class="collector-extra-info">
                        <div class="collector-date"><i class="far fa-calendar-alt"></i> ${coletor.dataRetirada}</div>
                        <div class="collector-time"><i class="far fa-clock"></i> ${coletor.horaRetirada}</div>
                        ${coletor.turno ? `<div class="collector-shift"><i class="fas fa-user-clock"></i> ${coletor.turno}</div>` : ''}
                    </div>
                `;
                }

                // Se o coletor está sendo usado pelo usuário atual, mostrar botão de devolução
                if (coletor.usuario === usuarioAtual.nome) {
                    actionButton = `<button class="action-button return" title="Devolver coletor" data-id="${coletor.id}"><i class="fas fa-undo"></i></button>`;
                } else {
                    actionButton = '';
                }
            } else { // maintenance
                statusText = 'Manutenção';
                actionButton = '';
            }

            // Status original para exibição no status-pill
            const statusOriginalText = coletor.statusOriginal || statusText;

            // Adicionar badge de matrícula para coletores em uso
            let matriculaBadge = '';
            if (coletor.status === 'in-use' && coletor.matricula) {
                matriculaBadge = `<div class="collector-badge">${coletor.matricula}</div>`;
            }

            // Conteúdo do card - Incluindo o botão de status e informações extras
            card.innerHTML = `
            <div class="collector-header">
                #${coletor.id}
                <div class="collector-status"></div>
                ${matriculaBadge}
            </div>
            <div class="collector-info">
                <div class="collector-user">${coletor.usuario || 'Nenhum usuário'}</div>
                <div class="collector-sector">${coletor.setor || 'Nenhum setor'}</div>
                ${infoExtra}
                <div class="collector-details">
                    <span><i class="fas fa-battery-half"></i> ${coletor.battery}%</span>
                    <span><i class="fas fa-tablet-alt"></i> ${coletor.model}</span>
                </div>
                ${actionButton}
                <div class="collector-status-container">
                    <span class="status-pill status-${coletor.status}" data-id="${coletor.id}">${statusOriginalText}</span>
                </div>
            </div>
        `;

            grid.appendChild(card);
        });

        // Adicionar eventos aos botões de ação
        // [resto do código existente para adicionar eventos]
    }

    // Modifique a função carregarColetoresDoBanco() para capturar todas as informações
    function carregarColetoresDoBanco() {
        // Mostrar spinner de carregamento
        loadingSpinner.style.display = 'block';
        collectorsGrid.style.display = 'none';
        errorContainer.style.display = 'none';

        return fetch('/api/coletores')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar coletores: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Converter os dados para o formato que a interface espera
                coletores = data.map(c => ({
                    id: c.id,
                    status: converterStatus(c.status),
                    statusOriginal: c.status,
                    usuario: c.usuario || '',
                    matricula: c.matricula || '', // Capturar a matrícula
                    setor: c.setor || '',
                    turno: c.turno || '', // Capturar o turno
                    battery: c.bateria || '100',
                    model: c.modelo || 'Honeywell EDA61k',
                    dataRetirada: c.data_vigente || '', // Capturar data de retirada
                    horaRetirada: c.hora_registro || '' // Capturar hora de retirada
                }));

                // Marcar coletores do usuário atual
                marcarColetoresDoUsuario();

                // Esconder spinner e mostrar grid
                loadingSpinner.style.display = 'none';
                collectorsGrid.style.display = 'grid';

                // Renderizar os coletores na interface
                renderizarColetores('all');
            })
            .catch(error => {
                console.error('Erro ao carregar coletores:', error);

                // Esconder spinner e mostrar mensagem de erro
                loadingSpinner.style.display = 'none';
                mostrarErro('Erro ao carregar coletores do banco de dados. Tente novamente.');
            });
    }

    // Função para marcar os coletores do usuário atual
    function marcarColetoresDoUsuario() {
        coletores.forEach(coletor => {
            if (coletor.status === 'in-use' && coletor.usuario === usuarioAtual.nome) {
                coletor.meuColetor = true;
            } else {
                coletor.meuColetor = false;
            }
        });
    }

    // Modifique a função devolverColetor() para limpar os dados do usuário
    function devolverColetor(collectorId) {
        // Obter observações e data/hora
        const observacoes = document.getElementById('returnObservation').value;
        const dataHoraDevolucao = document.getElementById('returnDateTime').value;

        // Mostrar loading no botão
        const btnConfirm = document.getElementById('confirmReturnCollector');
        const btnText = btnConfirm.textContent;
        btnConfirm.disabled = true;
        btnConfirm.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';

        // Preparar dados para enviar ao servidor
        const dados = {
            observacoes: observacoes || "Devolvido via interface de seleção",
            data_devolucao: dataHoraDevolucao.split(' ')[0] || formatarData(),
            hora_devolucao: dataHoraDevolucao.split(' ')[1] || formatarHora(),
            matricula: usuarioAtual.matricula
        };

        // Enviar requisição para a API
        fetch(`/api/coletores/${collectorId}/devolver`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.erro || 'Erro ao devolver coletor');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Fechar o modal
                fecharModalDevolucao();

                // Atualizar o coletor na lista local
                const index = coletores.findIndex(c => c.id === collectorId);
                if (index !== -1) {
                    coletores[index].status = 'available';
                    coletores[index].statusOriginal = 'Disponível para Uso';
                    coletores[index].usuario = '';
                    coletores[index].matricula = ''; // Limpar matrícula
                    coletores[index].setor = '';
                    coletores[index].turno = ''; // Limpar turno
                    coletores[index].dataRetirada = ''; // Limpar data de retirada
                    coletores[index].horaRetirada = ''; // Limpar hora de retirada
                    coletores[index].meuColetor = false;
                }

                // Recarregar os coletores
                renderizarColetores(document.querySelector('.filter-button.active').getAttribute('data-filter'));

                // Atualizar coletores do usuário no localStorage
                salvarColetoresDoUsuario();

                // Mostrar mensagem de sucesso
                mostrarAlerta(`Coletor #${collectorId} devolvido com sucesso!`, 'success');
            })
            .catch(error => {
                console.error('Erro ao devolver coletor:', error);
                mostrarAlerta(`Erro ao devolver coletor: ${error.message}`, 'error');
            })
            .finally(() => {
                // Restaurar botão
                btnConfirm.disabled = false;
                btnConfirm.textContent = btnText;
            });
    }

}

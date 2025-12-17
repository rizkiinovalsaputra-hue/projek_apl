class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.init();
    }

    init() {
        this.updateStats();
        this.renderTasks();
        this.bindEvents();
    }

    loadTasks() {
        const tasks = localStorage.getItem('todoTasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    addTask(title, description) {
        const task = {
            id: Date.now(),
            title: title,
            description: description,
            completed: false,
            createdAt: new Date().toLocaleString('id-ID')
        };
        this.tasks.push(task);
        this.saveTasks();
        this.updateStats();
        this.renderTasks();
    }

    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.updateStats();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        if (confirm('Yakin ingin menghapus tugas ini?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.updateStats();
            this.renderTasks();
        }
    }

    editTask(id, title, description) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.title = title;
            task.description = description;
            this.saveTasks();
            this.updateStats();
            this.renderTasks();
        }
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('total-tasks').textContent = `Total: ${total}`;
        document.getElementById('completed-tasks').textContent = `Selesai: ${completed}`;
        document.getElementById('pending-tasks').textContent = `Pending: ${pending}`;

        document.getElementById('home-total').textContent = total;
        document.getElementById('home-completed').textContent = completed;
        document.getElementById('home-pending').textContent = pending;
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        
        if (this.tasks.length === 0) {
            container.innerHTML = '<p class="no-tasks">Belum ada tugas</p>';
            return;
        }

        container.innerHTML = this.tasks.map(task => `
            <div class="task-item">
                <div class="task-header">
                    <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
                    <div class="task-actions">
                        <button class="btn-small btn-success" onclick="app.toggleComplete(${task.id})">
                            ${task.completed ? 'Batal' : 'Selesai'}
                        </button>
                        <button class="btn-small btn-warning" onclick="openEditModal(${task.id})">Edit</button>
                        <button class="btn-small btn-danger" onclick="app.deleteTask(${task.id})">Hapus</button>
                    </div>
                </div>
                ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
                <div class="task-date">Dibuat: ${task.createdAt}</div>
            </div>
        `).join('');
    }

    bindEvents() {
        document.getElementById('add-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('task-title').value.trim();
            const description = document.getElementById('task-desc').value.trim();
            
            if (title) {
                this.addTask(title, description);
                document.getElementById('add-form').reset();
                showSection('view');
            }
        });

        document.getElementById('edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('edit-id').value);
            const title = document.getElementById('edit-title').value.trim();
            const description = document.getElementById('edit-desc').value.trim();
            
            if (title) {
                this.editTask(id, title, description);
                closeEditModal();
            }
        });
    }
}

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`${sectionName}-section`).classList.add('active');
    event.target.classList.add('active');
}

function openEditModal(id) {
    const task = app.tasks.find(t => t.id === id);
    if (task) {
        document.getElementById('edit-id').value = task.id;
        document.getElementById('edit-title').value = task.title;
        document.getElementById('edit-desc').value = task.description;
        document.getElementById('edit-modal').style.display = 'block';
    }
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('edit-modal');
    if (event.target === modal) {
        closeEditModal();
    }
}

const app = new TodoApp();
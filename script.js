        let tasks = [
            { id: 1, text: 'Сдать проект по работе', priority: 'high', done: false },
            { id: 2, text: 'Купить продукты', priority: 'medium', done: false },
            { id: 3, text: 'Прочитать статью', priority: 'low', done: true }
        ];
        let nextId = 4;

        function render() {
            const list = document.getElementById('taskList');
            list.innerHTML = '';
            let doneCount = 0;

            tasks.forEach(t => {
                if (t.done) doneCount++;
                const div = document.createElement('div');
                div.className = `task task-priority-${t.priority}${t.done ? ' done' : ''}`;
                div.innerHTML = `
                    <span class="task-text">${t.text}</span>
                    <button class="task-delete" onclick="event.stopPropagation(); deleteTask(${t.id})">✕</button>
                `;
                div.onclick = () => toggleTask(t.id);
                list.appendChild(div);
            });

            document.getElementById('totalTasks').textContent = tasks.length;
            document.getElementById('doneTasks').textContent = doneCount;
            document.getElementById('pendingTasks').textContent = tasks.length - doneCount;
        }

        function addTask() {
            const input = document.getElementById('taskInput');
            const text = input.value.trim();
            if (!text) {
                showToast('⚠️ Введите текст задачи');
                return;
            }
            const priority = document.getElementById('prioritySelect').value;
            tasks.push({ id: nextId++, text, priority, done: false });
            input.value = '';
            render();
            showToast('✅ Задача добавлена');
        }

        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.done = !task.done;
                showToast(task.done ? '✅ ' + task.text : '↩️ ' + task.text + ' (возвращено)');
                render();
            }
        }

        function deleteTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task && confirm('Удалить задачу: "' + task.text + '"?')) {
                tasks = tasks.filter(t => t.id !== id);
                render();
                showToast('🗑️ Задача удалена');
            }
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 1500);
        }

        render();
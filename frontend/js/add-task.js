document.addEventListener('DOMContentLoaded', function () {
  const addTaskForm = document.getElementById('addTaskForm');

  addTaskForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
      const title = document.getElementById('taskTitle').value.trim();
      const description = document.getElementById('taskDescription').value.trim();
      const dueDate = document.getElementById('dueDate').value;
      const priority = document.getElementById('priority').value;
      const category = document.getElementById('category').value.trim();

      if (!title || !description || !dueDate || !priority || !category) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }

      await createTask(title, description, dueDate, priority, category);

      addTaskForm.reset();

      alert('Tarefa adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      alert('Erro ao adicionar tarefa: ' + error.message);
    }
  });

  async function createTask(title, description, dueDate, priority, category) {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-parse-session-token': sessionToken
        },
        body: JSON.stringify({ title, description, dueDate, priority, category }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar tarefa no servidor.');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
});
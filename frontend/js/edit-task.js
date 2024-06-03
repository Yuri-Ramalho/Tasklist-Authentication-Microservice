
document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get('taskId');

  if (taskId) {
    fetchTask(taskId);
  } else {
    alert('No task ID found in the URL.');
  }

  document.getElementById('editTaskForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    await saveTask(taskId);
  });
});

async function fetchTask(taskId) {
  try {
    const sessionToken = localStorage.getItem('sessionToken');
    const response = await fetch(`/api/tasks/${taskId}`, {
      headers: {
        'x-parse-session-token': sessionToken
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar tarefa no servidor.');
    }

    const task = await response.json();

    task.dueDate = task.dueDate.toString(); 
    populateForm(task);
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    alert('Erro ao buscar tarefa: ' + error.message);
  }
}

function populateForm(task) {
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDescription').value = task.description;
  document.getElementById('dueDate').value = task.dueDate;
  document.getElementById('priority').value = task.priority;
  document.getElementById('category').value = task.category;
}

async function saveTask(taskId) {
  try {
    const sessionToken = localStorage.getItem('sessionToken');
    const task = {
      title: document.getElementById('taskTitle').value,
      description: document.getElementById('taskDescription').value,
      dueDate: document.getElementById('dueDate').value, 
      priority: document.getElementById('priority').value,
      category: document.getElementById('category').value
    };

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-parse-session-token': sessionToken
      },
      body: JSON.stringify(task)
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar tarefa no servidor.');
    }

    alert('Task updated successfully.');
    window.location.href = '../html/task-list.html';
  } catch (error) {
    console.error('Erro ao salvar tarefa:', error);
    alert('Erro ao salvar tarefa: ' + error.message);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  loadTasks();
});

async function loadTasks() {
  try {
    const sessionToken = localStorage.getItem('sessionToken');
    const response = await fetch('/api/tasks', {
      headers: {
        'x-parse-session-token': sessionToken
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    alert('Error fetching tasks: ' + error.message);
  }
}

function displayTasks(tasks) {
  const taskListBody = document.getElementById('task-list-body');
  taskListBody.innerHTML = ''; 

  tasks.forEach(task => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>${new Date(task.dueDate).toLocaleDateString()}</td>
      <td>${task.priority}</td>
      <td>${task.category}</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-primary btn-sm edit-button" data-task-id="${task.objectId}"><i class="fas fa-edit"></i> Edit</button>
          <button class="btn btn-danger btn-sm delete-button"><i class="fas fa-trash-alt"></i> Delete</button>
        </div>
      </td>
    `;


    row.querySelector('.edit-button').addEventListener('click', () => {
      const taskId = row.querySelector('.edit-button').getAttribute('data-task-id');
      window.location.href = `../html/edit-task.html?taskId=${taskId}`;
    });

    row.querySelector('.delete-button').addEventListener('click', async () => {
      const confirmDeleteTaskModal = new bootstrap.Modal(document.getElementById('deleteTaskModal'));
      const confirmDeleteTaskButton = document.getElementById('confirmDeleteTask');

      confirmDeleteTaskButton.onclick = async function () {
        try {
          const taskId = task.objectId; 

          const sessionToken = localStorage.getItem('sessionToken');
          const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-parse-session-token': sessionToken
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete task');
          }


          row.remove();
          confirmDeleteTaskModal.hide();
        } catch (error) {
          console.error('Error deleting task:', error);
          alert('Error deleting task: ' + error.message);
        }
      };

      confirmDeleteTaskModal.show();
    });

    taskListBody.appendChild(row);
  });
}

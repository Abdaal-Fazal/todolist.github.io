
let tasks = loadTasks(); 


function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
}


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function addTask() {
    const inputElement = document.getElementById("taskinput");
    const taskText = inputElement.value.trim();
    const taskList = document.getElementById("tasklist");

    if (taskText === "") {
        alert("Please enter a task before adding.");
        return;
    }

   
    const newTask = {
        id: Date.now(), 
        text: taskText,
        completed: false
    };

    tasks.unshift(newTask);
    saveTasks();

   
    renderTask(newTask);

    
    inputElement.value = "";
}


function renderTask(task) {
    const taskList = document.getElementById("tasklist");
    
   
    const listItem = document.createElement('li');
    if (task.completed) {
        listItem.classList.add('completed');
    }
   
    listItem.dataset.taskId = task.id;

   
    const taskSpan = document.createElement('span');
    taskSpan.classList.add('task-text');
    taskSpan.innerText = task.text;
    listItem.appendChild(taskSpan);

   
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('task-buttons'); 
    
   
    const completeButton = document.createElement('button');
    completeButton.innerText = task.completed ? 'Undo' : 'Done';
    completeButton.classList.add('complete-btn');
    
   
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('delete-btn');

    
    buttonContainer.appendChild(completeButton);
    buttonContainer.appendChild(deleteButton);
    listItem.appendChild(buttonContainer);
    taskList.prepend(listItem); 
}


function toggleComplete(taskId, listItem, button) {
  
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();

      
        listItem.classList.toggle('completed');
       
        button.innerText = tasks[taskIndex].completed ? 'Undo' : 'Done';
    }
}


function deleteTask(taskId, listItem) {
    const taskList = document.getElementById("tasklist");

   
    taskList.removeChild(listItem);

   
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks(); 
}


document.addEventListener('DOMContentLoaded', () => {
  
    tasks.forEach(task => renderTask(task));

   
    const taskList = document.getElementById("tasklist");
    taskList.addEventListener('click', function(e) {
        const target = e.target;
     
        const listItem = target.closest('li');
        if (!listItem) return;

      
        const taskId = parseInt(listItem.dataset.taskId);

       
        if (target.classList.contains('complete-btn')) {
            toggleComplete(taskId, listItem, target);
        } else if (target.classList.contains('delete-btn')) {
           
            if (confirm("Are you sure you want to delete this task?")) {
                 deleteTask(taskId, listItem);
            }
        }
    });

  
    document.getElementById("taskinput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") { 
            event.preventDefault();
            addTask();
        }
    });
});


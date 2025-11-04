// A global array to hold our tasks, loaded from Local Storage
let tasks = loadTasks(); 

// --- 1. Load Tasks from Local Storage on page load ---
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
}

// --- 2. Save Tasks to Local Storage ---
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// --- 3. Main Add Task Function (called by button/Enter key) ---
function addTask() {
    const inputElement = document.getElementById("taskinput");
    const taskText = inputElement.value.trim();
    const taskList = document.getElementById("tasklist");

    if (taskText === "") {
        alert("Please enter a task before adding.");
        return;
    }

    // Create a new task object
    const newTask = {
        id: Date.now(), // Use a timestamp for a unique ID
        text: taskText,
        completed: false
    };

    tasks.unshift(newTask); // Add to the beginning of the array
    saveTasks(); // Save the updated array to storage

    // Render the new task to the DOM
    renderTask(newTask);

    // Clear the input field
    inputElement.value = "";
}

// --- 4. Render a single task to the DOM ---
function renderTask(task) {
    const taskList = document.getElementById("tasklist");
    
    // Create the list item (li)
    const listItem = document.createElement('li');
    if (task.completed) {
        listItem.classList.add('completed');
    }
    // Store the task ID on the DOM element for use with Event Delegation
    listItem.dataset.taskId = task.id;

    // Create a span for the text content
    const taskSpan = document.createElement('span');
    taskSpan.classList.add('task-text');
    taskSpan.innerText = task.text;
    listItem.appendChild(taskSpan);

    // Create the button container
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('task-buttons'); 
    
    // Create Complete Button
    const completeButton = document.createElement('button');
    completeButton.innerText = task.completed ? 'Undo' : 'Done';
    completeButton.classList.add('complete-btn');
    
    // Create Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('delete-btn');

    // Assemble and Append
    buttonContainer.appendChild(completeButton);
    buttonContainer.appendChild(deleteButton);
    listItem.appendChild(buttonContainer);
    taskList.prepend(listItem); // Prepend so new tasks appear at the top
}

// --- 5. Toggle Complete State (Used by Event Delegation) ---
function toggleComplete(taskId, listItem, button) {
    // Find the task in the global array and flip its completed status
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks(); // Save the updated array

        // Update the DOM element's class
        listItem.classList.toggle('completed');
        // Update the button text
        button.innerText = tasks[taskIndex].completed ? 'Undo' : 'Done';
    }
}

// --- 6. Delete Task (Used by Event Delegation) ---
function deleteTask(taskId, listItem) {
    const taskList = document.getElementById("tasklist");

    // Remove the task from the DOM
    taskList.removeChild(listItem);

    // Filter the task out of the global array
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks(); // Save the updated array
}

// --- 7. Initial Render and Event Listeners Setup ---
document.addEventListener('DOMContentLoaded', () => {
    // Render all saved tasks when the page first loads
    tasks.forEach(task => renderTask(task));

    // Event Delegation: Attach a single click listener to the UL
    const taskList = document.getElementById("tasklist");
    taskList.addEventListener('click', function(e) {
        const target = e.target;
        // Find the closest parent <li> (the task item)
        const listItem = target.closest('li');
        if (!listItem) return;

        // Get the taskId from the <li>'s data attribute
        const taskId = parseInt(listItem.dataset.taskId);

        // Check which button was clicked
        if (target.classList.contains('complete-btn')) {
            toggleComplete(taskId, listItem, target);
        } else if (target.classList.contains('delete-btn')) {
            // Confirmation dialog before deleting
            if (confirm("Are you sure you want to delete this task?")) {
                 deleteTask(taskId, listItem);
            }
        }
    });

    // Allow pressing 'Enter' to add the task
    document.getElementById("taskinput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") { 
            event.preventDefault();
            addTask();
        }
    });
});

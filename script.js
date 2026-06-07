// script.js

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// ADD TASK
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

// RENDER TASKS
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.classList.add("task");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div class="task-left">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <span class="task-text">
                    ${task.text}
                </span>

            </div>

            <div class="task-actions">

                <button class="edit-btn" onclick="editTask(${task.id})">
                    <i class='bx bx-edit'></i>
                </button>

                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class='bx bx-trash'></i>
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

// TOGGLE TASK
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// DELETE TASK
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// EDIT TASK
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    const updatedText = prompt("Edit Task:", task.text);

    if (updatedText !== null && updatedText.trim() !== "") {

        task.text = updatedText.trim();

        saveTasks();
        renderTasks();
    }
}

// SAVE TASKS
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// UPDATE STATS
function updateStats() {

    totalTasks.textContent = `Total: ${tasks.length}`;

    const completed = tasks.filter(task => task.completed).length;

    completedTasks.textContent = `Completed: ${completed}`;
}

// FILTERS
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

// INITIAL RENDER
renderTasks();
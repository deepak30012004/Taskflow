// === GLOBAL STATE ===
let tasks = []; // All tasks
let currentStage = "todo"; // Default visible stage

// === LOAD USER ===
const userData = JSON.parse(localStorage.getItem("user"));
if (!userData) {
  window.location.href = "index.html";
} else {
  document.getElementById("user-name").textContent = userData.name;
  document.getElementById("user-avatar").src = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(userData.name)}`;
}

// === SIGN OUT ===
document.getElementById("sign-out").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

// === INITIALIZE APP ===
window.addEventListener("DOMContentLoaded", async () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks && storedTasks.length) {
    tasks = storedTasks;
  } else {
    // First-time load: fetch dummy data
    const res = await fetch("https://dummyjson.com/todos");
    const data = await res.json();
    tasks = data.todos.slice(0, 5).map(todo => ({
      id: crypto.randomUUID(),
      text: todo.todo,
      stage: "todo",
      updatedAt: new Date().toLocaleString()
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  renderTasks();
});



const toggleBtn = document.getElementById("theme-toggle");
const body = document.querySelector("body");

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("light");
});

// === ADD TASK ===
document.getElementById("task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("task-input");
  const text = input.value.trim();

  if (!text) return;

  const newTask = {
    id: crypto.randomUUID(),
    text,
    stage: "todo",
    updatedAt: new Date().toLocaleString()
  };

  tasks.push(newTask);
  saveTasks();
  input.value = "";
  renderTasks();
});

// === TABS ===
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelector(".tab.active").classList.remove("active");
    tab.classList.add("active");
    currentStage = tab.dataset.stage;
    renderTasks();
  });
});

// === RENDER TASKS ===
function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  const filtered = tasks.filter(task => task.stage === currentStage);

  // Update counts
  document.getElementById("todo-count").textContent = tasks.filter(t => t.stage === "todo").length;
  document.getElementById("completed-count").textContent = tasks.filter(t => t.stage === "completed").length;
  document.getElementById("archived-count").textContent = tasks.filter(t => t.stage === "archived").length;

  filtered.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card";

    const content = document.createElement("div");
    content.className = "task-content";
    content.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    // Stage-based action buttons
    if (task.stage === "todo") {
      actions.appendChild(createButton("Mark as completed", "complete-btn", () => moveTask(task.id, "completed")));
      actions.appendChild(createButton("🗃️ Archive", "archive-btn", () => moveTask(task.id, "archived")));
    } else if (task.stage === "completed") {
      actions.appendChild(createButton("↩️ Move to Todo", "archive-btn", () => moveTask(task.id, "todo")));
      actions.appendChild(createButton("🗃️ Archive", "archive-btn", () => moveTask(task.id, "archived")));
    } else if (task.stage === "archived") {
      actions.appendChild(createButton("↩️ Move to Todo", "archive-btn", () => moveTask(task.id, "todo")));
      actions.appendChild(createButton("✅ Move to Completed", "complete-btn", () => moveTask(task.id, "completed")));
    }

    const time = document.createElement("div");
    time.className = "task-timestamp";
    time.textContent = `Last modified at: ${task.updatedAt}`;

    card.appendChild(content);
    card.appendChild(actions);
    card.appendChild(time);

    list.appendChild(card);
  });
}

// === HELPER: Create Button ===
function createButton(text, className, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = className;
  btn.addEventListener("click", onClick);
  return btn;
}

// === MOVE TASK ===
function moveTask(id, newStage) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.stage = newStage;
    task.updatedAt = new Date().toLocaleString();
    saveTasks();
    renderTasks();
  }
}

// === SAVE TO LOCALSTORAGE ===
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

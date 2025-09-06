let tasks = []
let currentFilter = "all"
let taskId = 0

const form = document.getElementById("taskForm")
const taskInput = document.getElementById("taskInput")
const prioritySelect = document.getElementById("prioritySelect")
const tasksList = document.getElementById("tasksList")
const filterButtons = document.querySelectorAll("[data-filter]")
const clearSection = document.getElementById("clearSection")
const clearCompletedBtn = document.getElementById("clearCompleted")

function sortTasks() {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    tasks.sort((a, b) => {
        if (a.done === b.done) {
            return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        return a.done - b.done
    })
}

form.addEventListener("submit", function (e) {
    e.preventDefault()

    let taskValue = taskInput.value.trim()
    let priorityValue = prioritySelect.value

    if (taskValue === "") return

    let task = {
        id: taskId++,
        text: taskValue,
        priority: priorityValue,
        done: false
    }

    tasks.push(task)
    sortTasks()
    renderTasks()
    form.reset()
})

function renderTasks() {
    tasksList.innerHTML = ""

    let filteredTasks = tasks.filter((t) => {
        if (currentFilter === "all") return true
        if (currentFilter === "pending") return !t.done
        if (currentFilter === "completed") return t.done
        if (currentFilter === "high") return t.priority === "high"
    })

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
      <div class="text-center text-muted py-5">
        <i class="bi bi-clipboard-check fs-1 d-block mb-2"></i>
        <p>No tasks yet</p>
      </div>`
        clearSection.classList.add("d-none")
        return
    }

    filteredTasks.forEach((t) => {
        let taskDiv = document.createElement("div")
        taskDiv.className = `list-group-item d-flex justify-content-between align-items-center mb-2 rounded task priority-${t.priority} ${t.done ? "done" : ""}`

        taskDiv.innerHTML = `
      <span class="${t.done ? "text-decoration-line-through text-muted" : ""}">
        ${t.text}
      </span>
      <div>
        <button class="btn btn-sm ${t.done ? "btn-outline-success" : "btn-secondary"} me-2" onclick="toggleDone(${t.id})">
          <i class="bi ${t.done ? "bi-check-circle text-success" : "bi-square"}"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${t.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `
        tasksList.appendChild(taskDiv)
    })

    const hasCompleted = tasks.some((t) => t.done)
    clearSection.classList.toggle("d-none", !hasCompleted)
}

function toggleDone(id) {
    let task = tasks.find((t) => t.id === id)
    if (task) {
        task.done = !task.done
        sortTasks()
        renderTasks()
    }
}

function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id)
    sortTasks()
    renderTasks()
}

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")
        currentFilter = btn.getAttribute("data-filter")
        renderTasks()
    })
})

clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.done)
    renderTasks()
})

renderTasks()

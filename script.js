
const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(
    localStorage.getItem("studentTasks") || "[]"
);

function saveTasks() {
    localStorage.setItem(
        "studentTasks",
        JSON.stringify(tasks)
    );
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.sort((a, b) =>
        a.deadline.localeCompare(b.deadline)
    );

    tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task";

        const title = document.createElement("h3");
        title.textContent = task.name;

        const details = document.createElement("p");
        details.textContent =
            "Deadline: " + task.deadline +
            " | Priority: " + task.priority;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(task.deadline + "T00:00:00");

        const daysLeft = Math.round(
            (dueDate - today) / (1000 * 60 * 60 * 24)
        );

        let deadlineMessage;

        if (task.done) {
            deadlineMessage = "Status: Completed";
        } else if (daysLeft < 0) {
            deadlineMessage =
                "Overdue by " + Math.abs(daysLeft) + " day(s)";
        } else if (daysLeft === 0) {
            deadlineMessage = "Due Today!";
        } else if (daysLeft <= 2) {
            deadlineMessage =
                "Urgent! " + daysLeft + " day(s) left";
        } else {
            deadlineMessage = daysLeft + " day(s) left";
        }

        const status = document.createElement("p");
        status.textContent = deadlineMessage;

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.done
            ? "Mark Pending"
            : "Mark Completed";

        completeBtn.onclick = function () {
            task.done = !task.done;
            saveTasks();
            renderTasks();
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete Task";
        deleteBtn.style.background = "#dc2626";
        deleteBtn.style.marginTop = "8px";

        deleteBtn.onclick = function () {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        };

        div.append(title, details, status, completeBtn, deleteBtn);
        taskList.appendChild(div);
    });

    document.getElementById("total").textContent = tasks.length;

    document.getElementById("pending").textContent =
        tasks.filter(task => !task.done).length;

    document.getElementById("completed").textContent =
        tasks.filter(task => task.done).length;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("taskName").value.trim();
    const deadline = document.getElementById("deadline").value;
    const priority = document.getElementById("priority").value;

    if (!name || !deadline) {
        alert("Please enter task name and deadline!");
        return;
    }

    tasks.push({
        id: Date.now(),
        name: name,
        deadline: deadline,
        priority: priority,
        done: false
    });

    saveTasks();
    renderTasks();
    form.reset();
});

renderTasks();

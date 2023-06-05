import { v4 as uuidV4 } from 'uuid';

const list = document.querySelector<HTMLUListElement>('#task-list');
const taskInput = document.querySelector<HTMLInputElement>('#task-title');
const form = document.querySelector<HTMLFormElement>('#form');

type Task = {
  id: string;
  title: string;
  complete: boolean;
  createdAt: Date;
};

let taskList: Task[] = loadTasks();

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (taskInput?.value === '' || taskInput?.value === undefined) return;

  const newTask: Task = {
    id: uuidV4(),
    title: taskInput.value,
    complete: false,
    createdAt: new Date(),
  };

  taskList.push(newTask);
  saveTasks();
  addNewTask(newTask);
  taskInput.value = '';
});

function addNewTask(task: Task) {
  const li = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  const i = document.createElement('i');
  checkbox.type = 'checkbox';
  checkbox.checked = task.complete;

  task.complete
    ? (label.style.textDecoration = 'line-through')
    : (label.style.textDecoration = 'none');

  checkbox.addEventListener('change', () => {
    task.complete = checkbox.checked;
    task.complete
      ? (label.style.textDecoration = 'line-through')
      : (label.style.textDecoration = 'none');

    saveTasks();
  });

  i.classList.add('bx', 'bx-trash');

  i.addEventListener('click', () => {
    li.style.display = 'none';
    const newTask = taskList.filter((taskItem) => taskItem.id !== task.id);
    taskList = newTask;
    saveTasks();
  });

  label.append(checkbox, task.title);
  li.append(label, i);
  list?.append(li);
}

function loadTasks(): Task[] {
  const tasks = localStorage.getItem('tasks');
  if (tasks) {
    return JSON.parse(tasks);
  }
  return [];
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(taskList));
}

function renderTask() {
  taskList.forEach((task) => {
    addNewTask(task);
  });
}

renderTask();

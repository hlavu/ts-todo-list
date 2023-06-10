import { v4 as uuidV4 } from 'uuid';

const list = document.querySelector<HTMLUListElement>('#list');
const taskInput = document.querySelector<HTMLInputElement>('#task-title');
const form = document.querySelector<HTMLFormElement>('#form');
const toastList = document.querySelector<HTMLDivElement>('#toast-list');
const deleteModal = document.querySelector<HTMLDivElement>('#delete-modal');
const cancelBtn = document.querySelector<HTMLButtonElement>('.cancel');
const deleteBtn = document.querySelector<HTMLButtonElement>('.delete');

type Task = {
  id: string;
  title: string;
  complete: boolean;
  createdAt: Date;
};

let taskList: Task[] = loadTasks();

form?.addEventListener('submit', (e) => {
  taskList = loadTasks();
  e.preventDefault();
  if (taskInput?.value === '' || taskInput?.value === undefined) {
    showToast('Invalid task title!');
    return;
  }

  if (validateNewTask(taskInput.value.trim())) {
    showToast('Task already exists!');
    return;
  }

  const newTask: Task = {
    id: uuidV4(),
    title: taskInput.value.trim(),
    complete: false,
    createdAt: new Date(),
  };

  taskList.push(newTask);
  addNewTask(newTask);
  saveTasks(taskList, true);
  taskInput.value = '';
});

function addNewTask(task: Task) {
  const li = document.createElement('li');
  li.id = task.id;
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  const i = document.createElement('i');
  i.id = task.id;

  checkbox.type = 'checkbox';
  checkbox.checked = task.complete;

  styleLabel(task.complete, label);
  checkbox.addEventListener('change', () => {
    task.complete = checkbox.checked;
    styleLabel(task.complete, label);
    saveTasks(taskList);
  });

  i.classList.add('bx', 'bx-trash');

  i.addEventListener('click', (e) => {
    taskList = loadTasks();
    const { target } = e;
    showModal(true);
    cancelBtn?.addEventListener('click', () => {
      showModal();
    });
    deleteBtn?.addEventListener('click', () => {
      removeTask((target as HTMLElement).id);
      showModal();
    });
  });

  label.append(checkbox, task.title);
  li.append(label, i);
  list?.append(li);
}

function styleLabel(isCompleted: boolean, label: HTMLLabelElement) {
  isCompleted
    ? (label.style.textDecoration = 'line-through')
    : (label.style.textDecoration = 'none');
}

function removeTask(taskId: string) {
  const newTask = taskList.filter((taskItem) => taskItem.id !== taskId);
  saveTasks(newTask, true);
}

function loadTasks(): Task[] {
  const tasks = localStorage.getItem('tasks');
  if (tasks) {
    return JSON.parse(tasks);
  }
  return [];
}

function saveTasks(taskList: Task[], updateUI = false) {
  localStorage.setItem('tasks', JSON.stringify(taskList));
  taskList = loadTasks();
  if (updateUI) {
    (list as HTMLElement).innerHTML = '';
    taskList.forEach((task) => {
      addNewTask(task);
    });
  }
}

function renderTask() {
  taskList.forEach((task) => {
    addNewTask(task);
  });
}

function validateNewTask(taskTitle: string): boolean {
  return taskList.some(
    (task) => taskTitle.toLowerCase() === task.title.toLowerCase(),
  );
}

function showModal(show = false) {
  deleteModal?.classList.toggle('active', show);
}

function showToast(message: string) {
  const newToast = document.createElement('div');
  newToast.classList.add('toast');
  newToast.innerHTML = `
  <i class="bx bx-error"></i>
        <span>${message}</span>
        <span class="count-down"></span>`;

  toastList?.append(newToast);

  let id1 = setTimeout(() => {
    newToast.style.animation = 'hide 2s ease-in-out forwards';
    clearTimeout(id1);
  }, 4000);
  let id2 = setTimeout(() => {
    newToast.remove();
    clearTimeout(id2);
  }, 5000);
}

renderTask();

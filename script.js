// Simple To-Do with localStorage (Mission Control)
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('mission_todos') || '[]');

function save() {
  localStorage.setItem('mission_todos', JSON.stringify(todos));
}

function render() {
  list.innerHTML = '';
  todos.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
      <div class="todo-left">
        <div class="checkbox" data-i="${i}">${t.done ? '✓' : ''}</div>
        <div class="todo-text ${t.done ? 'done' : ''}">${escapeHtml(t.text)}</div>
      </div>
      <div class="btns">
        <button class="small-btn remove" data-i="${i}">Remove</button>
      </div>
    `;
    list.appendChild(li);
  });
  attachHandlers();
}

function attachHandlers() {
  document.querySelectorAll('.checkbox').forEach(el => {
    el.onclick = () => {
      const i = +el.dataset.i;
      todos[i].done = !todos[i].done;
      save();
      render();
    };
  });
  document.querySelectorAll('.remove').forEach(el => {
    el.onclick = () => {
      const i = +el.dataset.i;
      todos.splice(i, 1);
      save();
      render();
    };
  });
}

function addTodo(text) {
  if (!text || !text.trim()) return;
  todos.push({ text: text.trim(), done: false });
  save();
  render();
}

addBtn.onclick = () => { addTodo(input.value); input.value = ''; input.focus(); };
input.onkeypress = (e) => { if (e.key === 'Enter') { addTodo(input.value); input.value = ''; } };

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
}

render();

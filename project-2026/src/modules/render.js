import { store } from './state'

import { sortArr, tasksRemaining } from './utils'

function renderHeader() {
	return `
  <div class="app">
      <h1>✅ TASKS</h1>
      ${renderAddForm()}
      ${renderSearchSection()}
      ${renderFilters()}
      ${renderTasksList(sortArr(store.currentFilter))}
      ${renderStatusBar()}
      ${renderBackupControls()}
    </div>
  `
}

function renderAddForm() {
	return `
 <form class="add-form">
			<input
				type="text"
				placeholder="Введите новую задачу "
			/>
      	<button type="button" class="add-form-btn"  aria-label="Добавить">
				+
			</button>
		</form>
  `
}

function renderSearchSection() {
	return `
   <div class="search-section">
			<input
				type="text"
				placeholder="Поиск "
        value="${store.searchQuery}"
			/>
		</div>
  `
}

function renderFilters() {
	const taskAll = store.tasks.length
	const taskActive = store.tasks.filter(item => item.completed === false).length
	const taskCompleted = store.tasks.filter(
		item => item.completed === true,
	).length
	return `
  <div class="filters">
			<button type="button" data-filter-all class="filter-btn ${store.currentFilter === 'all' ? 'active' : ''}" >
				Все(${taskAll})
			</button>
      	<button type="button" data-filter-active class="filter-btn ${store.currentFilter === 'active' ? 'active' : ''}" >
				Активные(${taskActive})
			</button>
      	<button type="button" data-filter-completed class="filter-btn ${store.currentFilter === 'completed' ? 'active' : ''}" >
				Выполненные(${taskCompleted})
			</button>
		</div>
  `
}

function renderTasksList(arr) {
	if (arr.length === 0) {
		return `
    <div class='tasks-list'>
      <div class="empty-message">📭 Нет задач</div>
    </div>
    
    `
	}
	const tasksHTML = arr.map(task => {
		return `
 
			<div class="task-item">
				<input type="checkbox" id="${task.id}" ${task.completed === true ? 'checked' : ''} />
				<span class="task-text">${task.text}</span>
        <input
				type="text"
				placeholder="Введите новую задачу "
        class="edit-input display"
        value="${task.text}"
			  />
				<div class="task-actions">
					<button type="button" data-editing-btn="${task.id}" aria-label="Редактировать">✏️</button>
					<button type="button" data-delete-btn="${task.id}"  aria-label="Удалить">🗑️</button>
				</div>
			</div>
      
  `
	})

	return `<div class='tasks-list'>${tasksHTML.join('')}</div>`
}

function renderStatusBar() {
	return `
  <div class="stats-bar">
    <span>Осталось задач: ${tasksRemaining}</span>
    <button type="button" class="clear-btn">
      Очистить выполненные
    </button>
</div>
  `
}

function renderBackupControls() {
	return `
  <div class="backup-controls">
  <button id="exportBtn">Экспорт (Скачать JSON)</button>
  
  <input type="file" id="importInput" accept=".json" style="display: none;">

  <button id="importBtn">Импорт (Загрузить JSON)</button>
</div>
  `
}

export function render() {
	app.innerHTML = renderHeader()
}

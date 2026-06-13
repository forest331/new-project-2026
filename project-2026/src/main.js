const app = document.getElementById('app')
let currentFilter = 'all'
let tasksRemaining = 0
let searchQuery = ''

// const exportBtn = document.getElementById('exportBtn')
// const importBtn = document.getElementById('importBtn')
// const importInput = document.getElementById('importInput')

// const searchInput = document.querySelector('.search-section input')

let tasks = [
	{
		id: 1,
		text: 'Купить продукты к ужину',
		completed: false,
	},
	{
		id: 2,
		text: 'Покормить кота',
		completed: true,
	},
	{
		id: 3,
		text: 'Учить английский 10мин',
		completed: false,
	},
	{
		id: 4,
		text: 'Учить JS',
		completed: false,
	},
]

const STORAGE_KEY = 'taskManagerTasks'

function saveToLocalStorage() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function loadFromLocalStorage() {
	const savedTasks = localStorage.getItem(STORAGE_KEY)
	console.log(savedTasks)
	if (savedTasks) {
		tasks = JSON.parse(savedTasks)
	}
}

function renderHeader() {
	return `
  <div class="app">
      <h1>✅ TASKS</h1>
      ${renderAddForm()}
      ${renderSearchSection()}
      ${renderFilters()}
      ${renderTasksList(sortArr(currentFilter))}
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
        value="${searchQuery}"
			/>
		</div>
  `
}

function renderFilters() {
	const taskAll = tasks.length
	const taskActive = tasks.filter(item => item.completed === false).length
	const taskCompleted = tasks.filter(item => item.completed === true).length
	return `
  <div class="filters">
			<button type="button" data-filter-all class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" >
				Все(${taskAll})
			</button>
      	<button type="button" data-filter-active class="filter-btn ${currentFilter === 'active' ? 'active' : ''}" >
				Активные(${taskActive})
			</button>
      	<button type="button" data-filter-completed class="filter-btn ${currentFilter === 'completed' ? 'active' : ''}" >
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

app.addEventListener('click', e => {
	if (e.target.closest('.add-form-btn')) {
		currentFilter = 'all'

		const row = e.target.closest('.add-form')
		const input = row.querySelector('input')
		if (input.value) {
			const newTask = {}
			newTask.id = Date.now()
			newTask.text = input.value
			newTask.completed = false
			tasks.push(newTask)
			saveToLocalStorage()
			render()
			input.value = ''
		}
	}

	if (e.target.closest('[data-delete-btn]')) {
		const btn = e.target.closest('[data-delete-btn]')
		tasks = tasks.filter(item => item.id !== +btn.dataset.deleteBtn)
		saveToLocalStorage()
		render()
	}

	if (e.target.type === 'checkbox') {
		const checkbox = e.target.closest('.task-item input')

		const currentTask = tasks.find(item => item.id === +checkbox.id)
		currentTask.completed = checkbox.checked
		saveToLocalStorage()
		render()
	}

	if (e.target.closest('[data-filter-all]')) {
		currentFilter = 'all'

		render()
	}
	if (e.target.closest('[data-filter-active]')) {
		currentFilter = 'active'

		render()
		// const sortTasks = sortArr(currentFilter)
	}
	if (e.target.closest('[data-filter-completed]')) {
		currentFilter = 'completed'

		render()
	}
	if (e.target.closest('.clear-btn')) {
		const hasCompletedTasks = tasks.some(item => item.completed)
		if (!hasCompletedTasks) {
			return
		}
		if (confirm('Удалить все выполненные задачи?')) {
			tasks = tasks.filter(item => !item.completed)
			currentFilter = 'all'
			saveToLocalStorage()
			render()
		}
	}

	if (e.target.closest('[data-editing-btn]')) {
		const btn = e.target.closest('[data-editing-btn]')
		const taskItem = btn.closest('.task-item')
		const input = taskItem.querySelector('.edit-input')

		const span = taskItem.querySelector('span')
		span.classList.add('display')
		input.classList.remove('display')
		input.focus()
		input.setSelectionRange(input.value.length, input.value.length)
	}
	if (e.target.closest('#exportBtn')) {
		const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
		const jsonStr = JSON.stringify(tasks, null, 2)
		const blob = new Blob([jsonStr], { type: 'application/json' })
		const url = URL.createObjectURL(blob)

		const a = document.createElement('a')
		a.href = url
		a.download = `tasks_backup_${new Date().toISOString().slice(0, 19)}.json`

		document.body.appendChild(a)

		a.click()

		document.body.removeChild(a)
		URL.revokeObjectURL(url)

		alert(`экспортировано ${tasks.length} задач`)
	}
	if (e.target.closest('#importBtn')) {
		document.getElementById('importInput').click()
	}
})

app.addEventListener('input', e => {
	if (e.target.closest('.search-section input')) {
		searchQuery = e.target.value.toLowerCase().trim()

		render()

		const input = app.querySelector('.search-section input')
		input.focus()
		input.setSelectionRange(input.value.length, input.value.length)
	}
})

app.addEventListener('keydown', e => {
	if (e.target.matches('.edit-input')) {
		if (e.key === 'Enter') {
			const input = e.target
			const taskItem = input.closest('.task-item')
			const id = +taskItem.querySelector('input[type="checkbox"]').id

			const currentTask = tasks.find(item => item.id === id)
			if (currentTask) {
				currentTask.text = input.value
			}

			saveToLocalStorage()
			render()
		}
		if (e.key === 'Escape') {
			render()
		}
	}
})

app.addEventListener('change', e => {
	if (e.target.closest('#importInput')) {
		const file = e.target.files[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = e => {
			try {
				const importedTasks = JSON.parse(e.target.result)
				console.log(importedTasks)
				if (!Array.isArray(importedTasks)) {
					throw new Error('Файл должен содержать массив задач')
				}

				const isValid = importedTasks.every(
					task => task && typeof task === 'object' && 'text' in task,
				)
				if (!isValid) {
					throw new Error(
						'Не верный формат: каждая задача должна содержать "text"',
					)
				}
				if (
					confirm(
						`Найдено ${importedTasks.length} задач. Перезаписать текущее?`,
					)
				) {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(importedTasks))
					loadFromLocalStorage()
					render()
				}
			} catch (error) {
				alert(`Ошибка импорта ${error.message}`)
			} finally {
				e.target.value = ''
			}
		}
		reader.onerror = () => {
			alert('Ошибка чтения файла')
			event.target.value = ''
		}
		reader.readAsText(file, 'UTF-8')
	}
})

function sortArr(filter) {
	tasksRemaining = tasks.filter(item => !item.completed).length

	let filterActive
	if (filter === 'active') {
		filterActive = tasks.filter(item => item.completed === false)
	} else if (filter === 'completed') {
		filterActive = tasks.filter(item => item.completed === true)
	} else {
		filterActive = tasks
	}

	if (searchQuery) {
		filterActive = filterActive.filter(item =>
			item.text.toLocaleLowerCase().includes(searchQuery),
		)
	}

	return filterActive
}

function render() {
	app.innerHTML = renderHeader()
}
loadFromLocalStorage()
render()

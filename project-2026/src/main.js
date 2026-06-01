const app = document.getElementById('app')
let currentFilter = 'all'

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

function renderHeader() {
	return `
  <div class="app">
      <h1>✅ TASKS</h1>
      ${renderAddForm()}
      ${renderSearchSection()}
      ${renderFilters()}
      ${renderTasksList(tasks)}
      ${renderStatusBar()}
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
			/>
		</div>
  `
}

function renderFilters() {
	return `
  <div class="filters">
			<button type="button" data-filter-all class="filter-btn" >
				Все
			</button>
      	<button type="button" data-filter-active class="filter-btn" >
				Активные
			</button>
      	<button type="button" data-filter-completed class="filter-btn" >
				Выполненные
			</button>
		</div>
  `
}

function renderTasksList(arr) {
	const tasksHTML = arr.map(task => {
		return `
 
			<div class="task-item">
				<input type="checkbox" id="${task.id}" ${task.completed === true ? 'checked' : ''} />
				<span class="task-text">${task.text}</span>
				<div class="task-actions">
					<button type="button" aria-label="Редактировать">✏️</button>
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
    <span>Осталось задач: 3</span>
    <button type="button" class="clear-btn">
      Очистить выполненные
    </button>
</div>
  `
}

app.addEventListener('click', e => {
	if (e.target.closest('.add-form-btn')) {
		const row = e.target.closest('.add-form')
		const input = row.querySelector('input')
		if (input.value) {
			const newTask = {}
			newTask.id = Date.now()
			newTask.text = input.value
			newTask.completed = false
			tasks.push(newTask)
			render()
			console.log(tasks)
			input.value = ''
		}
	}

	if (e.target.closest('[data-delete-btn]')) {
		const btn = e.target.closest('[data-delete-btn]')
		tasks = tasks.filter(item => item.id !== +btn.dataset.deleteBtn)
		render()
	}

	if (e.target.type === 'checkbox') {
		const checkbox = e.target.closest('.task-item input')

		const currentTask = tasks.find(item => item.id === +checkbox.id)
		currentTask.completed = checkbox.checked

		console.log(currentTask)
	}

	if (e.target.closest('[data-filter-all]')) {
		let currentFilter = 'all'
	}
	if (e.target.closest('[data-filter-active]')) {
		let currentFilter = 'active'
		sortArr(currentFilter)
	}
	if (e.target.closest('[data-filter-completed]')) {
		let currentFilter = 'completed'
	}
})

function sortArr(filter) {
	if (filter === 'active') {
		const filterActive = tasks.filter(item => item.completed === false)
		console.log(filterActive)
	}
}

function render() {
	app.innerHTML = renderHeader()
}

render()

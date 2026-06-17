import { app } from '../main'
import {
	saveToLocalStorage,
	loadFromLocalStorage,
	STORAGE_KEY,
	store,
} from './state'
import { render } from './render'

export function initHandlers() {
	app.addEventListener('click', e => {
		if (e.target.closest('.add-form-btn')) {
			store.currentFilter = 'all'

			const row = e.target.closest('.add-form')
			const input = row.querySelector('input')
			if (input.value) {
				const newTask = {}
				newTask.id = Date.now()
				newTask.text = input.value
				newTask.completed = false
				store.tasks.push(newTask)
				saveToLocalStorage()
				render()
				input.value = ''
			}
		}

		if (e.target.closest('[data-delete-btn]')) {
			const btn = e.target.closest('[data-delete-btn]')
			store.tasks = store.tasks.filter(
				item => item.id !== +btn.dataset.deleteBtn,
			)
			saveToLocalStorage()
			render()
		}

		if (e.target.type === 'checkbox') {
			const checkbox = e.target.closest('.task-item input')

			const currentTask = store.tasks.find(item => item.id === +checkbox.id)
			currentTask.completed = checkbox.checked
			saveToLocalStorage()
			render()
		}

		if (e.target.closest('[data-filter-all]')) {
			store.currentFilter = 'all'

			render()
		}
		if (e.target.closest('[data-filter-active]')) {
			store.currentFilter = 'active'

			render()
			// const sortTasks = sortArr(currentFilter)
		}
		if (e.target.closest('[data-filter-completed]')) {
			store.currentFilter = 'completed'

			render()
		}
		if (e.target.closest('.clear-btn')) {
			const hasCompletedTasks = store.tasks.some(item => item.completed)
			if (!hasCompletedTasks) {
				return
			}
			if (confirm('Удалить все выполненные задачи?')) {
				store.tasks = store.tasks.filter(item => !item.completed)
				store.currentFilter = 'all'

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
			store.searchQuery = e.target.value.toLowerCase().trim()

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

				const currentTask = store.tasks.find(item => item.id === id)
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
}

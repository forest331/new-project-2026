import { store } from './state'

export let tasksRemaining = 0

export function sortArr(filter) {
	tasksRemaining = store.tasks.filter(item => !item.completed).length

	let filterActive
	if (filter === 'active') {
		filterActive = store.tasks.filter(item => item.completed === false)
	} else if (filter === 'completed') {
		filterActive = store.tasks.filter(item => item.completed === true)
	} else {
		filterActive = store.tasks
	}

	if (store.searchQuery) {
		filterActive = filterActive.filter(item =>
			item.text.toLocaleLowerCase().includes(store.searchQuery),
		)
	}

	return filterActive
}

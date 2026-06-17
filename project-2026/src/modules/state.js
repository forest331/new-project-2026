// let tasks = [
// 	{
// 		id: 1,
// 		text: 'Купить продукты к ужину',
// 		completed: false,
// 	},
// 	{
// 		id: 2,
// 		text: 'Покормить кота',
// 		completed: true,
// 	},
// 	{
// 		id: 3,
// 		text: 'Учить английский 10мин',
// 		completed: false,
// 	},
// 	{
// 		id: 4,
// 		text: 'Учить JS',
// 		completed: false,
// 	},
// ]
export const store = {
	tasks: [
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
	],
	searchQuery: '',
	currentFilter: 'all',
}
// let currentFilter = 'all'
// let searchQuery = ''
const STORAGE_KEY = 'taskManagerTasks'

// export function changeFilter(newFilter) {
// 	currentFilter = newFilter
// }

export { STORAGE_KEY }

export function saveToLocalStorage() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(store.tasks))
}

export function loadFromLocalStorage() {
	const savedTasks = localStorage.getItem(STORAGE_KEY)
	console.log(savedTasks)
	if (savedTasks) {
		store.tasks = JSON.parse(savedTasks)
	}
}

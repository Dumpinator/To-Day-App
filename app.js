const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const optionInput = document.querySelector('.custom-select-wrapper');
const filterOption = document.querySelectorAll(".custom-option");

// Listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', checkOrDelete);
optionInput.addEventListener('click', function() {
	this.querySelector('.custom-select').classList.toggle('open');
})

for (const option of filterOption) {
	option.addEventListener('click', function(e) {

		if (!this.classList.contains('selected')) {
			this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
			this.classList.add('selected');
			this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
		}
		filterTodo( this.textContent.toLowerCase() );
	})
}

// ferme la liste déroulante si on click ailleur
window.addEventListener('click', function(e) {
	const select = document.querySelector('.custom-select')
	if (!select.contains(e.target)) {
		select.classList.remove('open');
	}
});

// Functions
function addTodo(e){
	e.preventDefault();

	const todoDiv = document.createElement('div');
	const liDiv = document.createElement('div');
	todoDiv.classList.add('todo');

	const newTodo = document.createElement('li');
	newTodo.innerText = todoInput.value;
	
	liDiv.classList.add('todo-item');
	liDiv.appendChild(newTodo);
	
	todoDiv.appendChild(liDiv);
	// Add to localStorage
	saveLocalStorage(todoDiv);

	const completedButton = document.createElement('button');
	completedButton.innerHTML = '<i class="fas fa-check"></i>';
	completedButton.classList.add('complete-btn');
	todoDiv.appendChild(completedButton);

	const deleteButton = document.createElement('button');
	deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
	deleteButton.classList.add('delete-btn');
	todoDiv.appendChild(deleteButton);

	todoList.appendChild(todoDiv);
	todoInput.value = '';
}

function checkOrDelete (e){

	const item = e.target;
	
	// On clique sur notre bouton check
	if( item.classList.contains('complete-btn') )
	{
		const todoDiv = item.parentElement;
		const todoLi = todoDiv.children[0];
		const value = todoDiv.innerText;	
		const todos = checkLocalStorage();
		const icon = item.firstChild;
		let i = 0;
		// Add here CRUD
		todoLi.classList.toggle('completed');

		// Si ma DIV a completed
		if( todoLi.classList.contains('completed')) {

			icon.classList.toggle('fa-check');
			icon.classList.toggle('fa-times');
			todos.forEach((todo) => {
				
				if (todo.includes(value)) {

					const regex = /false/gm;
					const split = todo.replace(regex, 'true');
					todos.splice(i, 1, split);
				}
				i++;
			});
		} else {

			icon.classList.toggle('fa-check');
			icon.classList.toggle('fa-times');
			todos.forEach((todo) => {
				if (todo.includes(value)) {
					
					const regex = /true/gm;
					const split = todo.replace(regex, 'false');
					todos.splice(i, 1, split);
				}
				i++;
			});
		}
		localStorage.setItem('todos', JSON.stringify(todos));
	}

	// On clique sur notre bouton delete
	if( item.classList.contains('delete-btn') )
	{
		const todo = item.parentElement;
		
		todo.classList.add('fall');
		removeLocalStorage(todo);
		todo.addEventListener('transitionend', function(e) {
			todo.remove();
		}, false);
		// Add here CRUD
	}
}

function filterTodo(e) {
	
	const todos = todoList.childNodes;

	todos.forEach((todo) => {
		
		const monLi = todo.children[0];
		
		switch(e) {
			case 'all':
				todo.style.display = 'flex';
				break;
			case 'completed':
				if( monLi.classList.contains('completed'))
					todo.style.display = 'flex';
				else
					todo.style.display ='none';
				break;
			case 'uncompleted':
				if( !monLi.classList.contains('completed'))
					todo.style.display = 'flex';
				else
					todo.style.display ='none';
				break;
		}
	});
}

function checkLocalStorage() {

	let todos;

	if(localStorage.getItem('todos') === null)
		todos = [];
	else
		todos = JSON.parse(localStorage.getItem('todos'));
	return todos;
}

function saveLocalStorage(todo, not) {

	const valueTodo = todo.childNodes[0].innerText;
	const todos = checkLocalStorage();
	
	todos.push(`${valueTodo}:false`);
	localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {

	const todos = checkLocalStorage();
	
	todos.forEach((todo) => {

		const todoDiv = document.createElement('div');
		const liDiv = document.createElement('div');
		const newTodo = document.createElement('li');
		const completedButton = document.createElement('button');
		const deleteButton = document.createElement('button');
		
		todoDiv.classList.add('todo');
		
		if(todo.includes('true')) {
			const value = todo.split(':');
			liDiv.classList.add('completed');
			newTodo.innerText = value[0];
		} else {
			const value = todo.split(':');
			newTodo.innerText = value[0];
		}

		liDiv.classList.add('todo-item');
		liDiv.appendChild(newTodo);
		todoDiv.appendChild(liDiv);

		completedButton.innerHTML = '<i class="fas fa-check"></i>';
		completedButton.classList.add('complete-btn');
		todoDiv.appendChild(completedButton);

		const icon = todoDiv.children[1].children[0];
		if(todo.includes('true')) {
			icon.classList.remove('fa-check');
			icon.classList.add('fa-times');
		} else {
			icon.classList.remove('fa-times');
			icon.classList.add('fa-check');
		}

		deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
		deleteButton.classList.add('delete-btn');

		todoDiv.appendChild(deleteButton);
		todoList.appendChild(todoDiv);
	})
}

function removeLocalStorage(todo) {

	const todos = checkLocalStorage();	
	const value = todo.children[0].innerText;
	
	if(todos.includes(value+':false')){
		todos.splice(todos.indexOf(value+':false'), 1);
	} else {
		todos.splice(todos.indexOf(value+':true'), 1);
	}
	localStorage.setItem('todos', JSON.stringify(todos));
}
const container = document.querySelector('#container');
const input = document.querySelector('#new-todo');
const todoDiv = document.querySelector('#todo');
const doneDiv = document.querySelector('#done');

const getTodos = () => {
    fetch('https://jsonplaceholder.typicode.com/todos')
    .then(data => data.json())
    .then(json => displayTodoList(json))
    .catch(err => console.error(err))
}

const handleClickTodo = e => {
    let id = e.target.id.replace('todo_','');
    let done = (e.target.parentElement.id === "done");

    if(id > 200) { // these don't actually exist on the server so we have to fake it
        updateStatus({
            id: id,
            completed: !done
        });

        return false;
    }
    
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !done }),
        headers:{ 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(json => updateStatus(json))
    .catch(err => console.error('Error:', err));
}

const updateStatus = obj => {
    let el = document.querySelector(`#todo_${obj.id}`);
    if(obj.completed) {
        doneDiv.prepend(el);
    }
    else {
        todoDiv.prepend(el);
    }
}

const displayTodo = todo => {
    let todoText = document.createTextNode(todo.title);
    let todoEl = document.createElement('div');
    todoEl.id = `todo_${todo.id}`;
    todoEl.classList.add('todo-item');
    todoEl.appendChild(todoText);
    todoEl.addEventListener('click', handleClickTodo, true);
    if(todo.completed) {
        doneDiv.prepend(todoEl);
    }
    else {
        todoDiv.prepend(todoEl);
    }
}

const displayTodoList = json => {
    json.forEach((todo, i) => {
        if(i >= 20) return false;

        displayTodo(todo);
    });
} 

getTodos();

input.addEventListener('keyup', e => {
    if(e.key === "Enter") {
        addTodo(input.value);
        input.value = '';
    }
})

const addTodo = val => {
    fetch(`https://jsonplaceholder.typicode.com/todos`, {
        method: 'POST',
        body: JSON.stringify({ title: val }),
        headers:{ 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(json => displayTodo(json))
    .catch(err => console.error('Error:', err));
}

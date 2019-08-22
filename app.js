const container = document.querySelector('#container');

container.innerHTML = `<h1 style='text-align:center;'>To Do -- Vanilla JS</h1>`;

const getTodos = () => {
    fetch('https://jsonplaceholder.typicode.com/todos')
    .then(data => data.json())
    .then(json => {
        console.log(json);
        displayTodoList(json);
    })
    .catch(err => {
        console.error(err);
    })
}

const handleClickTodo = e => {
    let id = e.target.id.replace('todo_','');
    let done = e.target.classList.contains('done');
    
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
    if(obj.completed)
        el.classList.add('done');
    else
        el.classList.remove('done');
}

const displayTodoList = json => {
    json.forEach((todo, i) => {
        if(i >= 20) return false;
        let todoEl = document.createElement('div');
        todoEl.id = `todo_${todo.id}`;
        todoEl.classList.add('todo-item');
        let todoText = document.createTextNode(todo.title);
        if(todo.completed) todoEl.classList.add('done');
        todoEl.appendChild(todoText);
        todoEl.addEventListener('click', handleClickTodo, true);
        container.appendChild(todoEl);
    });
} 

getTodos();

// sort items, undone first
// add `delete` functionality (DELETE)
// create `add` form
// handle `add` form input (POST)




// const api = {
//     getTodos: 'https://jsonplaceholder.typicode.com/todos',
//     getTodo: 'https://jsonplaceholder.typicode.com/todos/', // ${id}
//     putTodo: 'https://jsonplaceholder.typicode.com/todos/', // ${id}
//     postTodo: 'https://jsonplaceholder.typicode.com/todos',
//     deleteTodo: 'https://jsonplaceholder.typicode.com/todos/' // ${id}
// }


const container = document.querySelector('#container');
const input = document.querySelector('#new-todo');
const todoDiv = document.querySelector('#todo');
const doneDiv = document.querySelector('#done');
const menu = document.querySelector('#menu');
const menuList = document.querySelector('#menu ul');
const option__complete = document.querySelector('#menu #context__complete');
const option__uncomplete = document.querySelector('#menu #context__uncomplete');
const option__delete = document.querySelector('#menu #context__delete');

const handleClickTodo = e => {
    let itemObj = {
        id: e.target.id.replace('todo_',''),
        completed: !(e.target.parentElement.id === "done")
    }
    console.log(itemObj)

    if(itemObj.id > 200) { // these don't actually exist on the server so we have to fake it
        updateElement(itemObj);
    }
    else {
        putTodo(itemObj);
    }
}

const updateElement = itemObj => { console.log(itemObj)
    let el = document.querySelector(`#todo_${itemObj.id}`);

    if(itemObj.completed) {
        doneDiv.prepend(el);
    }
    else {
        todoDiv.prepend(el);
    }
}

const removeElement = id => {
    let el = document.querySelector(`#todo_${obj.id}`);

    el.remove();
}

const showContextMenu = e => {
    e.preventDefault();

    let done = (e.target.parentElement.id === "done"); console.log(done, (!done));
    let itemObj = {
        id: e.target.id.replace('todo_',''),
        completed: (!done)
    }

    menuList.setAttribute('data-item',encodeURIComponent(JSON.stringify(itemObj)));

    if(done) { console.log('this')
        option__complete.style.display = 'none';
        option__uncomplete.style.display = 'block';
    }
    else { console.log('that')
        option__complete.style.display = 'block';
        option__uncomplete.style.display = 'none';
    }

    menu.style.display = 'block';
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
}

const handleContextFunction = e => {
    let clicked = e.target.id;
    let itemObj = JSON.parse(decodeURIComponent(menuList.getAttribute('data-item')));

    switch(clicked) {
        case 'context__complete':
        case 'context__uncomplete':
            // mark as uncomplete
            console.log(itemObj);
            if(itemObj.id > 200) { // these don't actually exist on the server so we have to fake it
                updateElement(itemObj);
            }
            else {
                putTodo(itemObj);
            }
            // close the menu
            menu.style.display = 'none';
            break;
        case 'context__delete':
            // do delete
            console.log(itemObj.id);
            // close the menu
            menu.style.display = 'none';
            break;
        default:
            break;
    }
}

const displayTodo = todo => {
    let todoText = document.createTextNode(todo.title);
    let todoEl = document.createElement('div');
    todoEl.id = `todo_${todo.id}`;
    todoEl.classList.add('todo-item');
    todoEl.appendChild(todoText);
    todoEl.addEventListener('click', handleClickTodo, true);
    todoEl.addEventListener('contextmenu', showContextMenu, true);
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

const getTodos = () => {
    fetch('https://jsonplaceholder.typicode.com/todos')
    .then(data => data.json())
    .then(json => displayTodoList(json))
    .catch(err => console.error(err))
}

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

const putTodo = obj => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${obj.id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: obj.completed }),
        headers:{ 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(json => updateElement(json))
    .catch(err => console.error('Error:', err));
}

const deleteTodo = id => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${obj.id}`, {
        method: 'DELETE',
        headers:{ 'Content-Type': 'application/json' }
    })
    .then(res => removeElement(id))
    .catch(err => console.error('Error:', err));
}

document.addEventListener('DOMContentLoaded', () => {
    input.addEventListener('keyup', e => {
        if(e.key === "Enter") {
            addTodo(input.value);
            input.value = '';
        }
    })
    
    window.addEventListener('keyup', e => {
        if(e.key === "Escape") {
            menu.style.display = 'none';
        }
    })

    menu.addEventListener('click', handleContextFunction);
    
    getTodos();
});

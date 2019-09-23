const container = document.querySelector('#container');
const input = document.querySelector('#new-todo');
const todoList = document.querySelector('#container ul#todo');
const doneList = document.querySelector('#container ul#done');
const menu = document.querySelector('#menu');
const menuList = document.querySelector('#menu ul');
const option__complete = document.querySelector('#menu #context__complete');
const option__uncomplete = document.querySelector('#menu #context__uncomplete');
const option__delete = document.querySelector('#menu #context__delete');

const displayTodoList = json => {
    json.forEach((todo, i) => {
        displayTodo(todo);
    });
} 

const displayTodo = todo => {
    let todoText = document.createTextNode(todo.title);
    let todoEl = document.createElement('li');
    todoEl.id = `todo_${todo.id}`;
    todoEl.classList.add('todo-item');
    todoEl.setAttribute('role','listitem');
    if(todo.completed) {
        todoEl.classList.add('completed');
    }
    todoEl.appendChild(todoText);
    todoEl.addEventListener('click', handleClickTodo, true);
    todoEl.addEventListener('contextmenu', showContextMenu, true);
    if(todo.completed) {
        doneList.prepend(todoEl);
    }
    else {
        todoList.prepend(todoEl);
    }
}

const updateElement = todo => {
    let todoEl = document.querySelector(`#todo_${todo.id}`);

    if(todo.completed) {
        todoEl.classList.add('completed');
        doneList.prepend(todoEl);
    }
    else {
        todoEl.classList.remove('completed');
        todoList.prepend(todoEl);
    }
}

const removeElement = id => {
    let el = document.querySelector(`#todo_${id}`);

    el.remove();
}

const handleClickTodo = e => {
    let todo = {
        id: e.target.id.replace('todo_',''),
        completed: !(e.target.classList.contains('completed'))
    }

    if(todo.id > 200) { // these don't actually exist on the server so we have to fake it
        updateElement(todo);
    }
    else {
        putTodo(todo);
    }
}

const showContextMenu = e => {
    e.preventDefault();

    let completed = e.target.classList.contains('completed');
    let itemObj = {
        id: e.target.id.replace('todo_',''),
        completed: !completed
    }

    menuList.setAttribute('data-item',encodeURIComponent(JSON.stringify(itemObj)));

    if(completed) {
        option__complete.style.display = 'none';
        option__uncomplete.style.display = 'block';
    }
    else {
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
            if(itemObj.id > 200) { // these don't actually exist on the server so we have to fake it
                updateElement(itemObj);
            }
            else {
                putTodo(itemObj);
            }
            menu.style.display = 'none';
            break;
        case 'context__delete':
            deleteTodo(itemObj.id);
            menu.style.display = 'none';
            break;
        default:
            break;
    }
}

const buildNewTodo = (todo, id) => ({
    id: id,
    title: todo,
    completed: false
});

const getTodos = () => {
    try {
        let itemList = JSON.parse(localStorage.getItem("itemList")) || [];
        displayTodoList(itemList);
    } catch (err) {
        console.error(err);
    }
}

const addTodo = title => {
    try {
        let itemList = JSON.parse(localStorage.getItem("itemList")) || [];
        let newTodo = buildNewTodo(title,itemList.length);
        itemList.push(newTodo);
        localStorage.setItem("itemList", JSON.stringify(itemList));
        displayTodo(newTodo);
    } catch (err) {
        console.error(err);
    }
}

const putTodo = todo => {
    try {
        let itemList = JSON.parse(localStorage.getItem("itemList")) || [];
        let updatedItemList = itemList.map(item => {
            if(item.id == todo.id) {
                item.completed = todo.completed;
            }
            return item;
        });
        localStorage.setItem("itemList", JSON.stringify(updatedItemList));
        updateElement(todo);
    } catch (err) {
        console.error(err);
    }
}

const deleteTodo = id => {
    try {
        let itemList = JSON.parse(localStorage.getItem("itemList")) || [];
        let itemListAfterDelete = itemList.filter(item => item.id != id);
        localStorage.setItem("itemList", JSON.stringify(itemListAfterDelete));
        removeElement(id);
    } catch (err) {
        console.error(err);
    }
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

/* calls to test api
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

const putTodo = todo => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: todo.completed }),
        headers:{ 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(json => updateElement(json))
    .catch(err => console.error('Error:', err));
}

const deleteTodo = id => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id: id }),
        headers:{ 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(json => removeElement(id))
    .catch(err => console.error('Error:', err));
}
*/

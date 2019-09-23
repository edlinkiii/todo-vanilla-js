const container = document.querySelector('#container');
const input = document.querySelector('#new-todo');
const todoList = document.querySelector('#container ul#todo');
const doneList = document.querySelector('#container ul#done');
const menu = document.querySelector('#menu');
const menuList = document.querySelector('#menu ul');
const option__complete = document.querySelector('#menu #context__complete');
const option__uncomplete = document.querySelector('#menu #context__uncomplete');
const option__delete = document.querySelector('#menu #context__delete');
let myTodos = [];

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
        id: parseInt(e.target.id.replace('todo_','')),
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
        id: parseInt(e.target.id.replace('todo_','')),
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

const newId = () => (myTodos.reduce((big, t) => big = (big > t.id) ? big : t.id)) + 1;

const buildNewTodo = (todo, id) => ({
    id: id,
    title: todo,
    completed: false
});

const getTodos = () => {
    try {
        myTodos = JSON.parse(localStorage.getItem("myTodos")) || [];
        displayTodoList(myTodos);
    } catch (err) {
        console.error(err);
    }
}

const addTodo = title => {
    try {
        let newTodo = buildNewTodo(title, newId());
        myTodos.push(newTodo);
        localStorage.setItem("myTodos", JSON.stringify(myTodos));
        displayTodo(newTodo);
    } catch (err) {
        console.error(err);
    }
}

const putTodo = todo => {
    try {
        let myUpdatedTodos = myTodos.map(t => {
            if(t.id === todo.id) {
                t.completed = todo.completed;
            }
            return t;
        });
        myTodos = myUpdatedTodos;
        localStorage.setItem("myTodos", JSON.stringify(myTodos));
        updateElement(todo);
    } catch (err) {
        console.error(err);
    }
}

const deleteTodo = id => {
    try {
        let myUpdatedTodos = myTodos.filter(t => t.id !== id);
        myTodos = myUpdatedTodos;
        localStorage.setItem("myTodos", JSON.stringify(myTodos));
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

const container = document.querySelector('#container');

container.innerHTML = `<h1 style='text-align:center;'>To Do -- Vanilla JS</h1>`;

// setup node.js server -- done

// connect to todo api (GET) -- done
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

// format/display todo items -- done
const displayTodoList = json => {
    json.forEach(todo => {
        todoEl = document.createElement('div');
        todoEl.id = todo.id;
        todoLabel = document.createElement('label');
        todoChk = document.createElement('input');
        todoChk.setAttribute('type','checkbox');
        if(todo.completed) {
            todoChk.setAttribute('checked','checked');
            todoEl.classList.add('done');
        }
        todoEl.classList.add('todo-item');
        todoEl.appendChild(todoChk);
        todoText = document.createTextNode(todo.title);
        container.appendChild(todoEl);
        todoEl.appendChild(todoLabel);
        todoLabel.appendChild(todoChk);
        todoLabel.appendChild(todoText);
    });
} 

getTodos();

// sort items, undone first
// add `check` functionality (PUT)
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



/******* NEXT
 * Vanilla Web Components
 * React
 * React/Redux
 * Angular
 * Backbone
 * TypeScript 
*/

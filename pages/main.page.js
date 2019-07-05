import React, {useState} from 'react';
import {endpoints} from 'wildcard-api/client';

export default {
  route: '/',
  view: TodoList,
  title: 'My Todo List',
  addInitialProps,
};

async function addInitialProps({isNodejs}) {
  const todos = await endpoints.getTodos();
  return {initialTodos: todos};
}

function TodoList({initialTodos}) {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(initialTodos);

  return (
    <>
      To-dos:
      <ul>
        { todos.map(todo =>
          <li key={todo.id}>
            {todo.text}
          </li>
        ) }
        <li>
          <form onSubmit={createTodo}>
            <input type="text" onChange={ev => setText(ev.target.value)} value={text} />
            {' '}
            <button type="submit">New To-do</button>
          </form>
        </li>
      </ul>
    </>
  );

  async function createTodo(ev) {
    ev.preventDefault();
    if( !text ) {
      return;
    }
    setText('');
    await endpoints.createTodo(text);
    const todos = await endpoints.getTodos();
    setTodos(todos);
  }
}

import React from 'react';
import './styles/TodoList.css';
import check from './images/check.png';
import xmark from './images/xmark.png';

const TodoItem = ({ todo, onDeleteTodo, onUpdateTodo }) => {
    return (
        <div className="todo-item">
          <div>
            <h2 className={todo.status === 'Complete' ? 'complete' : ''}>{todo.title}</h2>
            <p>{todo.status}</p>
          </div>
          <div>
            <button onClick={() => onDeleteTodo(todo.id)}>
                <img src={xmark} className ="cross" alt="Delete"></img>
            </button>
            <button onClick={() => onUpdateTodo(todo.id, todo.status === 'Incomplete' ? 'Complete' : 'Incomplete')}>
                <img src={check} className="check" alt={todo.status === 'Incomplete' ? 'Mark Complete' : 'Mark Incomplete'} />
            </button>
          </div>
        </div>
      );
    };

const TodoList = ({ todos, onDeleteTodo, onUpdateTodo }) => {
    return (
        <div>
            {todos.map((todo) => (
                <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onDeleteTodo={onDeleteTodo} 
                    onUpdateTodo={onUpdateTodo}
                />
            ))}
        </div>
    );
};

export default TodoList;

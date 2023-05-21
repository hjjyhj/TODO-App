import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createAxiosInstance, registerUser, loginUser } from './api';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './styles/App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false); 

  const api = createAxiosInstance();

  const refreshTodos = () => {
    api.get('/todos')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error(`Error fetching data: ${error}`);
      });
  };

  useEffect(() => {
    if (user) {
      refreshTodos();
    }
  }, [user]);

  const onRegister = (username, password) => {
    registerUser(username, password)
      .then(() => {
        setIsRegistering(false);
        setUser(username);
        setError(null);
      })
      .catch(error => {
        setError("Error registering user");
        console.error(`Error registering user: ${error}`);
      });
  };

  const onLogin = (username, password) => {
    loginUser(username, password)
      .then(() => {
        setUser(username);
        setError(null);
      })
      .catch(error => {
        setError("Invalid username or password");
        console.error(`Error logging in: ${error}`);
      });
  };

  const addTodo = (todo) => {
    api.post('/todos', { description: todo, done: false })
      .then(() => {
        refreshTodos();
      })
      .catch(error => {
        console.error(`Error adding todo: ${error}`);
      });
  };

  const deleteTodo = (id) => {
    api.delete(`/todos/${id}`)
      .then(() => {
        refreshTodos();
      })
      .catch(error => {
        console.error(`Error deleting todo: ${error}`);
      });
  };

  if (!user) {
    if (isRegistering) {
      return (
        <div className="app-container">
          <h1>Register for Todo App</h1>
          <RegisterForm onRegister={onRegister} />
          {error && <div className="error-message">Error: {error}</div>}
          <button onClick={() => setIsRegistering(false)}>Cancel Registration</button>
        </div>
      );
    }

    return (
      <div className="app-container">
        <h1>Login to Todo App</h1>
        <LoginForm onLogin={onLogin} />
        {error && <div className="error-message">Error: {error}</div>}
        <button onClick={() => setIsRegistering(true)}>New User?</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>Todo App</h1>
      <AddTodoForm addTodo={addTodo} />
      <TodoList todos={todos} deleteTodo={deleteTodo} />
    </div>
  );
};

export default App;

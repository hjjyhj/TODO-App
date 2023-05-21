import React, { useState } from 'react';
import './styles/AddTodoForm.css';

const AddTodoForm = ({ onAddTodo }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (title.trim() !== '') {
            console.log('handleSubmit is about to call onAddTodo with title:', title); // Add this line
            onAddTodo(title);
            setTitle('');
        } else {
            alert("Todo title can't be empty!");
        }
    };
    

    return (
        <form onSubmit={handleSubmit} className="add-todo-form">
            <input 
                type="text" 
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter todo title..."
            />
            <button type="submit">Add Todo</button>
        </form>
    );
};

export default AddTodoForm;

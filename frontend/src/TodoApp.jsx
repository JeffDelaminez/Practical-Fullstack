import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoApp.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // ✅ FIXED: Using only base URL, no /api/todos
  const API_BASE = "http://localhost:5000";

  // Fetch todos from backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        console.log("📡 Fetching todos from:", API_BASE);
        const response = await axios.get(API_BASE);
        console.log("✅ Todos received:", response.data);
        setTodos(response.data);
      } catch (err) {
        console.error("❌ Failed to fetch todos:", err);
        alert("Failed to load todos. Make sure backend is running on port 5000!");
      }
    };
    fetchTodos();
  }, []);

  // Add new todo
  const addTodo = async () => {
    if (!title.trim()) {
      alert("Please enter a title for the todo");
      return;
    }

    const newTodo = {
      title,
      description,
      completed: false // Default to pending
    };

    try {
      console.log("📤 Sending new todo:", newTodo);
      const res = await axios.post(API_BASE, newTodo);
      console.log("✅ Todo added successfully:", res.data);
      
      // Add the new todo to the list
      setTodos([...todos, res.data]);
      
      // Clear input fields
      setTitle('');
      setDescription('');
      
      alert("✅ Todo added successfully!");
    } catch (err) {
      console.error("❌ Failed to add todo:", err);
      alert("Failed to add todo. Please try again.");
    }
  };

  // Toggle completed - FIXED: Using request body
  const toggleTodo = async (id, currentStatus) => {
    try {
      console.log("🔄 Toggling todo:", id, "to:", !currentStatus);
      const res = await axios.put(API_BASE, { 
        id: id,
        completed: !currentStatus 
      });
      console.log("✅ Todo updated:", res.data);
      setTodos(todos.map(todo => todo._id === id ? res.data : todo));
    } catch (err) {
      console.error("❌ Failed to update todo:", err);
      alert("Failed to update todo.");
    }
  };

  return (
    <div className="todo-app">
      <h1>Todo List</h1>

      {/* Input Section */}
      <div className="input-section">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to do? (e.g., Study, Workout)"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description (e.g., Math, Gym)"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      {/* Todo List */}
      <ul className="todo-list">
        {todos.length === 0 ? (
          <li className="no-todos">No todos yet. Add your first todo above!</li>
        ) : (
          todos.map(todo => (
            <li key={todo._id} className={todo.completed ? "completed" : ""}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo._id, todo.completed)}
                />
                <span className="todo-content">
                  <strong>{todo.title}</strong>
                  {todo.description && <em> - {todo.description}</em>}
                  <span className="todo-date">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                </span>
              </label>
            </li>
          ))
        )}
      </ul>

      {/* Stats */}
      <div className="todo-stats">
        <p>Total: {todos.length} | Completed: {todos.filter(t => t.completed).length} | Pending: {todos.filter(t => !t.completed).length}</p>
      </div>
    </div>
  );
}

export default TodoApp;
import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
} from '../api/todoApi';
import './TodoList.css';

/**
 * TodoList component - main component for managing todos
 */
// PUBLIC_INTERFACE
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  /**
   * Load all todos from API
   */
  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos');
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle adding a new todo
   */
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) {
      return;
    }

    try {
      const newTodo = await createTodo({ title: newTodoTitle.trim() });
      setTodos([...todos, newTodo]);
      setNewTodoTitle('');
      setError(null);
    } catch (err) {
      setError('Failed to create todo');
      console.error('Error creating todo:', err);
    }
  };

  /**
   * Handle updating a todo
   */
  const handleUpdateTodo = async (id, updates) => {
    try {
      const updatedTodo = await updateTodo(id, updates);
      setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  /**
   * Handle deleting a todo
   */
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  /**
   * Handle toggling todo completion
   */
  const handleToggleComplete = async (id) => {
    try {
      const updatedTodo = await toggleTodoComplete(id);
      setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
      setError(null);
    } catch (err) {
      setError('Failed to toggle todo');
      console.error('Error toggling todo:', err);
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todo-list-container">
      <header className="todo-header">
        <h1 className="todo-title">My Todo List</h1>
        <p className="todo-subtitle">
          {completedCount} of {totalCount} tasks completed
        </p>
      </header>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <form className="todo-input-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todo-input"
          placeholder="Add a new task..."
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          aria-label="New todo title"
        />
        <button
          type="submit"
          className="btn-add"
          disabled={!newTodoTitle.trim()}
          aria-label="Add todo"
        >
          Add Task
        </button>
      </form>

      {loading ? (
        <div className="loading-message">Loading todos...</div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Add one above to get started!</p>
        </div>
      ) : (
        <div className="todo-list">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;

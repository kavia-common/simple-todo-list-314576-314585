import React, { useState } from 'react';
import './TodoItem.css';

/**
 * TodoItem component - displays a single todo with edit, delete, and complete toggle actions
 * @param {Object} props - Component props
 * @param {Object} props.todo - Todo object with id, title, and completed status
 * @param {Function} props.onUpdate - Callback to update todo
 * @param {Function} props.onDelete - Callback to delete todo
 * @param {Function} props.onToggleComplete - Callback to toggle completion
 */
// PUBLIC_INTERFACE
function TodoItem({ todo, onUpdate, onDelete, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(todo.title);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(todo.id, { title: editValue.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        {isEditing ? (
          <input
            type="text"
            className="todo-edit-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
            aria-label="Edit todo"
          />
        ) : (
          <span className="todo-title">{todo.title}</span>
        )}
      </div>
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              className="btn btn-save"
              onClick={handleSave}
              aria-label="Save changes"
            >
              Save
            </button>
            <button
              className="btn btn-cancel"
              onClick={handleCancel}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-edit"
              onClick={handleEdit}
              aria-label={`Edit "${todo.title}"`}
            >
              Edit
            </button>
            <button
              className="btn btn-delete"
              onClick={() => onDelete(todo.id)}
              aria-label={`Delete "${todo.title}"`}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;

/**
 * Todo API utility that abstracts persistence layer.
 * Attempts to use backend API if available, falls back to localStorage.
 */

const STORAGE_KEY = 'todos_local_storage';

/**
 * Check if backend is available
 * @returns {Promise<boolean>} - Returns true if backend is reachable
 */
// PUBLIC_INTERFACE
async function checkBackendAvailability() {
  const backendUrl = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
  
  if (!backendUrl) {
    return false;
  }

  try {
    const response = await fetch(`${backendUrl}/todos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend not available, using localStorage fallback:', error.message);
    return false;
  }
}

/**
 * Get all todos from localStorage
 * @returns {Array} - Array of todo objects
 */
function getLocalTodos() {
  try {
    const todos = localStorage.getItem(STORAGE_KEY);
    return todos ? JSON.parse(todos) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

/**
 * Save todos to localStorage
 * @param {Array} todos - Array of todo objects
 */
function saveLocalTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Fetch all todos
 * @returns {Promise<Array>} - Array of todo objects
 */
// PUBLIC_INTERFACE
export async function fetchTodos() {
  const backendAvailable = await checkBackendAvailability();
  
  if (backendAvailable) {
    const backendUrl = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(`${backendUrl}/todos`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching from backend:', error);
    }
  }
  
  return getLocalTodos();
}

/**
 * Create a new todo
 * @param {Object} todo - Todo object with title and optional completed status
 * @returns {Promise<Object>} - Created todo object
 */
// PUBLIC_INTERFACE
export async function createTodo(todo) {
  const backendAvailable = await checkBackendAvailability();
  
  if (backendAvailable) {
    const backendUrl = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(`${backendUrl}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error creating todo on backend:', error);
    }
  }
  
  // localStorage fallback
  const todos = getLocalTodos();
  const newTodo = {
    id: Date.now().toString(),
    title: todo.title,
    completed: todo.completed || false,
    createdAt: new Date().toISOString(),
  };
  todos.push(newTodo);
  saveLocalTodos(todos);
  return newTodo;
}

/**
 * Update an existing todo
 * @param {string} id - Todo ID
 * @param {Object} updates - Object with fields to update
 * @returns {Promise<Object>} - Updated todo object
 */
// PUBLIC_INTERFACE
export async function updateTodo(id, updates) {
  const backendAvailable = await checkBackendAvailability();
  
  if (backendAvailable) {
    const backendUrl = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(`${backendUrl}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error updating todo on backend:', error);
    }
  }
  
  // localStorage fallback
  const todos = getLocalTodos();
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos[index] = { ...todos[index], ...updates };
    saveLocalTodos(todos);
    return todos[index];
  }
  throw new Error('Todo not found');
}

/**
 * Delete a todo
 * @param {string} id - Todo ID
 * @returns {Promise<void>}
 */
// PUBLIC_INTERFACE
export async function deleteTodo(id) {
  const backendAvailable = await checkBackendAvailability();
  
  if (backendAvailable) {
    const backendUrl = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(`${backendUrl}/todos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        return;
      }
    } catch (error) {
      console.error('Error deleting todo on backend:', error);
    }
  }
  
  // localStorage fallback
  const todos = getLocalTodos();
  const filtered = todos.filter(t => t.id !== id);
  saveLocalTodos(filtered);
}

/**
 * Toggle todo completion status
 * @param {string} id - Todo ID
 * @returns {Promise<Object>} - Updated todo object
 */
// PUBLIC_INTERFACE
export async function toggleTodoComplete(id) {
  const todos = await fetchTodos();
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    throw new Error('Todo not found');
  }
  return updateTodo(id, { completed: !todo.completed });
}

import React from 'react';
import TodoList from './components/TodoList';
import './App.css';

/**
 * Main App component - entry point for the Todo application
 */
// PUBLIC_INTERFACE
function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App;

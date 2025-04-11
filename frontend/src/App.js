// File: src/App.js
// A simple To-Do app with optional task timing functionality and backend support

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Failed to load tasks:', err));
  }, []);

  const addTask = (isTimed) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      isTimed,
      timeSpent: 0,
      isRunning: false,
      timerId: null
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToBackend(updatedTasks);
    setTaskText('');
  };

  const toggleTimer = (taskId) => {
    setTasks((prev) => prev.map(task => {
      if (task.id === taskId) {
        if (task.isRunning) {
          clearInterval(task.timerId);
          return { ...task, isRunning: false, timerId: null };
        } else {
          const intervalId = setInterval(() => {
            updateTaskTime(taskId);
          }, 60000);
          return { ...task, isRunning: true, timerId: intervalId };
        }
      }
      return task;
    }));
  };

  const updateTaskTime = (taskId) => {
    setTasks(prev => {
      const updated = prev.map(task => {
        if (task.id === taskId && task.isRunning) {
          return { ...task, timeSpent: task.timeSpent + 1 };
        }
        return task;
      });
      saveTasksToBackend(updated);
      return updated;
    });
  };

  const endTask = (taskId) => {
    setTasks(prev => {
      const updated = prev.map(task => {
        if (task.id === taskId) {
          if (task.timerId) clearInterval(task.timerId);
          return { ...task, isRunning: false, timerId: null };
        }
        return task;
      });
      saveTasksToBackend(updated);
      return updated;
    });
  };

  const deleteTask = (taskId) => {
    const updated = tasks.filter(task => {
      if (task.id === taskId && task.timerId) {
        clearInterval(task.timerId);
      }
      return task.id !== taskId;
    });
    setTasks(updated);
    saveTasksToBackend(updated);
  };

  const saveTasksToBackend = (taskData) => {
    fetch('http://localhost:4000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    }).catch(err => console.error('Failed to save tasks:', err));
  };

  return (
    <div className="App">
      <h1>To-Do Timer App</h1>
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Enter task description"
      />
      <button onClick={() => addTask(false)}>Add Task (No Timer)</button>
      <button onClick={() => addTask(true)}>Add Task (With Timer)</button>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.text}</strong> - {task.timeSpent} min
            {task.isTimed && (
              <>
                <button onClick={() => toggleTimer(task.id)}>
                  {task.isRunning ? 'Pause' : 'Resume'}
                </button>
                <button onClick={() => endTask(task.id)}>End</button>
              </>
            )}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

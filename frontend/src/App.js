// File: src/App.js
// A simple To-Do app with optional task timing functionality and backend support

/*
Key Concepts Explained:
State Management (useState):
useState is used to manage the state of tasks (tasks) and the input text (taskText).
State updates trigger re-renders of the component.

Side Effects (useEffect):
useEffect is used to fetch tasks from the backend when the component mounts.
The empty dependency array ensures this effect runs only once.

Event Handlers:
Functions like addTask, toggleTimer, endTask, and deleteTask handle user interactions and update the state accordingly.

Rendering (return and JSX):
The return statement contains JSX, which defines the structure and behavior of the UI.
Dynamic rendering is achieved using .map() to iterate over the tasks array.

Controlled Components:
The input field is a controlled component, with its value bound to the taskText state and updated via onChange.
*/

// Importing React and necessary hooks
import React, { useState, useEffect } from 'react';
// Importing the CSS file for styling
import './App.css';

// Main App component
function App() {
  // State to hold the list of tasks
  const [tasks, setTasks] = useState([]);
  // State to hold the current input text for a new task
  const [taskText, setTaskText] = useState('');

  // useEffect hook to fetch tasks from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:4000/tasks') // Fetch tasks from the backend API
      .then(res => res.json()) // Parse the response as JSON
      .then(data => setTasks(data)) // Update the tasks state with the fetched data
      .catch(err => console.error('Failed to load tasks:', err)); // Log any errors
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Function to add a new task
  const addTask = (isTimed) => {
    // Create a new task object
    const newTask = {
      id: Date.now(), // Unique ID based on the current timestamp
      text: taskText, // Task description from the input field
      isTimed, // Whether the task has a timer
      timeSpent: 0, // Initial time spent on the task
      isRunning: false, // Timer is not running initially
      timerId: null // No timer interval ID initially
    };

    // Add the new task to the existing list of tasks
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks); // Update the state with the new list of tasks
    saveTasksToBackend(updatedTasks); // Save the updated tasks to the backend
    setTaskText(''); // Clear the input field
  };

  // Function to toggle the timer for a specific task
  const toggleTimer = (taskId) => {
    setTasks((prev) => prev.map(task => {
      if (task.id === taskId) { // Find the task to toggle
        if (task.isRunning) { // If the timer is running, stop it
          clearInterval(task.timerId); // Clear the interval
          return { ...task, isRunning: false, timerId: null }; // Update task state
        } else { // If the timer is not running, start it
          const intervalId = setInterval(() => {
            updateTaskTime(taskId); // Increment the time spent every minute
          }, 60000); // 60000ms = 1 minute
          return { ...task, isRunning: true, timerId: intervalId }; // Update task state
        }
      }
      return task; // Return other tasks unchanged
    }));
  };

  // Function to update the time spent on a task
  const updateTaskTime = (taskId) => {
    setTasks(prev => {
      const updated = prev.map(task => {
        if (task.id === taskId && task.isRunning) { // Update only if the timer is running
          return { ...task, timeSpent: task.timeSpent + 1 }; // Increment time spent
        }
        return task; // Return other tasks unchanged
      });
      saveTasksToBackend(updated); // Save the updated tasks to the backend
      return updated; // Update the state
    });
  };

  // Function to end a task's timer
  const endTask = (taskId) => {
    setTasks(prev => {
      const updated = prev.map(task => {
        if (task.id === taskId) { // Find the task to end
          if (task.timerId) clearInterval(task.timerId); // Clear the timer if running
          return { ...task, isRunning: false, timerId: null }; // Update task state
        }
        return task; // Return other tasks unchanged
      });
      saveTasksToBackend(updated); // Save the updated tasks to the backend
      return updated; // Update the state
    });
  };

  // Function to delete a task
  const deleteTask = (taskId) => {
    const updated = tasks.filter(task => {
      if (task.id === taskId && task.timerId) {
        clearInterval(task.timerId); // Clear the timer if running
      }
      return task.id !== taskId; // Remove the task from the list
    });
    setTasks(updated); // Update the state with the remaining tasks
    saveTasksToBackend(updated); // Save the updated tasks to the backend
  };

  // Function to save tasks to the backend
  const saveTasksToBackend = (taskData) => {
    fetch('http://localhost:4000/tasks', { // Send a POST request to the backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Specify JSON content type
      },
      body: JSON.stringify(taskData) // Send the tasks as JSON
    }).catch(err => console.error('Failed to save tasks:', err)); // Log any errors
  };

  // JSX to render the UI
  return (
    <div className="App">
      <h1>To-Do Timer App</h1>
      {/* Input field for entering a new task */}
      <input
        type="text"
        value={taskText} // Controlled input bound to taskText state
        onChange={(e) => setTaskText(e.target.value)} // Update state on input change
        placeholder="Enter task description" // Placeholder text
      />
      {/* Buttons to add a new task */}
      <button onClick={() => addTask(false)}>Add Task (No Timer)</button>
      <button onClick={() => addTask(true)}>Add Task (With Timer)</button>

      {/* List of tasks */}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.text}</strong> - {task.timeSpent} min {/* Task description and time spent */}
            {task.isTimed && ( // Show timer controls only for timed tasks
              <>
                <button onClick={() => toggleTimer(task.id)}>
                  {task.isRunning ? 'Pause' : 'Resume'} {/* Toggle timer button */}
                </button>
                <button onClick={() => endTask(task.id)}>End</button> {/* End timer button */}
              </>
            )}
            <button onClick={() => deleteTask(task.id)}>Delete</button> {/* Delete task button */}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Export the App component as the default export
export default App;

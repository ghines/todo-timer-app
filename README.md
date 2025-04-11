# 📝 To-Do Timer App

A simple yet flexible full-stack To-Do web app built with React and Express.js. It supports **task tracking with optional timers**, and persists data to a **JSON file** on the backend.

---

This project was written entirely by ChatGPT prompt to setup the project and initial files. Github Copilot was used to flesh out comments (so that I could understand the React better as
I'm still learning that part). The longest part of this project was getting this README configured and displayed the way I wanted. No edits have been made to the actual code as of yet.

---

## 🚀 Features

- Add tasks with or without timers.
- Pause/resume and end task timers.
- Delete tasks individually.
- Time updates every minute (not every second).
- Data is saved to a JSON file (`tasks.json`) for simplicity.
- VSCode workspace support included!

---

## 📁 Project Structure

    todo-timer-app/ 
    ├── frontend/ # React UI 
    │   └── src/ 
    │ └── App.js # Main React component 
    ├── backend/ # Express server 
    │ └── index.js # Backend logic 
    │ └── tasks.json # Saved tasks data 
    └── todo-timer-app.code-workspace # VSCode workspace config


---

## 🛠️ Setup Instructions

> One-line setup (bash):
bash setup-todo-timer-app.sh

---

## 🧪 How to Run It
1. Start Backend
   - cd backend
   - node index.js
2. Start Frontend in a new terminal:
    - cd frontend
    - npm start

App runs at: http://localhost:3000
Backend server at: http://localhost:4000

## 💡 Tips for Development
    - Modify task logic: In frontend/src/App.js.
    - Style the app: Use frontend/src/App.css.
    - Data persistence: Backend writes to backend/tasks.json.
    - Troubleshooting CORS: Express has CORS enabled for frontend requests.

## 🧩 Extending the App
You can extend this project with:

- Due dates
- Priority levels
- Daily/weekly summaries
- LocalStorage fallback
- Export/import task data

## 🧑‍💻 Open in VSCode
code todo-timer-app.code-workspace

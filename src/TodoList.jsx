import { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { HiPencilAlt } from "react-icons/hi";
import "./TodoList.css";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [theme, setTheme] = useState("light");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://django-backend-nb2g.onrender.com/api/todos/"
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    if (task.trim() === "") return;

    const newTask = { title: task, completed: false };
    try {
      const response = await axios.post(
        "https://django-backend-nb2g.onrender.com/api/todos/",
        newTask
      );
      setTasks([...tasks, response.data]);
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error.response);
    }
  };

  // Delete a task
  const removeTask = async (index) => {
    const taskToDelete = tasks[index];

    try {
      await axios.delete(
        `https://django-backend-nb2g.onrender.com/api/todos/${taskToDelete.id}/`
      );
      setTasks(tasks.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting task:", error.response);
    }
  };

  // Toggle completion status
  const toggleCompletion = async (index) => {
    const taskToUpdate = tasks[index];
    try {
      const response = await axios.patch(
        `https://django-backend-nb2g.onrender.com/api/todos/${taskToUpdate.id}/`,
        { completed: !taskToUpdate.completed }
      );
      const updatedTasks = tasks.map((t, i) =>
        i === index ? response.data : t
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error.response);
    }
  };

  // Enable edit mode
  const enableEdit = (task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
  };

  // Save the edited task
  const saveEdit = async (taskId) => {
    try {
      const response = await axios.patch(
        `https://django-backend-nb2g.onrender.com/api/todos/${taskId}/`,
        { title: editedTitle }
      );
      const updatedTasks = tasks.map((t) =>
        t.id === taskId ? response.data : t
      );
      setTasks(updatedTasks);
      setEditingTaskId(null);
      setEditedTitle("");
    } catch (error) {
      console.error("Error editing task:", error.response);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditedTitle("");
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Completed") return task.completed;
    if (filter === "Pending") return !task.completed;
    return true;
  });

  // Handle Enter key for adding
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      <div className="header">
        <h2>Task Manager</h2>
      </div>
      <div className="container">
        <button className="togglebutton" onClick={toggleTheme}>
          {theme === "light" ? (
            <i className="fas fa-moon"></i>
          ) : (
            <i className="fas fa-sun"></i>
          )}
        </button>

        <div className="input-container">
          <input
            type="text"
            placeholder="Add a new task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button className="add-task-button" onClick={addTask}>
          <i className="fas fa-plus"></i>
        </button>

        <div className="filters">
          <button onClick={() => setFilter("All")} className="filterbtn">
            All
          </button>
          <button onClick={() => setFilter("Completed")} className="filterbtn">
            Completed
          </button>
          <button onClick={() => setFilter("Pending")} className="filterbtn">
            Pending
          </button>
        </div>

        <ul>
          {filteredTasks.map((t, index) => (
            <li
              key={index}
              style={{
                textDecoration: t.completed ? "line-through" : "none",
              }}
            >
              {editingTaskId === t.id ? (
                <>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <button onClick={() => saveEdit(t.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleCompletion(index)}
                  />
                  <span>{t.title}</span>
                  <button onClick={() => enableEdit(t)} className="edit-button">
                    <HiPencilAlt size="19" />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => removeTask(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

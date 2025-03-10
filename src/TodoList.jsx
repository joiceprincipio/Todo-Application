import { useState, useEffect } from "react"; // Import necessary modules from React library
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS for icons
import "./TodoList.css"; // Import custom CSS styles for the TodoList component

export default function TodoList() {
  // tasks: Array of tasks, each task is an object with text and priority properties
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // useEffect hook to load theme from local storage on component mount
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Function to remove a task from the list
  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
    setCompletedTasks(completedTasks.filter((_, i) => i !== index));
  };

  // Function to add or update a task
  const addTask = () => {
    if (task.trim() === "") return;
    if (editIndex !== null) {
      // Update existing task if in edit mode
      const updatedTasks = tasks.map((t, index) =>
        index === editIndex ? { ...t, text: task } : t
      );
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      setTasks([...tasks, { text: task, priority: false }]);
      setCompletedTasks([...completedTasks, false]);
    }
    setTask("");
  };

  // Function to set edit mode for a task
  const editTask = (index) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  // Function to toggle task completion status
  const toggleCompletion = (index) => {
    // Update the completedTasks array to toggle the completion status of the task at the specified index
    const updatedCompletedTasks = completedTasks.map((completed, i) =>
      i === index ? !completed : completed
    );
    setCompletedTasks(updatedCompletedTasks);
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((_, index) => {
    if (filter === "All") return true;
    if (filter === "Completed") return completedTasks[index];
    if (filter === "Pending") return !completedTasks[index];
    return true;
  });

  // Function to handle Enter key press for adding tasks
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className="container">
      <h2>To-Do List</h2>
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
        <button className="add-task-button" onClick={addTask}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div>
        {/* Buttons for filtering tasks */}
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Completed")}>Completed</button>
        <button onClick={() => setFilter("Pending")}>Pending</button>
      </div>
      <ul>
        {filteredTasks.map((t, index) => (
          <li
            key={index}
            style={{
              textDecoration: completedTasks[index] ? "line-through" : "none",
            }}
          >
            <input
              type="checkbox"
              checked={completedTasks[index]}
              onChange={() => toggleCompletion(index)}
            />
            <span>{t.text}</span>
            {/* Edit icon*/}
            <button className="edit-button" onClick={() => editTask(index)}>
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            {/* Delete icon*/}
            <button className="delete-button" onClick={() => removeTask(index)}>
              <i className="fas fa-trash"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

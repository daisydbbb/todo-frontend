import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import userData from "../data/user_data.json";
// import todoData from "../data/todo_data.json";
import TaskForm from "../components/TaskForm";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Todo() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]); // list of todo tasks
  const [taskToEdit, setTaskToEdit] = useState(null); // single task, add/edit

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const fetTasks = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        // get currentUser
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);

        const res = await axios.get("http://localhost:5001/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(res.data);
      } catch (error) {
        console.log("Error in fetching data: ", error);
        alert("Sesson expired or unauthorized, please try again!");
        sessionStorage.clear();
        navigate("/login");
      }
    };
    fetTasks();
  }, [navigate]);

  const handleAddOrEdit = (task) => {
    try {
      if (taskToEdit) {
        // edit
        const updatedTasks = tasks.map((t) => (t._id === task._id ? task : t));
        setTasks(updatedTasks);
        setTaskToEdit(null);
      } else {
        //add
        setTasks([...tasks, task]);
      }
    } catch (error) {
      console.error("Failed to Edit/Add: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Failed to delete: ", error);
    }
  };

  const handleToggleComplete = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    try {
      const res = await axios.put(
        `http://localhost:5001/api/tasks/${task._id}`,
        { text: task.text, completed: !task.completed },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedTasks = tasks.map((t) => (t._id === id ? res.data : t));
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Failed to toggle completion: ", error);
    }
  };

  // if user not logged in
  if (!currentUser) {
    return (
      <div className="container mt-5">
        <h2>Please login to see the todo list!</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="text-end mb-2">
        <h5 className="mb-1">Welcome, {currentUser.username} 👋</h5>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => {
            sessionStorage.removeItem("currentUser");
            navigate("/login");
          }}
        >
          Log out
        </button>
      </div>
      <h2 className="text-center">TODO LIST</h2>

      <TaskForm
        onSubmit={handleAddOrEdit}
        onCancel={() => setTaskToEdit(null)}
        taskToEdit={taskToEdit}
      />

      <div className="container mt-4 text-center w-75 wt-auto">
        {tasks.length === 0 ? (
          <p>Add your FIRST task!</p>
        ) : (
          <ul className="list-group">
            {tasks.map((t) => (
              <li
                key={t._id}
                className="list-group-item d-flex justify-content-between align-items-center mb-2"
              >
                <div
                  style={{ cursor: "pointer" }}
                  className={t.completed ? "text-decoration-line-through" : ""}
                  onClick={() => handleToggleComplete(t._id)}
                >
                  {t.text}
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => setTaskToEdit(t)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success me-2"
                    onClick={() => handleToggleComplete(t._id)}
                  >
                    {t.completed ? "Undo" : "Done"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(t._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

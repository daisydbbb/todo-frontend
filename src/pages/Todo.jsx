import React, { useState, useEffect, useCallback } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem("token");

  const fetchTasks = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setIsLoading(true);
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);

      const res = await axios.get("http://localhost:5001/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      setError(null);
    } catch (error) {
      console.error("Error in fetching data: ", error);
      setError("Session expired or unauthorized, please try again!");
      sessionStorage.clear();
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddOrEdit = async (task) => {
    try {
      if (taskToEdit) {
        // edit
        const updatedTasks = tasks.map((t) => (t._id === task._id ? task : t));
        setTasks(updatedTasks);
        setTaskToEdit(null);
      } else {
        //add
        setTasks((prevTasks) => [...prevTasks, task]);
      }
    } catch (error) {
      console.error("Failed to Edit/Add: ", error);
      setError("Failed to update task. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Failed to delete: ", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  const handleToggleComplete = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    try {
      const res = await axios.put(
        `http://localhost:5001/api/tasks/${task._id}`,
        { text: task.text, completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === id ? res.data : t))
      );
    } catch (error) {
      console.error("Failed to toggle completion: ", error);
      setError("Failed to update task status. Please try again.");
    }
  };

  // if user not logged in
  if (!currentUser) {
    return (
      <div className="container mt-5 text-center">
        <h2>Please login to see the todo list!</h2>
      </div>
    );
  }

  return (
    <div className="container mt-3 mt-md-5 px-3 px-md-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Welcome, {currentUser.username} 👋</h5>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => {
            sessionStorage.clear();
            navigate("/login");
          }}
        >
          Log out
        </button>
      </div>

      <h2 className="text-center mb-4">TODO LIST</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <TaskForm
        onSubmit={handleAddOrEdit}
        onCancel={() => setTaskToEdit(null)}
        taskToEdit={taskToEdit}
      />

      <div className="container mt-4">
        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center">Add your FIRST task!</p>
        ) : (
          <div className="list-group">
            {tasks.map((t) => (
              <div
                key={t._id}
                className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center mb-2 p-3"
              >
                <div
                  className={`flex-grow-1 mb-2 mb-md-0 ${
                    t.completed ? "text-decoration-line-through text-muted" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleToggleComplete(t._id)}
                >
                  {t.text}
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setTaskToEdit(t)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

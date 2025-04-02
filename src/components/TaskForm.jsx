// Used for adding and editing tasks
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskForm({ onCancel, onSubmit, taskToEdit }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setText(taskToEdit.text);
    } else {
      setText("");
    }
  }, [taskToEdit]); // if for edit, fill original text of the task

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const token = sessionStorage.getItem("token");
    try {
      if (taskToEdit) {
        // update
        const res = await axios.put(
          `http://localhost:5001/api/tasks/${taskToEdit._id}`,
          { text, completed: taskToEdit.completed },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        onSubmit(res.data);
      } else {
        //add
        const res = await axios.post(
          `http://localhost:5001/api/tasks`,
          { text },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        onSubmit(res.data);
      }
      setText("");
    } catch (error) {
      console.error("Failed to submit: ", error);
      alert("Failed to submit task. Please try again.");
    }
  };

  return (
    <div className="container mt-3 w-50 wx-auto">
      <form onSubmit={handleSubmit}>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="btn btn-sm btn-outline-primary">
            {taskToEdit ? "Update" : "Add"}
          </button>
          {taskToEdit && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

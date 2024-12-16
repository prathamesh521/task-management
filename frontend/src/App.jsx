import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    entity_name: "",
    task_type: "",
    task_time: "",
    contact_person: "",
    note: "",
    status: "open",
  });
  const [editTask, setEditTask] = useState(null);

  // Fetch tasks from the API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("https://task-management-chi-snowy.vercel.app/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editTask) {
      setEditTask({ ...editTask, [name]: value });
    } else {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTask) {
      handleUpdate(editTask);
    } else {
      axios
        .post("https://task-management-chi-snowy.vercel.app/tasks", newTask)
        .then((response) => {
          alert(response.data.message);
          fetchTasks();
          setNewTask({
            entity_name: "",
            task_type: "",
            task_time: "",
            contact_person: "",
            note: "",
            status: "open",
          });
          closeModal();
        })
        .catch((error) => console.error("Error creating task:", error));
    }
  };

  const handleUpdate = (task) => {
    axios
      .put(`https://task-management-chi-snowy.vercel.app/tasks/${task.id}`, task)
      .then((response) => {
        alert(response.data.message);
        fetchTasks();
        setEditTask(null);
        closeModal();
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios
        .delete(`https://task-management-chi-snowy.vercel.app/tasks/${taskId}`)
        .then((response) => {
          alert(response.data.message);
          fetchTasks();
        })
        .catch((error) => console.error("Error deleting task:", error));
    }
  };

  const openModal = (task = null) => {
    setEditTask(task);
    const modal = new bootstrap.Modal(document.getElementById("taskModal"));
    modal.show();
  };

  const closeModal = () => {
    const modal = bootstrap.Modal.getInstance(document.getElementById("taskModal"));
    modal.hide();
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Task Management</h1>

      {/* Add Task Button */}
      <div className="text-end mb-3">
        <button className="btn btn-primary" onClick={() => openModal()}>
          Add Task
        </button>
      </div>

      {/* Task Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date Created</th>
            <th>Entity Name</th>
            <th>Task Type</th>
            <th>Task Time</th>
            <th>Contact Person</th>
            <th>Note</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.date_created}</td>
              <td>{task.entity_name}</td>
              <td>{task.task_type}</td>
              <td>{task.task_time}</td>
              <td>{task.contact_person}</td>
              <td>{task.note}</td>
              <td>{task.status}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => openModal(task)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Task Modal */}
      <div
        className="modal fade"
        id="taskModal"
        tabIndex="-1"
        aria-labelledby="taskModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="taskModalLabel">
                {editTask ? "Edit Task" : "Add New Task"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Entity Name</label>
                  <input
                    type="text"
                    name="entity_name"
                    className="form-control"
                    value={editTask ? editTask.entity_name : newTask.entity_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Task Type</label>
                  <input
                    type="text"
                    name="task_type"
                    className="form-control"
                    value={editTask ? editTask.task_type : newTask.task_type}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Task Time</label>
                  <input
                    type="time"
                    name="task_time"
                    className="form-control"
                    value={editTask ? editTask.task_time : newTask.task_time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    name="contact_person"
                    className="form-control"
                    value={editTask ? editTask.contact_person : newTask.contact_person}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Note</label>
                  <input
                    type="text"
                    name="note"
                    className="form-control"
                    value={editTask ? editTask.note : newTask.note}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={editTask ? editTask.status : newTask.status}
                    onChange={handleChange}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  {editTask ? "Update Task" : "Add Task"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

"use client";
import { useState, useEffect } from "react";
import { FaCheck, FaTrash, FaPlus, FaSave, FaEdit } from "react-icons/fa";
import '../../../styles/tasks.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("/api");
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const addTask = async () => {
    if (newTask.trim() === "") {
      setErrorMessage("El título de la tarea es obligatorio");
      return;
    }
    const response = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask, description: newDescription, completed: false }),
    });
    const task = await response.json();
    setTasks([...tasks, task]);
    showSuccessMessage("Tarea agregada exitosamente");
    setNewTask("");
    setNewDescription("");
    setShowForm(false);
    setErrorMessage("");
  };

  const updateTask = async () => {
    if (newTask.trim() === "") {
      setErrorMessage("El título de la tarea es obligatorio");
      return;
    }
    const response = await fetch("/api", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingTask.id,
        title: newTask,
        description: newDescription,
        completed: editingTask.completed,
        createdAt: editingTask.createdAt,
      }),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      showSuccessMessage("Tarea actualizada exitosamente");
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      resetForm();
    } else {
      console.error("Error al actualizar la tarea:", await response.text());
    }
  };

  const resetForm = () => {
    setNewTask("");
    setNewDescription("");
    setEditingTask(null);
    setShowForm(false);
    setErrorMessage("");
  };

  const toggleTaskState = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    const response = await fetch("/api", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (response.ok) {
      const data = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === data.id ? { ...t, completed: data.completed } : t))
      );
    } else {
      console.error("Error al actualizar la tarea:", await response.text());
    }
  };

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta tarea?");
    if (!confirmDelete) return;

    await fetch("/api", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    showSuccessMessage("Tarea eliminada exitosamente");
  };

  return (
    <div className="task-container">
      <h1>Lista de Tareas</h1>
      <button className="add-task-button" onClick={() => setShowForm(!showForm)}>
        <FaPlus /> Agregar tarea
      </button>
      {successMessage && <p className="success-message">{successMessage}</p>}

      {showForm && (
        <div className={`task-form ${showForm ? "show" : ""}`}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nueva tarea"
            className="new-task-input"
          />
          
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Descripción de la tarea"
            className="new-task-description"
          />
          
          {editingTask ? (
            <button onClick={updateTask} className="modify-button">
              <FaSave /> Modificar
            </button>
          ) : (
            <button onClick={addTask} className="submit-button">Guardar</button>
          )}
        
        </div>
      )}

      <div className="tasks-list">
        {tasks.map((task) => (
          <div
            className={`task-card ${task.completed ? "completed" : "not-completed"}`}
            key={task.id}
          >
            <h2 className="task-title">{task.title}</h2>
            <p className="task-description">{task.description}</p>
            <p className="task-created-at">
              Creado el: {task.createdAt ? new Date(task.createdAt).toLocaleString("en-US", { dateStyle: 'short', timeStyle: 'short' }) : "Fecha no disponible"}
            </p>
            <p className="task-status">Estado: {task.completed ? "Completada" : "No completada"}</p>

            
            <div className="task-buttons-container">
              <button className="toggle-button" onClick={() => toggleTaskState(task)}>
                <FaCheck /> {task.completed ? "Desmarcar" : "Completar"}
              </button>
              <button className="delete-button" onClick={() => deleteTask(task.id)}>
                <FaTrash /> Eliminar
              </button>
              <button
                className="update-button"
                onClick={() => {
                  setEditingTask(task);
                  setNewTask(task.title);
                  setNewDescription(task.description || "");
                  setShowForm(true);
                }}
              >
                <FaEdit /> Actualizar
              </button>
            </div>
          
          
          
          </div>
        ))}
      </div>
    </div>
  );
}

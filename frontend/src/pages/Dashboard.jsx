import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./pages.css";

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // ✅ Using the same base URL as TodoApp
  const API_BASE = "http://localhost:5000";

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_BASE);
      setTodos(res.data);
      updateStats(res.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  // Update statistics
  const updateStats = (todosData) => {
    const completedCount = todosData.filter(todo => todo.completed).length;
    const pendingCount = todosData.filter(todo => !todo.completed).length;
    const totalCount = todosData.length;
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    setStats({
      total: totalCount,
      completed: completedCount,
      pending: pendingCount,
      completionRate: completionRate
    });

    setChartData([
      { name: "Completed", value: completedCount },
      { name: "Pending", value: pendingCount }
    ]);

    setPieData([
      { name: "Completed", value: completedCount },
      { name: "Pending", value: pendingCount }
    ]);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ✅ Toggle todo completion (same as TodoApp)
  const toggleTodoCompletion = async (id, currentStatus) => {
    try {
      const res = await axios.put(API_BASE, { 
        id: id,
        completed: !currentStatus 
      });
      
      // Update local state
      setTodos(todos.map(todo => todo._id === id ? res.data : todo));
      
      // Refresh stats
      fetchTodos();
    } catch (error) {
      console.error("Failed to update todo:", error);
      alert("Failed to update todo.");
    }
  };

  // ✅ Delete todo (same as TodoApp)
  const deleteTodo = async (id) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        await axios.delete(API_BASE, { data: { id: id } });
        
        // Remove from local state
        setTodos(todos.filter(todo => todo._id !== id));
        
        // Refresh stats
        fetchTodos();
        
        alert("✅ Todo deleted successfully!");
      } catch (error) {
        console.error("Failed to delete todo:", error);
        alert("Failed to delete todo.");
      }
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Todo Dashboard</h2>
        <p>Overview of your tasks and progress</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>{stats.completionRate}%</h3>
            <p>Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Tasks Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4a90e2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Task Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ UPDATED: Recent Todos Section with Actions */}
      <div className="todos-section">
        <div className="section-header">
          <h3>Recent Tasks</h3>
          <span className="todo-count">{todos.length} tasks</span>
        </div>
        
        <div className="todos-grid">
          {todos.slice(0, 6).map(todo => (
            <div key={todo._id} className={`todo-card ${todo.completed ? 'completed' : 'pending'}`}>
              <div className="todo-header">
                <h4>{todo.title}</h4>
                <span className={`status-badge ${todo.completed ? 'completed' : 'pending'}`}>
                  {todo.completed ? '✅ Completed' : '⏳ Pending'}
                </span>
              </div>
              <p className="todo-description">{todo.description}</p>
              <div className="todo-footer">
                <span className="todo-date">{formatDate(todo.createdAt)}</span>
                <div className="todo-actions">
                  {/* ✅ Toggle Completion Button */}
                  <button 
                    className={`toggle-btn ${todo.completed ? 'mark-pending' : 'mark-complete'}`}
                    onClick={() => toggleTodoCompletion(todo._id, todo.completed)}
                  >
                    {todo.completed ? 'Mark Pending' : 'Mark Complete'}
                  </button>
                  
                  {/* ✅ Delete Button */}
                  <button 
                    className="delete-btn"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {todos.length > 6 && (
          <div className="view-all">
            <button className="view-all-btn">View All Tasks ({todos.length})</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
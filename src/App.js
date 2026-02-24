import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import EmployeeCard from './components/EmployeeCard';
import EmployeeForm from './components/EmployeeForm';
import DepartmentFilter from './components/DepartmentFilter';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on load
  useEffect(() => {
    axios.get('http://localhost:3001/api/auth/status', { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          setAuthenticated(true);
          setUser(res.data.user);
          fetchData();
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Auth check failed:', err);
        setLoading(false);
      });
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      axios.get('http://localhost:3001/api/employees', { withCredentials: true }),
      axios.get('http://localhost:3001/api/departments', { withCredentials: true })
    ])
    .then(([employeesRes, departmentsRes]) => {
      setEmployees(employeesRes.data);
      setDepartments(departmentsRes.data);
    })
    .catch(err => {
      console.error('Failed to fetch data:', err);
      if (err.response?.status === 401) {
        setAuthenticated(false);
      }
    })
    .finally(() => setLoading(false));
  };

  const handleLoginSuccess = (userData) => {
    setAuthenticated(true);
    setUser(userData);
    fetchData();
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/logout', {}, { withCredentials: true });
      setAuthenticated(false);
      setUser(null);
      setEmployees([]);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this employee?')) {
      axios.delete(`http://localhost:3001/api/employees/${id}`, { withCredentials: true })
        .then(() => {
          setEmployees(employees.filter(emp => emp.id !== id));
        })
        .catch(err => console.error(err));
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleSubmit = (formData) => {
    if (editingEmployee) {
      axios.put(`http://localhost:3001/api/employees/${editingEmployee.id}`, formData, { withCredentials: true })
        .then(res => {
          setEmployees(employees.map(emp =>
            emp.id === editingEmployee.id ? res.data : emp
          ));
          cancelForm();
        })
        .catch(err => console.error(err));
    } else {
      axios.post('http://localhost:3001/api/employees', formData, { withCredentials: true })
        .then(res => {
          setEmployees([...employees, res.data]);
          cancelForm();
        })
        .catch(err => console.error(err));
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const filteredEmployees = selectedDept === 'all'
    ? employees
    : employees.filter(e => e.department_id === parseInt(selectedDept));

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!authenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🏥 Hospital Employee Directory</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="controls">
        <DepartmentFilter
          departments={departments}
          selectedDept={selectedDept}
          onFilterChange={setSelectedDept}
        />
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Employee'}
        </button>
      </div>

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          departments={departments}
          onSubmit={handleSubmit}
          onCancel={cancelForm}
        />
      )}

      <div className="employee-grid">
        {filteredEmployees.map(emp => (
          <EmployeeCard
            key={emp.id}
            employee={emp}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
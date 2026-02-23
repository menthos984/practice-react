import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeCard from './components/EmployeeCard';
import EmployeeForm from './components/EmployeeForm';
import DepartmentFilter from './components/DepartmentFilter';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Delete this employee?')) {
      axios.delete(`http://localhost:3001/api/employees/${id}`)
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
      // Update
      axios.put(`http://localhost:3001/api/employees/${editingEmployee.id}`, formData)
        .then(res => {
          setEmployees(employees.map(emp =>
            emp.id === editingEmployee.id ? res.data : emp
          ));
          cancelForm();
        })
        .catch(err => console.error(err));
    } else {
      // Create
      axios.post('http://localhost:3001/api/employees', formData)
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

  useEffect(() => {
    axios.get('http://localhost:3001/api/employees')
      .then(res => {
        setEmployees(res.data);
      })
      .catch(err => {
        console.error('Employee error:', err);
      });

    axios.get('http://localhost:3001/api/departments')
      .then(res => {
        setDepartments(res.data);
      })
      .catch(err => {
        console.error('Dept error:', err);
      });
  }, []);
  return (
    <div className="container">
      <h1>🏥 Hospital Employee Directory</h1>

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
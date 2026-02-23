import React, { useState, useEffect } from 'react';
import { calculateAge } from '../utils/ageCalculator';

function EmployeeForm({ employee, departments, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birthday: '',
    department_id: '',
    age: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        birthday: employee.birthday ? employee.birthday.split('T')[0] : '',
        department_id: employee.department_id || '',
        age: employee.age || ''
      });
    }
  }, [employee]);

  // Update age when birthday changes
  useEffect(() => {
    if (formData.birthday) {
      const age = calculateAge(formData.birthday);
      setFormData(prev => ({ ...prev, age }));
    }
  }, [formData.birthday]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // age is already in formData from the useEffect above
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <h3>{employee ? 'Edit Employee' : 'Add New Employee'}</h3>
      <div className="form-grid">
        <input
          type="text"
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) => setFormData({...formData, first_name: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
          required
        />
        <input
          type="date"
          placeholder="Birthday"
          value={formData.birthday}
          onChange={(e) => setFormData({...formData, birthday: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          readOnly
          className="age-field"
          required
        />
        <select
          value={formData.department_id}
          onChange={(e) => setFormData({...formData, department_id: e.target.value})}
          required
        >
          <option value="">Select Department</option>
          {departments.map(d => (
            <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>
          ))}
        </select>
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {employee ? 'Update' : 'Save'}
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

export default EmployeeForm;
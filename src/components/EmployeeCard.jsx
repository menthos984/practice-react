import React from 'react';
import { calculateAge } from '../utils/ageCalculator';

function EmployeeCard({ employee, onDelete, onEdit }) {
  return (
    <div className="employee-card">
      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(employee)}>✎</button>
        <button className="btn-delete" onClick={() => onDelete(employee.id)}>×</button>
      </div>
      <h3>{employee.first_name} {employee.last_name}</h3>
      <p><strong>Age:</strong> {calculateAge(employee.birthday)}</p>
      <p><strong>Birthday:</strong> {new Date(employee.birthday).toLocaleDateString()}</p>
      <p><strong>Department:</strong> {employee.dept_name || 'Unassigned'}</p>
    </div>
  );
}

export default EmployeeCard;
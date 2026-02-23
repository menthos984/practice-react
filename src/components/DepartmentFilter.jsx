import React from 'react';

function DepartmentFilter({ departments, selectedDept, onFilterChange }) {
  return (
    <div className="filters">
      <label>Filter by Department: </label>
      <select onChange={(e) => onFilterChange(e.target.value)} value={selectedDept}>
        <option value="all">All Departments</option>
        {departments.map(d => (
          <option key={d.dept_id} value={d.dept_id}>
            {d.dept_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DepartmentFilter;
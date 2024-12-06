/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import './UserList.css';

const UserList = ({ user, toggleEdit, handleGroupChange, selectedGroup, groups }) => {
  return (
    <li className="user-item">
      <span className="user-email">{user.email}</span> 
      <div>

        {['L1', 'L2', 'L3', 'employee'].includes(selectedGroup) && (
          <button className="edit-button" onClick={() => toggleEdit(user)}>Inviter</button>
        )}
        <select 
          onChange={(e) => handleGroupChange(user.id, e.target.value)} 
          defaultValue={user.group}
        >
          <option value="">Sélectionner un groupe</option>
          {groups.map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>
    </li>
  );
}

export default UserList;

import React from 'react'
import TickIcon from './TickIcon'
import ProgressBar from './ProgressBar'

const ListItem = ({task}) => {
  return (
    <li className="list-item">
      <div className="info-container">
        <TickIcon/>
        <p className="task-title">{task.title}</p>
        <ProgressBar/>
      </div>

      <div className="button-container">
        <button className="edit">Edit</button>
        <button className="delete">Delete</button>
      </div>
    </li>
  )
}

export default ListItem 
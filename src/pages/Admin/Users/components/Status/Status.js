import React from 'react'

const Status = ({ status }) => {
  let text;
  let color;
  switch (status) {
    case 'N':
      text = 'Inactive'
      color = '#ffcf00'
      break
    case 'Y':
      text = 'Active'
      color = '#318e43'
      break
    default:
      text = ''
      break
  }

  return (
    <div style={{ color }}>
      { text }
    </div>
  )
}

export default Status

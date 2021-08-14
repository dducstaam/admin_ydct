import React from 'react'

const Status = (props) => {
  const { status } = props
  let text;
  let color;
  switch (status) {
    case 'INACTIVE':
      text = 'Dừng hoạt động'
      color = '#ffcf00'
      break
    case 'ACTIVE':
      text = 'Đang hoạt động'
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

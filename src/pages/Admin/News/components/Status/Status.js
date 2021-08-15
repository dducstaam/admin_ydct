import React from 'react'

const Status = (props) => {
  const { status } = props
  let text;
  let color;
  switch (status) {
    case 'Unit':
      text = 'Nháp'
      color = '#ffcf00'
      break
    case 'Submit':
      text = 'Chờ duyệt'
      color = '#ffcf00'
      break
    case 'Approved':
      text = 'Đang hoạt động'
      color = '#318e43'
      break
    case 'Reject':
      text = 'Từ chối'
      color = 'rgb(207, 30, 30)'
      break
    case 'Delete':
    case 'DELETE':
      text = 'Đã xoá'
      color = '#999999'
      break
    default:
      text = status
      break
  }

  return (
    <div style={{ color }}>
      { text }
    </div>
  )
}

export default Status

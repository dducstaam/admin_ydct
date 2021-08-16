import React, { useState, useEffect } from 'react'
import * as Api from 'api/api'
import { useDispatch } from 'react-redux'
import Button from 'components/Button'
import { showNotification } from 'layout/CommonLayout/actions'
import classNames from 'classnames'
import editIcon from 'images/edit.svg'
import closeIcon from 'images/close.svg'
import classes from './ValueCol.module.scss'

const ValueCol = ({ item }) => {
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(item.value)
  const [showEdit, setShowEdit] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    if (item.value !== value) {
      setValue(value)
    }
  }, [item.value])

  const handleUpdateValue = async () => {
    try {
      setLoading(true)
      await Api.post({
        url: `/api/Confugration/update/${item.confugratioN_ID}`,
        data: {
          value,
          confugratioN_ID: item.confugratioN_ID
        }
      })
      dispatch(showNotification({
        type: 'SUCCESS',
        message: `Cập nhật giá trị của trường ${item.desc} thành ${value} thành công`
      }))
      setLoading(false)
      setShowEdit(false)
    } catch (e) {
      setLoading(false)
    }
  }
  return (
    <div>
      { showEdit
        ? (
          <div className={classes.container}>

            <input
              className={classes.input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button
              className={classNames('btn btnSmall btnMain', classes.btn)}
              loading={loading}
              onClick={handleUpdateValue}
              customLoader={classes.customLoader}
            >
              Cập nhật
            </Button>
            <a
              className={classes.btnClose}
              onClick={() => setShowEdit(false)}
            >
              <img src={closeIcon} className={classes.closeIcon} alt="close" />
            </a>
          </div>
        )
        : (
          <div className={classes.valueWrapper}>
            <span>{value}</span>
            <a
              className={classes.btnEdit}
              onClick={() => setShowEdit(true)}
            >
              <img src={editIcon} className={classes.editIcon} alt="editIcon" />
            </a>
          </div>
        )}
    </div>

  )
}

export default ValueCol

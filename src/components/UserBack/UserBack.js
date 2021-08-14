import React from 'react'
import history from 'utils/history'
import arrowIcon from 'images/arrow-left.svg'
import { FormattedMessage } from 'react-intl'
import classes from './UserBack.module.scss'

const UserBack = ({
  onClick,
  label
}) => {
  const handleBack = () => {
    if (onClick) {
      onClick()
    } else {
      history.goBack()
    }
  }
  return (
    <a
      className={classes.btnBack}
      onClick={handleBack}
    >
      <img src={arrowIcon} className={classes.arrowIcon} alt="arrow-icon" />
      { label
        || (
        <FormattedMessage
          id="UserBack.back"
          defaultMessage="Quay về trang trước"
        />
        )}

    </a>
  )
}

export default UserBack

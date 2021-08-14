import React from 'react'
import { FormattedMessage } from 'react-intl'
import cancelIcon from 'images/cancel.svg'
import classNames from 'classnames'
import Button from '../Button'
import classes from './ButtonReject.module.scss'

const ButtonReject = ({ onClick, loading, btnStyle }) => (
  <Button
    className={classNames(classes.container, btnStyle)}
    onClick={onClick}
    loading={loading}
  >
    <img src={cancelIcon} className={classes.backIcon} alt="cancel" />
    <FormattedMessage
      id="ButtonReject.reject"
      defaultMessage="Từ chối"
    />
  </Button>
)

export default ButtonReject

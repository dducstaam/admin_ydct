import React from 'react'
import { FormattedMessage } from 'react-intl'
import approveIcon from 'images/approve.svg'
import classNames from 'classnames'
import Button from '../Button'
import classes from './ButtonApprove.module.scss'

const ButtonApprove = ({ onClick, text, loading, btnStyle }) => (
  <Button
    className={classNames(classes.container, btnStyle)}
    onClick={onClick}
    loading={loading}
  >
    <img src={approveIcon} className={classes.backIcon} alt="approve" />
    { text ? <span>{text}</span> : (
      <FormattedMessage
        id="ButtonApprove.approve"
        defaultMessage="Phê Duyệt"
      />
    )}
  </Button>
)

export default ButtonApprove

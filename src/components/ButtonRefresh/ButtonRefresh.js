import React from 'react'
import classNames from 'classnames'
import Loader from 'react-loader-spinner'
import classes from './ButtonRefresh.module.scss'

const Button = ({ loading, loadingColor, className, onClick, disabled }) => (
  <a
    className={classNames(classes.btn, className,
      loading && classes.eventNone,
      disabled && classes.disabled)}
    onClick={onClick}
  >
    { loading
      ? (
        <div className={classes.loader}>
          <Loader type="Oval" color={loadingColor || '#aaaaaa'} height={20} width={20} />
        </div>
      )
      : <img src="/refresh-gray.svg" className={classes.refreshIcon} alt="icon" />}
  </a>
)

export default Button

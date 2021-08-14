import React from 'react'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import classes from './SalonType.module.scss'

const SalonType = (props) => {
  const { type } = props
  return (
    <>
      { type
      && (
      <div className={classNames(classes.container, type === 'VIP' && classes.usedContainer)}>
        { type === 'VIP' && (
        <FormattedMessage
          id="SalonType.used"
          defaultMessage="V.I.P"
        />
        )}
        { type === 'NEW'
        && (
        <FormattedMessage
          id="SalonType.new"
          defaultMessage="MỚI"
        />
        )}
      </div>
      )}
    </>
  )
}

export default SalonType

import React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import lockIcon from 'images/lock.png'
import profileIcon from 'images/profile.png'
// import FloatingLabelInput from 'react-floating-label-input'
import renderField from '../../../../Form/renderField'
import classes from './InputField.module.scss'

export class InputField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      focus: false,
      currentType: props.type,
      disabled: props.disabled
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.disabled !== prevProps.disabled) {
      this.setState({
        disabled: this.props.disabled
      })
    }
  }

  moveUpPlaceholder = () => {
    this.setState({
      focus: true
    })
  }

  moveDownPlaceholder = () => {
    this.setState({
      focus: false
    })
  }

  toggleShowPassword = () => {
    this.setState((prevState) => ({
      ...prevState,
      currentType: prevState.currentType === 'password' ? 'text' : 'password'
    }))
  }

  handleEnableInput = () => {
    this.setState({
      disabled: false
    })
  }

  render() {
    const {
      name,
      type,
      options,
      customClass,
      intl,
      maxLength,
      hasError,
      placeholder,
      input,
      customClassEye
    } = this.props
    const { currentType, disabled } = this.state
    let placeholderStr = ''
    if (placeholder) {
      placeholderStr = typeof placeholder === 'string' ? placeholder : intl.formatMessage(placeholder)
    }
    // let remainCharactor = 0
    // if (maxLength) {
    //   remainCharactor = maxLength - (value ? value.length : 0)
    // }
    return (
      <div>
        <div className={classes.inputWrapper}>
          <img
            src={type === 'password' ? lockIcon : profileIcon}
            className={classes.icon}
            alt="input-icon"
          />
          <div className={classes.inputContainer}>
            <input
              {...input}
              name={name}
              className={classNames(
                classes.input,
                customClass,
                hasError && classes.errorField,
                disabled && classes.disabled
              )}
              type={currentType}
              disabled={disabled}
              maxLength={maxLength}
              placeholder={placeholderStr}
              // autoComplete='new-password'
              {...options}
            />
            { type === 'password'
              && (
              <a
                className={classNames(classes.btnEye, customClassEye)}
                onClick={this.toggleShowPassword}
              >
                <FontAwesomeIcon
                  icon={currentType === 'password' ? faEye : faEyeSlash}
                  className={classes.eyeIcon}
                />
              </a>
              )}
          </div>
        </div>
      </div>
    )
  }
}

export default renderField(InputField)

import React from 'react'
import classNames from 'classnames'
import onClickOutside from 'react-onclickoutside'
import 'cleave.js/dist/addons/cleave-phone.vi';
import moment from 'moment'
import calendarIcon from 'images/calendar.svg'
import DateTime from 'react-datetime'
import closeIcon from 'images/close.svg'
import renderField from '../../Form/renderField'
import classes from './DatePickerField.module.scss'

const MONTHS = {
  0: 'Tháng 1',
  1: 'Tháng 2',
  2: 'Tháng 3',
  3: 'Tháng 4',
  4: 'Tháng 5',
  5: 'Tháng 6',
  6: 'Tháng 7',
  7: 'Tháng 8',
  8: 'Tháng 9',
  9: 'Tháng 10',
  10: 'Tháng 11',
  11: 'Tháng 12',
}

class DatePickerFieldComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      focus: false,
      openDatePicker: false,
      date: props.viewDate
    }
  }

  moveUpPlaceholder = () => {
    const { input } = this.props
    if (input && input.onFocus) {
      input.onFocus()
    }
    this.setState({
      focus: true,
      openDatePicker: true
    })
  }

  moveDownPlaceholder = () => {
    const { input } = this.props
    if (input && input.onBlur) {
      input.onBlur()
    }
    this.setState({
      focus: false,
    })
  }

  handleCancel = () => {
    this.setState({
      openDatePicker: false
    })
  }

  handleChangeDate = (date) => {
    const { input, timeFormat } = this.props
    if (timeFormat) {
      input.onChange(moment(date).format(`DD/MM/YYYY ${timeFormat}`))
    } else {
      input.onChange(moment(date).format('DD/MM/YYYY'))
      this.setState({
        openDatePicker: false,
      })
    }

    this.setState({
      // openDatePicker: false,
      date
    })
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.setState({
        openDatePicker: false
      })
    }
  }

  validation = (currentDate) => (
    this.props.notFurture ? currentDate.isBefore(moment(this.props.maxDate)) : true
  )

  renderMonth = (props, month) => <td {...props}>{ MONTHS[month] }</td>

  handleBlurDateTime = () => {
    this.setState({
      openDatePicker: false
    })
  }

  handleClickOutside = () => {
    this.setState({
      openDatePicker: false
    })
  }

  render() {
    const {
      input,
      name,
      type,
      customClass,
      fullBorder,
      label,
      viewMode,
      viewDate,
      hasError,
      h50,
      disabled,
      timeFormat = false,
      placeholder
    } = this.props
    const { focus, openDatePicker, date } = this.state

    return (
      <div className={classes.inputContainer}>
        <input
          label={label}
          onChange={input.onChange}
          value={input.value}
          name={name}
          className={classNames('form-control',
            classes.input,
            fullBorder && classes.fullBorder,
            customClass,
            hasError && classes.errorField,
            focus && classes.focus,
            h50 && classes.h50,
            disabled && classes.disabled)}
          type={type}
          // disabled={openDatePicker}
          onFocus={this.moveUpPlaceholder}
          onBlur={this.moveDownPlaceholder}
          placeholder={placeholder || 'DD/MM/YYYY'}
          onKeyDown={this.handleKeyDown}
          readOnly
        />
        { input.value
          && (
          <a
            className={classes.btnClear}
            onClick={() => { input.onChange(null) }}
          >
            <img src={closeIcon} className={classes.closeIcon} alt="closeIcon" />
          </a>
          )}

        <img src={calendarIcon} className={classes.calendarIcon} alt="calendar" />
        <div className={classes.dateTimePicker}>

          <DateTime
            timeFormat={timeFormat}
            open={openDatePicker}
            input={false}
            value={date}
            onChange={this.handleChangeDate}
            viewMode={viewMode || 'years'}
            viewDate={date || viewDate}
            locale="en"
            isValidDate={this.validation}
            renderMonth={this.renderMonth}
            onBlur={this.handleBlurDateTime}
            disableCloseOnClickOutside={false}
          />
        </div>

      </div>

    )
  }
}

export const DatePickerField = onClickOutside(DatePickerFieldComponent)

export default renderField(DatePickerField)

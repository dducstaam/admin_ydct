import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import classes from './Dropdown.module.scss'

const DropdownComponent = (props) => {
  const { options, label, handleSearch } = props

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        as={React.forwardRef(({ onClick }, ref) => (
          <div
            className={classes.userName}
            ref={ref}
            onClick={(e) => {
              e.preventDefault();
              onClick(e);
            }}
          >
            <span className={classes.label}>
              { label }
            </span>
            <FontAwesomeIcon icon={faCaretDown} className={classes.icon} />
          </div>
        ))}
      />

      <Dropdown.Menu className={classes.dropdownMenu}>
        { options.map((option) => (
          <Dropdown.Item
            key={option.value}
            className={classes.dropdownItem}
          >
            <span
              className={classes.optionLabel}
              onClick={() => {
                console.log('options', option)
                const [sort, sortType] = option.value.split('_')
                handleSearch({
                  sort,
                  sortType
                })
              }}
            >
              { option.label }
            </span>
          </Dropdown.Item>
        )) }
      </Dropdown.Menu>
    </Dropdown>

  )
}

export default DropdownComponent

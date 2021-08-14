import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useSearchKeyword } from 'hooks/useFilter'
import classes from './SearchComponent.module.scss'

const SearchComponent = ({ btnClass,
  placeholder,
  customClass,
  handleSearch,
  value
}) => {
  const [text, handleChangeText] = useSearchKeyword({ text: value, handleSearch })

  return (
    <div className={classNames(classes.container, customClass)}>
      <input
        className={classNames(classes.input)}
        type="text"
        value={text || ''}
        placeholder={placeholder}
        onChange={(e) => handleChangeText(e.target.value)}
        onKeyDown={(e) => {
          if (e.which === 13) {
            handleSearch(text)
          }
        }}
      />
      <a
        className={classNames(classes.btnSearch, btnClass)}
        onClick={() => handleSearch(text)}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className={classes.icon}
        />
      </a>
    </div>
  )
}

export default SearchComponent

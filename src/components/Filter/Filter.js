import React from 'react'
import classNames from 'classnames'
import SelectField from 'components/SelectField'
import SearchComponent from 'components/SearchComponent'
import DatePickerFormTo from 'components/DatePickerFormTo'
import moment from 'moment'
import classes from './Filter.module.scss'

const Filter = (props) => {
  const {
    filter,
    handleSearch,
    options
  } = props

  return (
    <div className={classNames(classes.container, 'filterContainer')}>
      { options && options.map((option) => (
        <div key={option.name} className={classNames(classes.option, option.className)}>
          { option.type === 'SEARCH'
           && (
             <div className={classes.search}>
               <SearchComponent
                 placeholder={option.label}
                 value={filter[option.name]}
                 handleSearch={(text) => handleSearch({ [option.name]: text })}
               />
             </div>
           )}

          { option.type === 'RANGER_DATE'
            && (
              <div className={classes.date}>
                <DatePickerFormTo input={{
                  value: filter[option.name],
                  onChange: (date) => {
                    handleSearch({
                      dateBegin: date.from && moment(date.from, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                      dateEnd: date.to && moment(date.to, 'DD/MM/YYYY').format('YYYY-MM-DD')
                    })
                  }
                }}
                />
              </div>
            )}

          { option.type === 'SELECT'
            && (
              <div className={classes.select}>
                <SelectField
                  options={option.options}
                  placeholder={option.label}
                  isClearable
                  input={{
                    value: filter[option.name],
                    onChange: (value) => {
                      handleSearch({ [option.name]: value?.value })
                    }
                  }}
                />
              </div>
            )}
        </div>
      )) }
    </div>
  )
}

export default Filter

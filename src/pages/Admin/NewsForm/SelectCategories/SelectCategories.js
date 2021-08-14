import React, { useEffect, useState } from 'react'
import Dropdown from 'components/Dropdown'
import * as Api from 'api/api'
import Loader from 'react-loader-spinner'
import classes from './SelectCategories.module.scss'

const SelectCategories = ({ input }) => {
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(async () => {
    try {
      setLoadingCategories(true)
      const result = await Api.get({
        url: '/api/Menu/client-menu',
      })
      setCategories(result)

      setLoadingCategories(false)
    } catch (e) {
      console.log(e)
      setLoadingCategories(false)
    }
  }, [])
  return (
    <div className={classes.container}>
      <Dropdown
        mainComponent={(
          <div className={classes.content}>
            { input.value.map((item) => (
              <div
                className={classes.value}
                key={item.id}
              >
                test
              </div>
            )) }

            { loadingCategories
              && (
              <div className={classes.loader}>
                <Loader type="Oval" color="rgba(31, 125, 161, 0.5)" height={20} width={20} />
              </div>
              )}
          </div>
    )}
        childrenComponent={() => {

        }}
      />

    </div>
  )
}

export default SelectCategories

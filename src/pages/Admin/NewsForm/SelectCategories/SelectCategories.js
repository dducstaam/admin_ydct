import React, { useEffect, useState, useMemo } from 'react'
import Dropdown from 'components/Dropdown'
import * as Api from 'api/api'
import Loader from 'react-loader-spinner'
import { renderField } from 'Form'
import closeIcon from 'images/close.svg'
import classes from './SelectCategories.module.scss'
import Menu from './Menu'

const SelectCategories = ({ input }) => {
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(async () => {
    try {
      setLoadingCategories(true)
      const result = await Api.get({
        url: '/api/Menu/client-menu',
      })
      const menus = result.map((item) => {
        let newCategories = []
        item.submenu.forEach((ite) => {
          newCategories = [...newCategories, ...ite.category]
        })
        return {
          ...item,
          categories: newCategories
        }
      })

      // console.log(menus)

      setCategories(menus)

      setLoadingCategories(false)
    } catch (e) {
      console.log(e)
      setLoadingCategories(false)
    }
  }, [])

  const categoriesId = useMemo(() => (input.value ? input.value.map((item) => item.categorY_ID) : []),
    [input.value])

  return (
    <div className={classes.container}>
      <Dropdown
        mainComponent={(
          <div className={classes.content}>
            { input.value && input.value?.map((item) => (
              <div
                className={classes.value}
                key={item.categorY_ID}
              >
                { item.desc }
                <a
                  className={classes.btnClose}
                  onClick={() => {
                    input.onChange(input.value.filter((val) => val.categorY_ID !== item.categorY_ID))
                  }}
                >
                  <img src={closeIcon} className={classes.closeIcon} alt="closeIcon" />
                </a>

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
        childrenComponent={() => (
          <div className={classes.menus}>
            { categories.map((menu) => (
              <Menu
                key={menu.menU_ID}
                menu={menu}
                categoriesId={categoriesId}
                input={input}
              />
            )) }
          </div>
        )}
      />

    </div>
  )
}

export default renderField(SelectCategories)

import React, { useState } from 'react'
import Expand from 'react-expand-animated';
import folderIcon from 'images/folder.svg'
import folderOpenIcon from 'images/folder-open.svg'
import checkIcon from 'images/check.svg'
import checkActive from 'images/checked.svg'
import caretIcon from 'images/caret.svg'
import classNames from 'classnames'

import classes from './SubMenu.module.scss'

const Submenu = ({ submenu, categoriesId, input }) => {
  const [showCategories, setShowCategories] = useState(false)

  return (
    <div className={classes.container}>
      <div
        className={classes.menu}
        onClick={() => setShowCategories((prev) => !prev)}
      >
        <img src={caretIcon} className={classNames(classes.caretIcon, showCategories && classes.caretOpen)} alt="caret" />
        <img src={showCategories ? folderOpenIcon : folderIcon} className={classes.icon} alt="icon" />
        <p className={classes.menuName}>
          { submenu.name }
        </p>
      </div>
      <Expand
        open={showCategories}
        duration={300}
      >
        { submenu.category && submenu.category.map((cat) => (
          <div
            className={classes.category}
            key={cat.categorY_ID}
            onClick={() => {
              if (categoriesId.indexOf(cat.categorY_ID) === -1) {
                input.onChange([...input.value, cat])
              } else {
                input.onChange(input.value.filter((item) => item.categorY_ID !== cat.categorY_ID))
              }
            }}
          >
            <img
              src={categoriesId.indexOf(cat.categorY_ID) === -1 ? checkIcon : checkActive}
              className={classNames(classes.checkIcon, categoriesId.indexOf(cat.categorY_ID) !== -1 && classes.checkActive)}
              alt="checkIcon"
            />
            <p className={classes.cateName}>
              { cat.name }
            </p>
          </div>
        )) }
      </Expand>
    </div>
  )
}

export default Submenu

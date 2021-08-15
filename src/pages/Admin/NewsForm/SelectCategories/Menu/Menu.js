import React, { useState } from 'react'
import Expand from 'react-expand-animated';
import folderIcon from 'images/folder.svg'
import folderOpenIcon from 'images/folder-open.svg'
import caretIcon from 'images/caret.svg'
import classNames from 'classnames'
import checkIcon from 'images/check.svg'
import checkActive from 'images/checked.svg'
import classes from './Menu.module.scss'

const Menu = ({ menu, categoriesId, input }) => {
  const [showSubmenus, setShowSubmenus] = useState(false)
  // console.log('menu===>', menu.name)
  return (
    <div className={classes.container}>
      <div
        className={classes.menu}
        onClick={() => setShowSubmenus((prev) => !prev)}
      >
        <img src={caretIcon} className={classNames(classes.caretIcon, showSubmenus && classes.caretOpen)} alt="caret" />
        <img src={showSubmenus ? folderOpenIcon : folderIcon} className={classes.icon} alt="icon" />
        <p className={classes.menuName}>
          { menu.desc }
        </p>
      </div>
      <Expand
        open={showSubmenus}
        duration={300}
      >
        <div className={classes.subMenus}>
          { menu.categories && menu.categories.map((cat) => (
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
                { cat.desc }
              </p>
            </div>
          )) }
        </div>

      </Expand>
    </div>
  )
}

export default Menu

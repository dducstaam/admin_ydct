import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import {
  Switch,
  useRouteMatch
} from 'react-router-dom'
import AdminPrivateRoute from 'routes/AdminPrivateRoute'
import Users from 'pages/Admin/Users'
import Category from 'pages/Admin/Category'
import News from 'pages/Admin/News'
import NewsForm from 'pages/Admin/NewsForm'
import ReportNews from 'pages/Admin/ReportNews'
import ReportNewsByCategory from 'pages/Admin/ReportNewsByCategory'
import HomeLinks from 'pages/Admin/HomeLinks'
import CloneLinks from 'pages/Admin/CloneLinks/CloneLinks'
import Header from '../../components/Header'
import SideBar from '../../components/SideBar'
import classes from './AdminLayout.module.scss'

const AdminLayout = (props) => {
  // console.log(props)
  const { path } = useRouteMatch()
  /**
   * state quản lý việc show menu hay không
   */
  const [showMenu, setShowMenu] = useState('FULL')
  const [noTransition, setNoTransition] = useState(true)
  const [showMenuClass, setShowMenuClass] = useState(false)

  useEffect(() => {
    setShowMenu(localStorage.getItem('showMenu') || 'FULL')
  }, [])

  /**
   * xử lý toggle menu
   */
  const handleToggleMenu = () => {
    let newShowMenu = null
    if (showMenu === 'FULL' || !showMenu) {
      newShowMenu = 'COLLAPSE'
    } else if (showMenu === 'COLLAPSE') {
      newShowMenu = 'FULL'
    }
    localStorage.setItem('showMenu', newShowMenu)
    setShowMenu(newShowMenu)
    setNoTransition(false)
  }

  /**
   * xử lý show menu
   */
  const handleShowMenuMobile = () => {
    setShowMenuClass(true)
  }

  /**
   * xử lý hide menu
   */
  const handleHideMenuMobile = () => {
    setShowMenu(false)
    setTimeout(() => {
      setShowMenuClass(false)
    }, 400)
  }

  return (
    <div
      className={classNames(classes.container, 'adminContainer')}
      id="outer-container"
    >
      <div className={classNames(classes.sideBarMobile, showMenuClass && classes.sideBarShow)}>
        <SideBar
          mobile
          handleHideMenu={handleHideMenuMobile}
          screen={screen}
          showMenu
          pathname={props.location.pathname}
        />
      </div>
      {(showMenuClass)
        && <div className={classNames('fade modal-backdrop show', classes.backdrop)} />}
      <div className={classNames(classes.header, showMenu === 'COLLAPSE' && classes.headerCollapse)}>
        <Header
          showMenu
          handleShowMenuMobile={handleShowMenuMobile}
          handleHideMenu={handleHideMenuMobile}
          handleToggleMenu={handleToggleMenu}
          collapse={showMenu === 'COLLAPSE'}
          showMenuClass={showMenuClass}
        />
      </div>
      <div className={classes.content}>
        <div className={classNames(classes.sideBar, showMenu === 'COLLAPSE' && classes.sideBarCollapseWrapper)}>
          <SideBar
            screen={screen}
            showMenu={!!showMenu}
            collapse={showMenu === 'COLLAPSE'}
            handleToggleMenu={handleToggleMenu}
            pathname={props.location.pathname}
          />
        </div>
        <div
          className={classNames(classes.main,
            showMenu === 'FULL' && classes.showMenu,
            showMenu === 'COLLAPSE' && classes.showMenuCollapse,
            noTransition && classes.noTransition)}
          id="page-wrap"
        >
          <Switch>
            <AdminPrivateRoute path={`${path}/users`} component={Users} exact />
            <AdminPrivateRoute path={`${path}/categories`} component={Category} exact />
            <AdminPrivateRoute path={`${path}/news`} component={News} exact />
            <AdminPrivateRoute path={`${path}/news/form`} component={NewsForm} exact />
            <AdminPrivateRoute path={`${path}/news/form/:id`} component={NewsForm} />
            <AdminPrivateRoute path={`${path}/report-news`} component={ReportNews} />
            <AdminPrivateRoute path={`${path}/report-news-category`} component={ReportNewsByCategory} />
            <AdminPrivateRoute path={`${path}/home-links`} component={HomeLinks} />
            <AdminPrivateRoute path={`${path}/clone-links`} component={CloneLinks} />
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout

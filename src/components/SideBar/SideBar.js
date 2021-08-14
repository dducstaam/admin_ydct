import React, { Component } from 'react'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import userIcon from 'images/sidebar/users.svg'

import noteIcon from 'images/sidebar/note2.svg'
import reportIcon from 'images/sidebar/analytics.svg'
import boxIcon from 'images/sidebar/box.svg'
import linkIcon from 'images/link.svg'

import classes from './SideBar.module.scss'

export default class SideBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      openMenus: [localStorage.getItem('openMenus')],
      pageRoles: localStorage.getItem('pageRoles') ? JSON.parse(localStorage.getItem('pageRoles')) : {},
      showMenus: localStorage.getItem('showMenus') ? JSON.parse(localStorage.getItem('showMenus')) : {}
    }
  }

  handleToggleMenu = (menu) => {
    this.setState((prevState) => {
      if (prevState.openMenus.indexOf(menu) !== -1) {
        localStorage.setItem('openMenus', '')
        return {
          ...prevState,
          openMenus: []
        }
      }
      localStorage.setItem('openMenus', menu)
      return {
        ...prevState,
        openMenus: [menu]
      }
    })
  }

  render() {
    const {
      collapse,
    } = this.props

    return (
      <PerfectScrollbar
        className={classNames(classes.container,
          collapse && classes.collapse)}
        options={{ wheelPropagation: false }}
      >
        <div className={classes.menuContainer}>
          <div className={classes.heading}>
            Quản lý
          </div>
          <div className={classes.divider} />

          <NavLink
            to="/admin/users"
            className={classNames(classes.menuItem)}
            activeClassName={classes.active}
          >
            <div className={classes.iconWrapper}>
              <img
                src={userIcon}
                alt="quan-ly-khach-hang.svg"
                className={classes.userIcon}
              />
            </div>
            <span>
              Quản lý user
            </span>

          </NavLink>

          <NavLink
            to="/admin/categories"
            className={classNames(classes.menuItem)}
            activeClassName={classes.active}
          >
            <div className={classes.iconWrapper}>
              <img
                src={boxIcon}
                alt="product.svg"
              />
            </div>
            <span>
              Quản lý danh mục
            </span>

          </NavLink>

          <NavLink
            to="/admin/news"
            className={classNames(classes.menuItem)}
            activeClassName={classes.active}
          >
            <div className={classes.iconWrapper}>
              <img
                src={noteIcon}
                alt="product.svg"
              />
            </div>
            <span>
              Quản lý bài viết
            </span>

          </NavLink>

          <NavLink
            to="/admin/home-links"
            className={classNames(classes.menuItem)}
            activeClassName={classes.active}
          >
            <div className={classes.iconWrapper}>
              <img
                src={linkIcon}
                alt="bao-cao.svg"
                className={classes.reportIcon}
              />
            </div>
            <span>
              Quản lý link liên kết
            </span>

          </NavLink>

          <NavLink
            to="/admin/clone-links"
            className={classNames(classes.menuItem)}
            activeClassName={classes.active}
          >
            <div className={classes.iconWrapper}>
              <img
                src={linkIcon}
                alt="bao-cao.svg"
                className={classes.reportIcon}
              />
            </div>
            <span>
              Quản lý link clone
            </span>

          </NavLink>

          <div className={classes.heading}>
            Báo cáo
          </div>
          <div className={classes.divider} />

          <NavLink
            to="/admin/report-news-category"
            className={classNames(classes.menuItem)}
            activeClassName={classes.active}
          >
            <div className={classes.iconWrapper}>
              <img
                src={reportIcon}
                alt="bao-cao.svg"
                className={classes.reportIcon}
              />
            </div>
            <span>
              Thông kê số lượng bài
            </span>

          </NavLink>

          <NavLink
            to="/admin/report-news"
            className={classNames(classes.menuItem)}
            activeClassName={classes.active}
          >
            <div className={classes.iconWrapper}>
              <img
                src={reportIcon}
                alt="bao-cao.svg"
                className={classes.reportIcon}
              />
            </div>
            <span>
              Thông kê tương tác
            </span>

          </NavLink>

        </div>
      </PerfectScrollbar>
      // </Menu>
    )
  }
}

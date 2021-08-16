import React, { Component } from 'react'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import userIcon from 'images/sidebar/users.svg'

import noteIcon from 'images/sidebar/note2.svg'
import reportIcon from 'images/sidebar/analytics.svg'
import boxIcon from 'images/sidebar/box.svg'
import linkIcon from 'images/link.svg'
import settingsIcon from 'images/sidebar/settings.svg'
import ExpandMenus from './ExpandMenus'

import classes from './SideBar.module.scss'

export default class SideBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      openMenus: [localStorage.getItem('openMenus')],
      pageRoles: localStorage.getItem('pageRoles') ? JSON.parse(localStorage.getItem('pageRoles')) : {},
      showMenus: localStorage.getItem('showMenus') ? JSON.parse(localStorage.getItem('showMenus')) : {},
      userInfo: JSON.parse(localStorage.getItem('userInfo'))
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
      pathname
    } = this.props

    const {
      userInfo,
      openMenus
    } = this.state

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
          { userInfo.role === 'Admin'
            && (
            <>
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
            </>
            )}

          <ExpandMenus
            menu={{
              image: noteIcon,
              label: 'Quản lý bài viết',
              value: 'NEWS',
            }}
            subMenus={[{
              label: 'Bài viết nháp',
              value: 'DRAFT',
              href: '/admin/news/draft'
            }, {
              label: 'Bài viết đã xoá',
              value: 'DELETED',
              href: '/admin/news/delete'
            }, {
              label: 'Bài viết chờ duyệt',
              value: 'WAITING_APPROVE',
              href: '/admin/news/waiting-approve'
            }, {
              label: 'Bài viết đang hoạt động',
              value: 'APPROVED',
              href: '/admin/news/active'
            }, {
              label: 'Bài viết bị từ chối',
              value: 'REJECTED',
              href: '/admin/news/reject'
            }]}
            screen={(pathname.indexOf('/news') !== -1) ? 'NEWS' : screen}
            collapse={collapse}
            openMenus={openMenus}
            handleToggleMenu={this.handleToggleMenu}
          />
          { userInfo.role === 'Admin'
          && (
            <>
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

              <div className={classes.heading}>
                Cài đặt
              </div>
              <div className={classes.divider} />

              <NavLink
                to="/admin/settings"
                className={classNames(classes.menuItem)}
                activeClassName={classes.active}
              >
                <div className={classes.iconWrapper}>
                  <img
                    src={settingsIcon}
                    alt="bao-cao.svg"
                    className={classes.reportIcon}
                  />
                </div>
                <span>
                  Cài đặt tham số
                </span>

              </NavLink>
            </>
          )}

        </div>
      </PerfectScrollbar>
      // </Menu>
    )
  }
}

import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import { Dropdown } from 'react-bootstrap'
import defaultAvatarIcon from 'images/defaultAvatar.svg'
import classNames from 'classnames'
import logoIcon from 'images/black-logo.svg'
import history from 'utils/history'
import classes from './Header.module.scss'
import MenuButton from './MenuButton'

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      roles: ''
    }
  }

  componentDidMount() {
    this.setState({
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      roles: localStorage.getItem('roles')
    })
  }

  handleLogout = () => {
    localStorage.clear()
    history.push('/auth/login')
  }

  handleToogleMenu = () => {
    const {
      showMenuClass,
      handleShowMenuMobile,
      handleHideMenu,
    } = this.props
    if (showMenuClass) {
      handleHideMenu()
    } else {
      handleShowMenuMobile()
    }
  }

  render() {
    const {
      handleToggleMenu,
      collapse,
      showMenuClass
    } = this.props

    const { userInfo, roles } = this.state
    return (
      <div className={classes.container}>
        <div className={classNames(classes.left, collapse && classes.leftCollapse)}>
          <div>
            <p className={classes.logo}>
              Y dược cổ truyền
            </p>
          </div>
          { handleToggleMenu
            && (
            <MenuButton
              handleToggleMenu={handleToggleMenu}
              active={collapse}
            />
            )}

        </div>
        <div className={classes.right}>
          <a className={classes.notification}>
            <FontAwesomeIcon icon={faBell} className={classes.bell} />
            <div className={classes.unreaded} />
          </a>

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
                  <img
                    className={classes.avatar}
                    src={defaultAvatarIcon}
                    alt="avatar"
                  />
                  <div className={classes.info}>
                    <p className={classes.name}>
                      { userInfo && userInfo.fullName }
                    </p>
                    <p className={classes.accountType}>
                      {roles}
                    </p>
                  </div>
                </div>
              ))}
            />

            <Dropdown.Menu>
              <Dropdown.Item>
                <span
                  className={classes.dropdownItem}
                  onClick={() => {
                    history.push('/admin/change-password')
                  }}
                >
                  Thay đổi mật khẩu
                </span>
              </Dropdown.Item>
              <Dropdown.Item>
                <span
                  className={classes.dropdownItem}
                  onClick={this.handleLogout}
                >
                  <FormattedMessage
                    id="Header.logout"
                    defaultMessage="Đăng xuất"
                  />
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </div>
        <div className={classes.headerMenu}>
          <MenuButton
            handleToggleMenu={this.handleToogleMenu}
            active={showMenuClass}
          />

          <img src={logoIcon} className={classes.logoIcon} alt="logo" />

          <a
            className={classes.logout}
            onClick={this.handleLogout}
          >
            <FormattedMessage
              id="Header.logout"
              defaultMessage="Đăng xuất"
            />
          </a>
        </div>
      </div>
    )
  }
}

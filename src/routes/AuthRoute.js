import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isLoggedIn, } from 'utils/utils'

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (isLoggedIn()) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const url = userInfo.role === 'Admin' ? '/admin/users' : '/admin/news/waiting-approve'
        return <Redirect to={url} />
      }
      return <Component {...rest} {...props} />
    }}
  />
)

export default AuthRoute

import React from 'react'
import { Switch,
  useRouteMatch,
} from 'react-router-dom'
import AuthRoute from 'routes/AuthRoute'
import ChangePassword from '../../pages/ChangePassword'
import ForgotPassword from '../../pages/ForgotPassword'
import Login from '../../pages/Login'
import classes from './AuthLayout.module.scss'

const AuthLayout = (props) => {
  console.log(props)
  const { path } = useRouteMatch()

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <div />
        <div className={classes.background} />
        <div className={classes.bottom}>
          <p className={classes.title}>
            Y dược cổ truyền Việt Nam
          </p>
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.wrapper}>
          <div className={classes.screen}>
            <Switch>
              <AuthRoute path={`${path}/login`} component={Login} />
              <AuthRoute path={`${path}/forgot-password`} component={ForgotPassword} />
              <AuthRoute path={`${path}/change-password/:token`} component={ChangePassword} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout

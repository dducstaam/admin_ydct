import React, { useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
// import * as Api from 'api/api'
import { injectSaga } from 'utils/injectSaga'
import NotFound from 'pages/NotFound'
import AdminPrivateRoute from 'routes/AdminPrivateRoute'
import {
  makeSelectConfirm,
  makeSelectNotification,
  makeSelectShowConfirm
} from './selectors'
import {
  handleHideConfirm,
  hideNotification,
} from './actions'
import classes from './CommonLayout.module.scss'
import Notification from '../../components/Notification'
import Confirm from '../../components/Confirm'

import AuthLayout from '../AuthLayout'
import AdminLayout from '../AdminLayout'
import saga from './saga'

const CommonLayout = ({
  notification,
  showConfirm,
  handleHideConfirm,
  confirm,
  hideNotification,
}) => {
  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        hideNotification()
      }, 8000)
    }

    const handleClickOutside = () => {
      if (notification) {
        hideNotification()
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [notification])

  return (
    <div className={classes.container}>
      {
        notification
        && (
        <Fade
          top
          duration={500}
        >
          <div className={classes.notification}>
            <Notification notification={notification} />
          </div>
        </Fade>
        )
      }
      <Switch>
        <Route path="/auth" component={AuthLayout} />
        <AdminPrivateRoute path="/admin" component={AdminLayout} />
        <Redirect to="/auth/login" />
        <Route component={NotFound} />
      </Switch>
      <Modal
        show={showConfirm}
        onHide={handleHideConfirm}
        centered
      >
        <Confirm
          handleClose={handleHideConfirm}
          confirmData={confirm}
        />
      </Modal>
    </div>
  )
}

const withSaga = injectSaga({ key: 'global', saga });

const ComposeCommonLayout = compose(withSaga)(CommonLayout)

const mapStateToProps = createStructuredSelector({
  showConfirm: makeSelectShowConfirm(),
  notification: makeSelectNotification(),
  confirm: makeSelectConfirm()
})

function mapDispatchToProps(dispatch) {
  return {
    handleHideConfirm: () => dispatch(handleHideConfirm()),
    hideNotification: () => dispatch(hideNotification()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposeCommonLayout)

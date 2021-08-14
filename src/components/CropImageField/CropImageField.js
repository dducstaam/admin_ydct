import React, { Component } from 'react'

import Loading from 'react-loading-bar'
import classNames from 'classnames'
import AvatarImageCropper from 'react-avatar-image-cropper'
import closeIcon from 'images/close.svg'
import checkIcon from 'images//check-white.png'
import { FileURL } from 'utils/config'
import { renderField } from '../../Form'
import * as Api from '../../api/api'
import classes from './CropImageField.module.scss'

export class CropImageField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  apply = async (file) => {
    const { input } = this.props
    console.log(file, file.name)
    const formData = new FormData()
    formData.append('upload', file, file.name)
    try {
      this.setState({
        loading: true
      })
      const result = await Api.post({
        url: '/api/Util/uploadImage',
        data: formData,
      })
      console.log('result', result)
      input.onChange(result)
      this.setState({
        loading: false
      })
    } catch (e) {
      input.onChange(null)
      this.setState({
        loading: false
      })
    }

    // const newValue = value || []
  }

  render() {
    const { width,
      height,
      input,
    } = this.props
    const { loading } = this.state
    const actions = [
      <button
        key={0}
        type="button"
        className={classes.btnRemove}
      >
        {' '}
        <img src={closeIcon} alt="close" className={classes.closeIcon} />
        {' '}

      </button>,
      <button
        key={1}
        type="button"
        className={classes.btnAccept}
      >
        {' '}
        <img src={checkIcon} alt="close" className={classes.checkIcon} />
        {' '}

      </button>,
    ]
    const maxsize = 1024 * 1024 * 3
    return (
      <div className={classes.container}>
        <div
          style={{ width,
            height,
            backgroundImage: `url('${`${FileURL}/${input.value?.url}`}')`
          }}
          className={classNames(classes.wrapper, 'cropImage')}
        >
          <AvatarImageCropper
            apply={this.apply}
            isBack
            actions={actions}
            maxsize={maxsize}
            className={classes.avatarWrapper}
            text="Thêm ảnh"
          />
          <Loading
            show={loading}
            color="#005581"
          />
        </div>
      </div>
    )
  }
}

export default renderField(CropImageField)

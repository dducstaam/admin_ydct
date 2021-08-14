import React, { Component } from 'react'
import classNames from 'classnames'
import Loading from 'react-loading-bar'
import { renderField } from '../../Form';
import classes from './PhotosWithoutCropField.module.scss'
import * as Api from '../../api/api'

class PhotosWithoutCropField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: {}
    }
  }

  handleChange = async (e) => {
    const { input } = this.props
    const file = e.target.files[0]
    if (!file) {
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      return
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.fileInput.value = ''
      const id = this.uuidv4()
      input.onChange(reader.result)
      this.apply(file, id)
    };
  }

  apply = async (file, id) => {
    const { input } = this.props
    const formData = new FormData()
    formData.append('upload', file)
    try {
      this.setState({
        loading: true
      })
      const result = await Api.post({
        url: '/api/Util/uploadImage',
        data: formData,
      })
      // console.log('response upload image', result.data.url)

      input.onChange(result.url)
      this.setState({
        loading: false
      })
    } catch (e) {
      const newValue = input.value.filter((image) => image.id !== id)
      input.onChange(newValue)
      this.setState({
        loading: false
      })
    }

    // const newValue = value || []
  }

  handleAddFile = () => {
    this.fileInput.click()
  }

  handleDelete = (id) => () => {
    const { input } = this.props
    const newValue = input.value.filter((image) => image.id !== id)
    input.onChange(newValue)
  }

  uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (
      c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  }

  render() {
    const { input } = this.props
    const { loading } = this.state
    const { value } = input
    return (
      <div className={classes.container}>
        <div
          className={classNames(classes.imageWrapper, 'photos')}
          style={{ backgroundImage: `url("${value}")` }}
          onClick={this.handleAddFile}
        >
          {/* <img src={image.url} className={classes.image} /> */}
          <Loading
            show={loading}
            color="#005581"
          />
        </div>
        <input
          type="file"
          className={classes.file}
          ref={(fileInput) => this.fileInput = fileInput}
          onChange={this.handleChange}
          accept="image/x-png,image/jpg,image/jpeg"
        />
      </div>
    )
  }
}

export default renderField(PhotosWithoutCropField)

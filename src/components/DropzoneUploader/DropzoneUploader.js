import React, { Component } from 'react'
import { getDroppedOrSelectedFiles } from 'html5-file-selector'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import Dropzone from 'react-dropzone-uploader'
import * as Api from 'api/api'
import { FileURL } from 'utils/config'
import { renderField } from '../../Form'
// import { ServiceUploadUrl } from '../../commons/Config'
import classes from './DropzoneUploader.module.scss'

export class DropzoneUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: {}
    }
  }

  getFilesFromEvent = (e) => new Promise((resolve) => {
    getDroppedOrSelectedFiles(e).then((chosenFiles) => {
      resolve(chosenFiles.map((f) => f.fileObject))
    })
  })

  getUploadParams = async ({ file }) => {
    const formData = new FormData()
    formData.append('files', file)
    this.setState({ uploading: true })
    const size = file.size
    const id = this.uuidv4()
    try {
      const { changeValue } = this.props
      changeValue([...this.props.value, { id, url: file.name, status: 'UPLOADING' }])
      const result = await Api.post({
        url: '/public/upload-compress',
        data: formData,
        options: {
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.loaded / size
            // console.log('progress ====>', progress)
            this.setState((prevState) => ({
              ...prevState,
              loading: {
                ...prevState.loading,
                [id]: progress
              }
            }))
          }
        }
      })
      const newValue = this.props.value.map((item) => {
        if (item.id === id) {
          return {
            url: result.data.url,
            status: 'DONE'
          }
        }
        return item
      })
      changeValue(newValue)
    } catch (e) {
      const newValue = this.props.value.filter((item) => item.id !== id)
      this.props.changeValue(newValue)
    }
    return {
      // url: `${ServiceUploadUrl}/public/upload-compress`,
    }
  }

  Input = ({ accept, onFiles, files, getFilesFromEvent }) => {
    const text = files.length > 0 ? 'Thêm tài liệu' : 'Chọn tài liệu'
    const { value } = this.props
    const { loading } = this.state
    return (
      <div className={classes.inputComponent}>
        <div className={classes.files}>
          {value && value.map((file, i) => (
            <div key={i} className={classes.fileWrapper}>
              <div className={classes.file}>
                <a
                  href={`${FileURL}${file.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.fileName}
                >
                  {file.url}
                </a>
                <a
                  className={classes.btnClose}
                  onClick={this.handleRemoveDocument(i)}
                >
                  <FontAwesomeIcon icon={faTimes} className={classes.times} />
                </a>
              </div>
              { loading[file.id] && loading[file.id] !== 1
                && (
                <div className={classes.row}>
                  <div className={classes.progressWrapper}>
                    <div className={classes.progress} style={{ width: `${loading[file.id] * 100}%` }} />
                  </div>
                  <p className={classes.percent}>
                    {`${Math.round(loading[file.id] * 100)}%`}
                  </p>
                </div>
                )}

            </div>
          ))}
        </div>
        <p className={classes.text}>
          Kéo thả tài liệu vào đây
        </p>
        <p className={classes.or}>
          Hoặc
        </p>
        <div className={classes.actions}>
          <label className="btn btnBlue btnSmall">
            {text}
            <input
              style={{ display: 'none' }}
              type="file"
              accept={accept}
              multiple
              ref={(inputRef) => this.inputRef = inputRef}
              onChange={(e) => {
                getFilesFromEvent(e).then((chosenFiles) => {
                  onFiles(chosenFiles)
                  this.inputRef.value = null
                })
              }}
            />
          </label>
        </div>
      </div>

    )
  }

  handleRemoveDocument = (pos) => () => {
    const { value, changeValue } = this.props
    const newValue = value.filter((item, i) => i !== pos)
    changeValue(newValue)
  }

  uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (
      c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  }

  render() {
    const { maxFiles = 100, hasError } = this.props
    return (
      <div className={classNames(classes.container, hasError && 'errorWrapper')}>
        <Dropzone
          inputContent="Kéo thả tài liệu vào đây"
          InputComponent={this.Input}
          getUploadParams={this.getUploadParams}
          multiple
          getFilesFromEvent={this.getFilesFromEvent}
          PreviewComponent={null}
          maxFiles={maxFiles || 10}
          accept=".pdf,.doc,.docx,.xlsx,.xls,image/*"
        // onChangeStatus={this.handleChangeStatus}
        />
      </div>
    )
  }
}

export default renderField(DropzoneUploader)

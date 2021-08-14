import React from 'react'
import { formatStringToNumber } from 'utils/utils'
import starIcon from 'images/star.svg'
// import classNames from 'classnames'
// import { faPlus } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormattedMessage } from 'react-intl'
import verifyed from 'images/verifyed.svg'
import history from 'utils/history'
import { FileURL } from 'utils/config'
import classes from './ProductItem.module.scss'

const ProductItem = ({ item }) => {
  const gotoDetail = () => {
    history.push(`/product-detail/${item._id}`)
  }
  const price = (item.minPrice && item.minPrice > 0) ? item.minPrice : item.product.price
  return (
    <div
      className={classes.container}
      onClick={gotoDetail}
    >
      <div className={classes.imageWrapper}>
        { item.product.accessoryPic && item.product.accessoryPic.content[0]
          && <img src={`${FileURL}${item.product.accessoryPic.content[0].url}`} alt="img" className={classes.image} />}

        {/* <div className={classes.actions}>
          { item.genuine
            ? <>
              <a className={classNames(classes.btn)}>
                <FontAwesomeIcon icon={faPlus} className={classes.plusIcon} />
                <FormattedMessage id='ProductItem.addToBasket'
                  defaultMessage='Thêm vào giỏ hàng'
                />
              </a>
              <a className={classNames(classes.btn)}>
                <FormattedMessage id='ProductItem.buyNow'
                  defaultMessage='Mua ngay'
                />
              </a>
            </>
            : <>
              <a className={classNames(classes.btn)}>
                <FormattedMessage id='ProductItem.viewDetail'
                  defaultMessage='Xem chi tiết'
                />
              </a>
              <a className={classNames(classes.btn)}>
                <FormattedMessage id='ProductItem.gotoSalon'
                  defaultMessage='Đến cửa hàng'
                />
              </a>
            </>
          }

        </div> */}
      </div>
      <div className={classes.content}>
        <div className={classes.top}>
          <p className={classes.productName}>
            { item.product.subModel }
          </p>
          <div className={classes.row}>
            <img src={starIcon} className={classes.starIcon} alt="star" />
            <p className={classes.rating}>
              { item.report?.rateAverage || 0 }
            </p>
            <p className={classes.numberReviews}>
              <FormattedMessage
                id="ProductItem.numberReviews"
                defaultMessage="({numberReviews} đánh giá)"
                values={{
                  numberReviews: item.report?.totalComment || 0
                }}
              />
            </p>
          </div>
          <p className={classes.text}>
            <FormattedMessage
              id="ProductItem.origin"
              defaultMessage="Xuất xứ: {origin}"
              values={{
                origin: item.product.fromType
              }}
            />
          </p>
          { item.product.make
          && (
          <p className={classes.text}>
            <FormattedMessage
              id="ProductItem.origin"
              defaultMessage="Hãng xe: {brand}"
              values={{
                brand: item.product.make.makeName
              }}
            />
          </p>
          )}
          { item.product.model
          && (
          <p className={classes.text}>
            <FormattedMessage
              id="ProductItem.origin"
              defaultMessage="Model xe: {model}"
              values={{
                model: item.product.model.modelName
              }}
            />
          </p>
          )}
        </div>
        <div className={classes.rowBetween}>
          { item.genuine
            ? (
              <>
                <div className={classes.left}>
                  <p className={classes.currentPrice}>
                    { formatStringToNumber(price
                      - (+item.product.discount * (item.product.discountType === 'PERCENT' ? (price / 100) : 1))) }
                    đ
                  </p>
                  { !!item.product.discount
                  && (
                  <p className={classes.oldPrice}>
                    { formatStringToNumber(price) }
                    đ
                  </p>
                  )}

                </div>
                <div className={classes.genuine}>
                  <img src={verifyed} className={classes.verifyed} alt="icon" />
                  <FormattedMessage
                    id="ProductItem.genuine"
                    defaultMessage="Chính hãng"
                  />
                </div>
              </>
            )
            : (
              <>
                <a className={classes.btnViewDetail}>
                  <FormattedMessage
                    id="ProductItem.viewDetail"
                    defaultMessage="Xem chi tiết"
                  />
                </a>
                <p className={classes.address}>
                  { item.address }
                </p>
              </>
            )}

        </div>
      </div>
    </div>
  )
}

export default ProductItem

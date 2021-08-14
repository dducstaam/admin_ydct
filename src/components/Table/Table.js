import React from 'react'
import TableAction from 'components/TableAction'
import DoubleScrollbar from 'react-double-scrollbar'
import classNames from 'classnames'
import Sort from 'components/Sort'

const Table = ({ tableOptions, data, filter, handleSearch }) => (
  <div className={classNames('table-responsive table')}>
    <DoubleScrollbar>
      <table className="table table-borderless">
        <thead>
          <tr className="tbHead">
            { tableOptions.map((option) => (
              <th
                key={option.name}
                onClick={() => {
                  if (option.allowSort) {
                    handleSearch({
                      sort: option.name,
                      sortType: (filter?.sortType === 'ASC' && option.name === filter.sort) ? 'DESC' : 'ASC'
                    })
                  }
                }}
              >
                { option.label }
                { option.allowSort
                  && (
                  <Sort
                    active={filter?.sort === option.name}
                    sortType={filter?.sortType}
                  />
                  )}

              </th>
            )) }
          </tr>
        </thead>
        <tbody>
          {data && data.map((item, i) => (
            <tr
              className="tbRow"
              key={item.id || i}
            >
              { tableOptions.map((option) => (
                <td key={option.name}>
                  {option.type === 'ACTION'
                    ? (
                      <TableAction
                        handleApprove={option.handleApprove}
                        handleReject={option.handleReject}
                        handleEdit={option.handleEdit}
                        handleViewDetail={option.handleViewDetail}
                        handleRemove={option.handleRemove}
                        status={option.status === item.status}
                        handleChangeStatus={option.handleChangeStatus}
                        handleCopy={option.handleCopy}
                        direction={option.direction}
                        size={option.size}
                        item={item}
                      />
                    )
                    : (
                      <>
                        { option.renderCol
                          ? option.renderCol(item)
                          : item[option.name]}
                      </>
                    )}

                </td>
              )) }

            </tr>
          ))}
        </tbody>
      </table>
    </DoubleScrollbar>
  </div>
)

export default Table

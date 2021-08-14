import React from 'react'
import Filter from 'components/Filter'
import Table from 'components/Table'
import GooglePaging from 'components/GooglePaging'
import classes from './AdminPage.module.scss'

const AdminPage = ({
  filter,
  handleSearch,
  data,
  filterOptions,
  tableOptions,
  handleAddNew
}) => (
  <div className="group">
    <div className="groupBody">
      <div className={classes.filter}>
        <Filter
          filter={filter}
          handleSearch={handleSearch}
          options={filterOptions}
        />
      </div>

      <div className={classes.head}>
        <p className={classes.title}>
          Tổng:
          {' '}
          { data?.rowCount }
        </p>

        { handleAddNew
          && (
          <a
            className="btn btnMain btnSmall"
            onClick={handleAddNew}
          >
            Thêm mới
          </a>
          )}
      </div>

      <div className={classes.table}>
        <Table
          data={data?.results}
          tableOptions={tableOptions}
          filter={filter}
          handleSearch={handleSearch}
        />
      </div>

      <div className={classes.pagings}>
        <GooglePaging
          pageInfo={{
            page: data?.currentPage,
            totalPages: data?.pageCount
          }}
          changePage={({ page }) => handleSearch({ page })}
        />
      </div>
    </div>
  </div>

)

export default AdminPage

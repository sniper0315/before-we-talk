// ** React Imports
import '@styles/react/libs/tables/react-dataTable-component.scss'
import axios from "axios"
import { Fragment, useEffect, useState } from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard"
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { handleClearTempStep } from '@store/authentication'
import {
  Button,
  Card
} from "reactstrap"
import { Helmet } from 'react-helmet'

// ** Third Party Components

// ** Demo Components
// import Tabs from './Tabs'
import DataTable from 'react-data-table-component'
import { ChevronDown, Eye } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { APP_NAME } from '../../app-config'

// ** Styles
// import '@styles/react/libs/flatpickr/flatpickr.scss'
// import '@styles/react/pages/page-account-settings.scss'
const SavedFlows = () => {

  const [currentPage, setCurrentPage] = useState(0)
  const [copied, setCopied] = useState(false)
  const [flows, setFlows] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(handleClearTempStep())
    axios.get(`flows`)
      .then(res => {
        console.log("||||||||", res)
        setFlows(res.data.flows)

      })
      .catch(error => {
        console.log('error:', error)
      })
  }, [])

  const handleEdit = (flowId) => {
    navigate(`/flows/${flowId}`)
  }

  const handleCreateNewFlow = () => {
    navigate("/flows")
  }

  const onCopy = () => {
    setCopied(true)
    console.log('copy', copied)
    toast.success("Copied To Clipboard !")
  }

  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const flowColumns = [

    {
      name: 'DESCRIPTION',
      reorder: true,
      sortable: true,
      minWidth: '225px',
      selector: flow => flow.name
    },
    {
      name: 'NUMBER OF VIEWS',
      reorder: true,
      sortable: true,
      minWidth: '310px',
      selector: flow => flow.views,
      cell: flow => {
        return (
          <div className='d-flex'>
            <Eye size={15} className='me-1' /> {flow.views} views
          </div>
        )
      }
    },
    {
      name: 'Actions',
      allowOverflow: true,
      selector: flow => flow.views,
      cell: flow => {
        return (
          <div className='d-flex'>
            <Button.Ripple color='primary' className='me-2' outline onClick={() => handleEdit(flow._id)}>
              Edit
            </Button.Ripple>
            <CopyToClipboard
              onCopy={onCopy}
              text={flow.link}
            >
              <Button.Ripple color='primary'>Copy URL</Button.Ripple>
            </CopyToClipboard>
          </div>
        )
      }
    }
  ]

  const CustomPagination = () => (
    <ReactPaginate
      nextLabel=''
      breakLabel='...'
      previousLabel=''
      pageRangeDisplayed={2}
      forcePage={currentPage}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      pageCount={Math.ceil(flows.length / 7) || 1}
      onPageChange={page => handlePagination(page)}
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
    />
  )

  return (
    <Fragment>

      <Helmet>
        <meta charSet="utf-8" />
        <title> Saved Flows | {APP_NAME}</title>
        <meta name="description" content="Manage your saved flow on Before We Talk."/>
        <meta NAME="robots" CONTENT="noindex"/>
      </Helmet>
      
      <h1 className='display-3 mb-2'>Saved conversation flows</h1>
      <Card className='overflow-hidden'>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            data={flows}
            columns={flowColumns}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
          />
        </div>
      </Card>
      <div className='text-center'>
        <Button.Ripple color='primary' onClick={() => handleCreateNewFlow()}>Create another flow</Button.Ripple>
      </div>
    </Fragment>
  )
}

export default SavedFlows

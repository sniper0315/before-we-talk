// ** Reactstrap Imports
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

const ModalFailed = props => {
  // ** Props
  const { failedModal, setFailedModal } = props

  return (
    <Modal isOpen={failedModal} toggle={() => setFailedModal(!failedModal)} className='modal-dialog-centered signup-modal'>
      <ModalHeader toggle={() => setFailedModal(!failedModal)}>
      </ModalHeader>
      <ModalBody>
        <div className='px-3 mb-3 text-center font-size-32-20 no-padding'>
          <h1>Link has expired or is invalid. Please try again.</h1>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalFailed
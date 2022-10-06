// ** React Imports
import { useEffect, useState } from 'react'

// ** Reactstrap Imports
import { Modal, ModalHeader, ModalBody, Button, Label, InputGroup, Input, InputGroupText } from 'reactstrap'

// ** Third Party Components
import { User } from 'react-feather'

// ** Store & Actions
import { useSelector } from 'react-redux'

// ** SVG Icons
const successIcon =
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M49.99 0.0250244C77.575 0.0250244 99.975 22.425 99.975 50.01C99.975 77.6 77.575 100 49.99 100C22.4 100 0 77.6 0 50.01C0 22.425 22.4 0.0250244 49.99 0.0250244ZM24.745 51.955L44 69.105C44.71 69.745 45.605 70.055 46.495 70.055C47.505 70.055 48.52 69.65 49.255 68.845L79.02 36.3C79.675 35.585 80 34.685 80 33.79C80 31.74 78.345 30.055 76.26 30.055C75.24 30.055 74.235 30.465 73.49 31.27L46.225 61.08L29.735 46.39C29.015 45.755 28.13 45.44 27.24 45.44C25.165 45.44 23.5 47.115 23.5 49.17C23.5 50.195 23.92 51.215 24.745 51.955Z" fill="#7367F0"/>
  </svg>

const successIconSmall =
<svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M49.99 0.0250244C77.575 0.0250244 99.975 22.425 99.975 50.01C99.975 77.6 77.575 100 49.99 100C22.4 100 0 77.6 0 50.01C0 22.425 22.4 0.0250244 49.99 0.0250244ZM24.745 51.955L44 69.105C44.71 69.745 45.605 70.055 46.495 70.055C47.505 70.055 48.52 69.65 49.255 68.845L79.02 36.3C79.675 35.585 80 34.685 80 33.79C80 31.74 78.345 30.055 76.26 30.055C75.24 30.055 74.235 30.465 73.49 31.27L46.225 61.08L29.735 46.39C29.015 45.755 28.13 45.44 27.24 45.44C25.165 45.44 23.5 47.115 23.5 49.17C23.5 50.195 23.92 51.215 24.745 51.955Z" fill="#7367F0"/>
</svg>

const ModalSuccess = props => {
  // ** Store Variables
  const authName = useSelector(state => state?.auth?.userData?.name)
  
  // ** Props
  const { successModal, setSuccessModal, handleSaveName } = props

  // ** States
  const [name, setName] = useState('')

  useEffect(() => setName(authName ? authName : ''), [authName])

  return (
    <Modal isOpen={successModal} toggle={() => setSuccessModal(!successModal)} className='modal-dialog-centered checkEmail-modal'>
      <ModalHeader toggle={() => setSuccessModal(!successModal)}>
      </ModalHeader>
      <ModalBody>
        <div className='text-center'>
          <div className='d-none d-mobile-small-block'>
            {successIconSmall}
          </div>
          <div className='d-block d-mobile-small-none'>
            {successIcon}
          </div>
          <h1 className='mt-3 mb-2 font-size-32-20'>You're in!</h1>
          <p className='mb-2 font-medium-1 font-size-16-14'>What's your name?</p>
        </div>
        <div className='px-3 mb-2 no-padding'>
          <Label className='form-label text-left font-size-16-14' for='name'>
            Name
          </Label>
          <InputGroup id='name' className='input-group-merge mb-1 font-size-16-14'>
            <Input type='text' placeholder='Enter your name' value={name} onChange={e => setName(e.target.value)} />
            <InputGroupText>
              <User size={16} />
            </InputGroupText>
          </InputGroup>
        </div>
        <div className='mb-3 text-center'>
          <Button className="primary-btn font-size-16-14" color='primary' onClick={() => handleSaveName(name)}>
            Save
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalSuccess
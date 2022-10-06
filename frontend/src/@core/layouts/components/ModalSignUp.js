// ** React Imports
import { useEffect, useState } from 'react'

// ** Reactstrap Imports
import { Modal, ModalHeader, ModalBody, FormText, Button, Label, InputGroup, Input, InputGroupText } from 'reactstrap'

// ** Third Party Components
import { Mail } from 'react-feather'

const ModalSignUp = props => {
  // ** Props
  const { signupModal, setSignupModal, handleSendMagicLink } = props

  // ** States
  const [email, setEmail] = useState('')
  const [invalid, setInvalid] = useState(false)

  const validateEmail = value => {    
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) return true
    else return false
  }

  const handleContinue = () => {
    if (email === '' || !validateEmail(email)) {
      console.log('invalid')
      setInvalid(true)
    } else {
      console.log('valid')
      setInvalid(false)
      handleSendMagicLink(email)
    }
  }

  useEffect(() => {
    if (email) setInvalid(false)
  }, [email])

  return (
    <Modal isOpen={signupModal} toggle={() => setSignupModal(!signupModal)} className='modal-dialog-centered signup-modal'>
      <ModalHeader toggle={() => setSignupModal(!signupModal)}>
      </ModalHeader>
      <ModalBody>
        <h1 className='mb-2 text-center login-modal-header-font-size-32-24 px-2'>Enter email to register or login</h1>
        <div className='px-4 no-padding'>
          <div className='mb-2 text-center'>
            <p className='font-medium-1 font-size-18-16'>Enter your email to use Before We Talk</p>
          </div>
          <div className='mb-2 px-5 no-padding'>
            <Label className='form-label font-size-16-14' for='email'>
              Email
            </Label>
            <InputGroup id='email' className='input-group-merge font-size-16-14'>
              <Input type='email' placeholder='Enter your email address' value={email} onChange={e => setEmail(e.target.value)} />
              <InputGroupText>
                <Mail size={16} />
              </InputGroupText>
            </InputGroup>
            {invalid && <small className='text-danger'>{'Email is empty or invalid'}</small>}
          </div>
          <div className='mb-2 px-5 no-padding'>
            <span className='font-small-3 fw-bold font-size-14-12'>By registering I agree with the Terms</span>
          </div>
          <div className='mb-3 text-center'>
            <Button className="primary-btn font-size-16-14" color='primary' onClick={() => handleContinue(email)}>
              Continue
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalSignUp
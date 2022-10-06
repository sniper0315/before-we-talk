// ** React Imports
// import { useState } from 'react'

// ** Reactstrap Imports
import { Modal, ModalHeader, ModalBody, Button, Label, InputGroup, Input, InputGroupText } from 'reactstrap'

// ** SVG Icons
const iconEmail = 
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M60 0.0999756C26.865 0.0999756 0 26.965 0 60.1C0 93.235 26.865 120.1 60 120.1C93.135 120.1 120 93.235 120 60.1C120 26.965 93.135 0.0999756 60 0.0999756ZM94.95 35L60 63.33L25.045 35H94.95ZM95 85H25V42.475L60 70.84L95 42.48V85Z" fill="#7367F0"/>
  </svg>

const iconEmailSmall = 
<svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M60 0.0999756C26.865 0.0999756 0 26.965 0 60.1C0 93.235 26.865 120.1 60 120.1C93.135 120.1 120 93.235 120 60.1C120 26.965 93.135 0.0999756 60 0.0999756ZM94.95 35L60 63.33L25.045 35H94.95ZM95 85H25V42.475L60 70.84L95 42.48V85Z" fill="#7367F0"/>
  </svg>

const gmailIcon = 
<svg width="30" height="22" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.3" d="M28.5 0.00109863H1.50195L2.50195 21.9995H27.5L28.5 0.00109863Z" fill="#7367F0"/>
<path opacity="0.3" d="M28.5 0.00109863H1.50195L13.9383 9.38793H16.2508L28.5 0.00109863Z" fill="#7367F0"/>
<path opacity="0.1" d="M3.75 22L15 11.7586L26.25 22H3.75Z" fill="#7367F0"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.75169 1.89773C3.75169 0.850908 2.91325 0.00131226 1.87682 0.00131226C0.841894 0.00131226 0.00195312 0.850908 0.00195312 1.89773C0.00195312 5.93634 0.00195312 15.3714 0.00195312 19.7241C0.00195312 20.9818 1.00988 21.9998 2.2518 21.9998C3.04974 21.9998 3.75169 21.9998 3.75169 21.9998C3.75169 21.9998 3.75169 7.23653 3.75169 1.89773Z" fill="#7367F0"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M26.25 1.89752C26.25 0.850694 27.0899 0.00109863 28.1249 0.00109863C28.1264 0.00109863 28.1279 0.00109863 28.1279 0.00109863C29.1628 0.00109863 29.9997 0.849177 29.9997 1.89448C29.9997 5.93158 29.9997 15.3697 29.9997 19.7238C29.9997 20.9816 28.9933 21.9995 27.7499 21.9995C26.9535 21.9995 26.25 21.9995 26.25 21.9995C26.25 21.9995 26.25 7.23631 26.25 1.89752Z" fill="#7367F0"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.93699 3.53903C0.50652 3.28718 0.193042 2.87452 0.0640515 2.38904C-0.0649394 1.90355 0.00255583 1.38773 0.251538 0.952311C0.251538 0.952311 0.253038 0.950794 0.253038 0.949277C0.502021 0.51386 0.911492 0.196779 1.39146 0.0663054C1.87142 -0.0641681 2.38289 0.00410296 2.81336 0.255947L15 7.37282L27.1896 0.254429C27.6201 0.00258521 28.1301 -0.0656859 28.61 0.0647877C29.09 0.195261 29.498 0.512343 29.747 0.94776L29.7485 0.949277C29.9974 1.38469 30.0649 1.90355 29.9359 2.38904C29.807 2.87452 29.492 3.2887 29.0615 3.54054L18.7497 9.56205L15 11.7528L11.2503 9.56205L0.93699 3.53903Z" fill="#7367F0"/>
</svg>

const outlookIcon =
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.7754 6.36061V12.2288L20.8487 13.52C20.9034 13.5358 21.0219 13.5369 21.0766 13.52L29.9999 7.56963C29.9999 6.8654 29.3357 6.36061 28.9609 6.36061H18.7754Z" fill="#7367F0"/>
<path d="M18.7746 14.4179L20.6668 15.7035C20.9333 15.8973 21.2546 15.7035 21.2546 15.7035C20.9345 15.8973 30.0002 9.94128 30.0002 9.94128V20.7266C30.0002 21.9007 29.2403 22.3931 28.386 22.3931H18.7734V14.4179H18.7746Z" fill="#7367F0"/>
<path d="M8.97665 11.7127C8.33187 11.7127 7.81809 12.0125 7.43874 12.6108C7.05939 13.2091 6.86914 14.0012 6.86914 14.9871C6.86914 15.9877 7.05939 16.7787 7.43874 17.3601C7.81809 17.9426 8.31592 18.2322 8.93108 18.2322C9.56561 18.2322 10.0691 17.9494 10.4405 17.3837C10.8119 16.8181 10.9987 16.0327 10.9987 15.0288C10.9987 13.982 10.8187 13.1674 10.4576 12.5849C10.0965 12.0034 9.60321 11.7127 8.97665 11.7127Z" fill="#7367F0"/>
<path d="M0 3.38028V26.338L17.6575 30V0L0 3.38028ZM11.8157 18.7403C11.0695 19.7115 10.0967 20.1983 8.89596 20.1983C7.72601 20.1983 6.77364 19.7273 6.03659 18.7865C5.30067 17.8445 4.93157 16.6186 4.93157 15.1065C4.93157 13.5099 5.30522 12.2186 6.05367 11.2327C6.80212 10.2468 7.79322 9.75324 9.02697 9.75324C10.1924 9.75324 11.1356 10.2242 11.8544 11.1685C12.5744 12.1127 12.9344 13.3566 12.9344 14.9014C12.9355 16.489 12.5619 17.769 11.8157 18.7403Z" fill="#7367F0"/>
</svg>

// ** Constants
const gmailUrl = 'https://mail.google.com/'
const outlookUrl = 'https://outlook.live.com/'

const ModalCheckEmail = props => {
  // ** Props
  const { checkEmailModal, setCheckEmailModal, email } = props

  return (
    <Modal isOpen={checkEmailModal} toggle={() => setCheckEmailModal(!checkEmailModal)} className='modal-dialog-centered checkEmail-modal'>
      <ModalHeader toggle={() => setCheckEmailModal(!checkEmailModal)}>
      </ModalHeader>
      <ModalBody>
        <div className='px-3 text-center no-padding'>
          <div className='d-none d-mobile-small-block'>
            {iconEmailSmall}
          </div>
          <div className='d-block d-mobile-small-none'>
            {iconEmail}
          </div>
          <h1 className='mt-3 mb-2 font-size-32-20'>Check your email!</h1>
          <p className='mb-3 font-medium-1 font-size-18-13'>We emailed a magic link to {email}<br/> Click the link to log in or sign up</p>
          <div className='mb-2'>
            <a color='flat-dark' className="btn email-btn gmail-btn" href={gmailUrl} target='_blank'>
              {gmailIcon}
              <span className='align-middle ms-1 font-size-16-14'>Open Gmail</span>
            </a>
          </div>
          <div className='mb-3'>
            <a color='flat-dark' className="btn email-btn outlook-btn" href={outlookUrl} target='_blank'>
              {outlookIcon}
              <span className='align-middle ms-1 font-size-16-14'>Open Outlook</span>
            </a>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalCheckEmail
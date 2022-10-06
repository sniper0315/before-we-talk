// ** React Imports
import { useState } from 'react'
import axios from "axios"

import { useSelector, useDispatch } from 'react-redux'
import { handleUpdateUser } from '../../../redux/authentication'
// ** Reactstrap Imports
import { Col, Label, Input } from 'reactstrap'
import style from "./NameRequestModal.module.css"

const personIcon = require('@src/assets/images/icons/custom/person.svg').default
const NameRequestModal = ({ setCenteredModal }) => {
  
  const [nameContent, setNameContent] = useState("")
  const dispatch = useDispatch()
  const authStore = useSelector(state => state.auth)
  const handleSaveName = () => {
    if (authStore?.userData) {
      axios.post('/auth/user/update', { name: nameContent, email: authStore?.userData.email, meeting: authStore?.userData.meeting || '' })
        .then(res => {
          const data = { ...res.data.user }
          dispatch(handleUpdateUser(data))
          toast.success('Name is successfully updated')
          setCenteredModal(false)
        })
        .catch(err => console.log('error:', err))
    }
  }

  return (
    <div className={style.nameVerticallyCenteredModal}>
      <div class={style.nameModalContent}>
        <div class={style.nameModalHeader}>
          <h5 class="modal-title">
          </h5>
          <button type="button" class={`btn-close ${style.nameRequestModalCloseBtn}`} aria-label="Close" onClick={() => setCenteredModal(false)} />
        </div>
        <div class={`d-flex justify-content-center ${style.modalBody}`}>
          <h5 className={style.headerText}>Fill out the box below to continue communicating in this chat</h5>
          <Col sm="12">
            <Label className='form-label' for='content'>
              Your name
            </Label>
            <div style={{position: "relative"}}>
              <Input type='text' id='content' placeholder='Name' style={{ width: "100%" }} value={nameContent} onChange={e => setNameContent(e.target.value)} />
              <img src={personIcon} className={style.inputLeft} />
            </div>
          </Col>
        </div>
        <div class={style.modalFooter}>
          <button type="button" class={`btn btn-primary ${style.nameRequestModalSaveBtn}`} onClick={handleSaveName}>Save</button>
        </div>
      </div>
    </div>
  )
}
export default NameRequestModal

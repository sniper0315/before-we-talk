// ** React Imports
import { useNavigate } from 'react-router-dom'
import { Fragment, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { handleUpdateUser } from '../../redux/authentication'

// ** Third Party Components
import axios from 'axios'
import toast from 'react-hot-toast'

// ** Reactstrap Imports
import { Button, Row, Col, Label, Input } from 'reactstrap'

// ** Custom Components
import Avatar from '@components/avatar'
import { APP_NAME } from '../../app-config'

const AccountSettings = () => {
  // ** States
  const [email, setEmail] = useState('')
  const [meeting, setMeeting] = useState('')
  const [name, setName] = useState('')
  // const [avatar, setAvatar] = useState('')

  // ** Vars
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authStore = useSelector(state => state.auth)

  const saveUserData = () => {
    axios.post('/auth/user/update', { name, email, meeting })
      .then(res => {
        console.log(res)
        const data = { ...res.data.user }
        dispatch(handleUpdateUser(data))
        toast.success('Account settings are successfully updated')
      })
      .catch(err => console.log('error:', err))
  }

  useEffect(() => {
    if (authStore?.userData) {
      const userData = authStore?.userData
      setName(userData.name)
      setEmail(userData.email)
      setMeeting(userData.meeting || '')
      // setAvatar(userData.avatar || '')
    } else {
      navigate('/flows')
    }
  }, [authStore])

  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title> Settings | {APP_NAME}</title>
        <meta name="description" content="Your settings on Before We Talk."/>
        <meta NAME="robots" CONTENT="noindex"/>
      </Helmet>
      <h1 className='display-4 mb-4'>Account Settings</h1>
      <Row className='mb-3 d-flex align-items-center'>
        <Col sm='2'>
          <Avatar className='account-settings-avatar' color='light-primary' content={authStore?.userData?.name || authStore?.userData?.fullName} size='xl' initials />
        </Col>
        <Col sm='6'>
          <h4>{authStore?.userData?.name || authStore?.userData?.fullName}</h4>
        </Col>
      </Row>
      <Row className='mb-2'>
        <Label sm='2' size='lg' className='form-label' for='name'>
          Name
        </Label>
        <Col sm='6'>
          <Input type='text' id='name' placeholder='Name' value={name} onChange={e => setName(e.target.value)} />
        </Col>
      </Row>
      <Row className='mb-2'>
        <Label sm='2' size='lg' className='form-label' for='email'>
          Email
        </Label>
        <Col sm='6'>
          <Input type='email' id='email' placeholder='Email Address' value={email} onChange={e => setEmail(e.target.value)} />
        </Col>
      </Row>
      <Row className='mb-3'>
        <Label sm='2' size='lg' className='form-label' for='meeting'>
          Meeting URL
        </Label>
        <Col sm='6'>
          <Input type='text' id='meeting' placeholder='Meeting URL' value={meeting} onChange={e => setMeeting(e.target.value)} />
        </Col>
      </Row>
      <Row className='mb-2'>
        <Col sm='6'>
          <Button.Ripple color='primary' outline className='primary-btn'>
            Cancel
          </Button.Ripple>
          <Button.Ripple color='primary' className='primary-btn mx-3' onClick={() => saveUserData()}>
            Save
          </Button.Ripple>
        </Col>
      </Row>
    </Fragment>
  )
}

export default AccountSettings

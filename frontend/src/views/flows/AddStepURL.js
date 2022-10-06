// ** React Imports
import { selectThemeColors } from '@utils'
import axios from "axios"
import { Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
import { useSelector } from 'react-redux'

// ** Reactstrap Imports
import { Button, Col, Input, Label, Row } from 'reactstrap'

const AddStepURL = ({ stepType, handleAddStep }) => {
  // ** States
  const [content, setContent] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [links, setLinks] = useState([])
  const authStore = useSelector(state => state.auth)

  useEffect(() => {
    if (authStore.userData && authStore.userData.name) {
      axios.get(`steps/usedLinks/URL`)
        .then(res => {
          console.log("||||||||", res)
          const data = []
          res.data.step.map((item => {
            data.push({
              value: item.content,
              label: item.content
            })
          }))
          if (authStore.userData.meeting !== '') {
            data.push({
              value: authStore.userData.meeting,
              label: authStore.userData.meeting
            })
          }
          setLinks(data)
          setContent(data[0].value)
          console.log("#@", data)
        })
        .catch(error => {
          console.log('error:', error)
        })
    }
  }, [])

  const isValidUrl = urlString => {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$', 'i') // validate fragment locator
    return !!urlPattern.test(urlString)
  }

  const handleSave = input => {
    if (input === '' || !isValidUrl(input)) {
      setInvalid(true)
    } else {
      setInvalid(false)
      handleAddStep(stepType, input)
      setContent('')
    }
  }

  const OnChange = value => {
    console.log("VAULE", value)
    setContent(value.value)
  }

  return (
    <Fragment>
      <Row>
        <Col lg='6'>
          <div className='mb-2'>
            <Label className='form-label' for='content'>
              Add URL Link
            </Label>
            <Input type='text' id='content' placeholder='' value={content} onChange={e => setContent(e.target.value)} />
            {content === '' && invalid && <small className='text-danger'>{'Error - URL is empty or seems incorrect'}</small>}
          </div>
          <div className='text-left mb-2'>
            <Button.Ripple color='primary' className="primary-btn me-2" outline onClick={() => setContent('')}>
              Cancel
            </Button.Ripple>
            <Button.Ripple className="primary-btn" color='primary' onClick={() => handleSave(content)}>
              Save and Add
            </Button.Ripple>
          </div>
        </Col>
        <Col lg='6'>
          <div className=''>
            <Label className='form-label' for='content'>
              Copy from recently used
            </Label>
          </div>
          <div className='text-left'>
            <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue={links[0]}
              options={links}
              isClearable={false}
              onChange={OnChange}
            />
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}

export default AddStepURL

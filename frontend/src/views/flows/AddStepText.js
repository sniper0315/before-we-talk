// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import { Button, Col, Input, Row } from 'reactstrap'

const AddStepText = ({ stepType, handleAddStep }) => {
  // ** States
  const [content, setContent] = useState('')
  const [invalid, setInvalid] = useState(false)

  const handleSave = input => {
    if (input === '') {
      setInvalid(true)
    } else {
      setInvalid(false)
      handleAddStep(stepType, input)
      setContent('')
    }
  }

  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <Input type='textarea' name='content' id='audio-content' rows='5' placeholder='' value={content} onChange={e => setContent(e.target.value)} />
          {content === '' && invalid && <small className='text-danger'>{'Text is empty'}</small>}
          <div className='mt-2 text-center'>
            <Button.Ripple color='primary' className="primary-btn me-2" outline onClick={() => setContent('')}>
              Cancel
            </Button.Ripple>
            <Button.Ripple color='primary' className="primary-btn" onClick={() => handleSave(content)}>
              Save and Add
            </Button.Ripple>
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}

export default AddStepText

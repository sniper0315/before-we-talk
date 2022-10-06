// ** React Imports
import { Fragment } from 'react'
import AudioWavesurfer from '../components/audioWavesurfer'
import CustomVideoPlayer from '../components/customVideoPlayer'
import { ReactSortable } from 'react-sortablejs'

// ** Reactstrap Imports
import { Card, Button, CardBody, Row, Col } from 'reactstrap'

// ** Icons Imports
const audioIcon = require('@src/assets/images/icons/custom/audio.svg').default
const videoIcon = require('@src/assets/images/icons/custom/video.svg').default
const textIcon = require('@src/assets/images/icons/custom/text.svg').default
const urlIcon = require('@src/assets/images/icons/custom/url.svg').default
const fileIcon = require('@src/assets/images/icons/custom/file.svg').default
const xIcon = require('@src/assets/images/icons/custom/x.svg').default
const microsoftwordIcon = require('@src/assets/images/icons/custom/microsoft-word.svg').default

const StepsCard = ({ steps, handleRemoveStep, fileList, setSteps }) => {
  const getIconByStepType = (type) => {
    switch (type) {
      case 'Text':
        return textIcon
      case 'Video':
        return videoIcon
      case 'Audio':
        return audioIcon
      case 'URL':
        return urlIcon
      case 'File':
        return fileIcon
      default:
        return ''
    }
  }

  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  const getContentByStepType = (stepType, content, type, isRecent) => {
    switch (stepType) {
      case 'Text':
        return content
      case 'Video':
        const vdateTime = (new Date()).getTime()
        const aUrl = type ? `${process.env.REACT_APP_API_URL}/media_files_temp/${content}` : content
        return <CustomVideoPlayer videoUrl={ aUrl } videoSelector={ `videoplayer${vdateTime}` } />
      case 'Audio':
        const dateTime = (new Date()).getTime()
        const vUrl = type ? `${process.env.REACT_APP_API_URL}/media_files_temp/${content}` : content
        return <AudioWavesurfer audioUrl={ vUrl } audioSelector={ `waveform${dateTime}` } />
      case 'URL':
        return content
      case 'File':
        if (type || isRecent) {
          const extensionOfFile = content.split('.')
          const ext = extensionOfFile[extensionOfFile.length - 1]
          return <>
            {ext === 'docx' ? <><img src={microsoftwordIcon} width={150} /><br /><br /></> : ''}
            <span>{content}</span>
          </>
        } else {
          const extensionOfFile = fileList[content].name.split('.')
          const ext = extensionOfFile[extensionOfFile.length - 1]
          return <>
            {ext === 'docx' ? <><img src={microsoftwordIcon} width={150} /><br /><br /></> : ''}
            <span>{fileList[content].name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{renderFileSize(fileList[content].size)}</span>
          </>
        }
      default:
        return ''
    }
  }

  return (
    <Fragment>
      {steps.length > 0 ? (
        <Card>
          <CardBody className='no-padding'>
            <ReactSortable list={steps} setList={setSteps}>
            {steps.map((item, i) => (
              <div key={i} className='mx-1 my-1 py-1 px-1 step-card-item' style={{ border: '1px dashed #E8E7F7' }}>
                <div className='px-1 text-nowrap no-padding'>
                  <div>
                    <h4 className='font-size-14-18'>{`Step ${i + 1}`}</h4>
                  </div>
                </div>
                <div className='py-2 px-2' style={{ border: '1px solid #E8E7F7', width: '-webkit-fill-available' }}>
                  <div className='d-flex justify-content-between mb-2'>
                    <div className='d-flex align-items-center'>
                      <img className='step-card-item-icon' src={getIconByStepType(item.stepType)} />
                      <div className='mx-1'>
                        <h3 className='mb-0 font-size-20-18'>{item.stepType}</h3>
                      </div>
                    </div>
                    <Button.Ripple className='btn-icon rounded-circle custom-icon-btn' color='flat-secondary' size='sm' onClick={() => handleRemoveStep(i)}>
                      <img src={xIcon} />
                    </Button.Ripple>
                  </div>
                  <div>
                    <h6 style={{ lineHeight: 1.5 }}>{getContentByStepType(item.stepType, item.content, item.type, item.isRecent)}</h6>
                  </div>
                </div>
              </div>
            ))}
            </ReactSortable>
          </CardBody>
        </Card>
      ) : (
          <Col sm="12" style={{width: "100%"}}>
            <Card>
              <CardBody className='no-padding'>
                <Row className='mx-1 my-1 py-1 px-1' style={{ border: '1px dashed #E8E7F7' }}>
                  Empty Steps
                </Row>
              </CardBody>
            </Card>
          </Col>
      )}
    </Fragment>
  )
}

export default StepsCard

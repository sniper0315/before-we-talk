// ** React Imports
import { Fragment, useState, useRef, useEffect } from "react"

// ** ReactVideoRecorder Imports
import { useReactMediaRecorder } from "@dragan1810/use-media-recorder"
import { useSelector } from 'react-redux'

// ** Reactstrap Imports
import { selectThemeColors } from "@utils"
import { Row, Col, Button, Input, Label } from 'reactstrap'
import Select from "react-select"
import screenfull from 'screenfull'
import axios from "axios"
import {
  RecordingButton
} from "./Waveform.styled"

const recordingIcon = require("@src/assets/images/icons/custom/recording.svg").default
const recycleIcon = require("@src/assets/images/icons/custom/recycle.svg").default
const returnIcon = require("@src/assets/images/icons/custom/return.svg").default
const stopIcon = require("@src/assets/images/icons/custom/video-recording-stop.svg").default
const startIcon = require("@src/assets/images/icons/custom/video-recording-start.svg").default

const AddStepVideo = ({stepType, handleAddStep}) => {

  const videoRecordingContent = useRef(null)
  const videoPreviewRef = useRef(null)
  const [recentlyUsedVideos, setRecentlyUsedVideos] = useState([])
  const [isRecording, setRecording] = useState(false)
  const [content, setContent] = useState('')
  const [isStartRecording, setStartRecording] = useState(false)
  const [isPlayResumeRecording, setPlayResumeRecording] = useState(false)
  const { status, error, startRecording, stopRecording, pauseRecording, resumeRecording, mediaBlobUrl, mediaBlob } = useReactMediaRecorder({ audio: true, video: true })
  const [ctime, setTime] = useState(0)
  const authStore = useSelector(state => state.auth)
  const [recordUrl, setRecordUrl] = useState(null)
  const [selectedRecentFile, setSelectedRecentFile] = useState(false)
  
  if (screenfull.isEnabled) {
    screenfull.on('change', () => {
      setStartRecording(false)
      setPlayResumeRecording(false)
      setRecording(screenfull.isFullscreen)
    })
  }
    
  useEffect(() => {
    if (authStore.userData && authStore.userData.name) {
      axios
      .get(`steps/usedLinks/Video`)
      .then((res) => {
        console.log("||||||||", res)
        const data = []
        res.data.step.map((item) => {
          data.push({
            value: item.content,
            label: item.content
          })
        })
        setRecentlyUsedVideos(data)
        setContent(data[0].value)
        console.log("#@", data)
      })
      .catch((error) => {
        console.log("error:", error)
      })
    }
  }, [])

  const handleSave = async () => {
    console.log('videoResult', recordUrl)
    if (recordUrl) {
      handleAddStep(stepType, { content: recordUrl, name: `${content}.mp4` }, selectedRecentFile)
      // const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob())

      // const filename = `video-file-${new Date().getTime()}.mp4`
      // handleAddStep(stepType, filename)
      // const options = {
      //   method: 'PUT',
      //   url: `https://storage.bunnycdn.com/btw-storage-main/files/${filename}`,
      //   headers: {
      //     AccessKey: '9cd774e3-fbf1-4dce-a9f268f6d6c1-30f1-4ce5',
      //     'Content-Type': 'application/octet-stream'
      //   },
      //   data: audioBlob
      // }

      // axios.request(options)
      //   .then(res => {
      //     console.log("^^^^^^^^^", res)
      //   })
      //   .catch(err => {
      //     console.log('sdssssssss', err)
      //   })
    }
  }

  const handleRecording = () => {
    setRecording(true)
    if (screenfull.isEnabled && videoRecordingContent.current) {
      screenfull.request(videoRecordingContent.current)
    }
  }

  const str_pad_left = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length)
  }

  const getFormatedTime = (pTime) => {
    const minutes = Math.floor(pTime / 60)
    const seconds = Math.floor(pTime - (minutes * 60))
    return `${ str_pad_left(minutes, "0", 2)}:${ str_pad_left(seconds, "0", 2)}`
  }

  const handleStartRecording = () => {
    startRecording()
    setStartRecording(true)
    setPlayResumeRecording(true)
    setTimeout(() => {
      console.log(ctime)
      const temp = ctime + 1
      console.log(temp)
      setTime(temp)
    }, 1000)
  }

  useEffect(() => {
    if (isPlayResumeRecording) {
      setTimeout(() => {
        console.log(ctime)
        const temp = ctime + 1
        console.log(temp)
        setTime(temp)
      }, 1000)
    }
  }, [ctime, isPlayResumeRecording])

  useEffect(() => {
    if (mediaBlobUrl) {
    console.log('mediaBlobUrl', mediaBlobUrl)
      setRecordUrl(mediaBlobUrl)
    }
  }, [mediaBlobUrl])

  const handleStopRecording = () => {
    console.log(status)
    console.log(error)
    console.log(mediaBlob)
    setRecordUrl(mediaBlobUrl)
    setSelectedRecentFile(false)
    setStartRecording(false)
    setPlayResumeRecording(false)
    stopRecording()
    screenfull.exit()
  }

  const handlePauseRecording = () => {
    setPlayResumeRecording(false)
    pauseRecording()
  }

  const handleResumeRecording = () => {
    setPlayResumeRecording(true)
    resumeRecording()
  }

  const handleClearBlobUrl = () => {
    setPlayResumeRecording(false)
    setTime(0)
    clearBlobUrl()
  }

  const OnChange = async (value) => {
    const filename = value.value
    setContent(value.value)
    const response = await axios({
      url: `${process.env.REACT_APP_API_URL}/messages/download/${filename}`,
      method: 'GET'
    })
    const array = new Uint8Array(response.data.data)
    const blob = new Blob([array])
    const blobUrl = URL.createObjectURL(blob)
    // waveform.load(blobUrl)
    setRecordUrl(blobUrl)
    setSelectedRecentFile(true)
  }

  return (
    <Fragment>
      
      <Row>
        <Row>
          <Col sm="8">
            <Col sm="12" className="text-center">
              <RecordingButton onClick={() => handleRecording()}>
                <img src={ recordingIcon } />
              </RecordingButton>
            </Col>
            <Row>
              <div className='recording-body' ref={videoRecordingContent} style={{ display: isRecording ? 'block' : 'none' }}>
                <div className='top-background-circle'></div>
                <div className='out-container-circle'>
                  <div id="circle-loader-wrap" style={{ background: isStartRecording ? '' : 'none' }}>
                    <div className="left-wrap">
                      <div className={isStartRecording ? 'loader' : ""}></div>
                    </div>
                    <div className="right-wrap">
                      <div className={isStartRecording ? 'loader' : ""}></div>
                    </div>
                    <div className='main-circle'></div>
                    <div className='bottom-video-control'>
                      <div className='time-circle'>{getFormatedTime(ctime)}</div>
                      <div className='time-circle' style={{ display: isStartRecording ? 'none' : 'inline-block' }} onClick={() => handleStartRecording()}>
                        <img src={ stopIcon } />
                      </div>
                    </div>
                  </div>
                  <div className='left-video-control' style={{ display: isStartRecording ? 'flex' : 'none' }}>
                    <div className='control-body'>
                      <div className='time-circle' onClick={() => handlePauseRecording()}>
                        <img src={ stopIcon } />
                      </div>
                      <div className='time-circle' onClick={() => handleStopRecording()}>
                        <img src={ returnIcon } />
                      </div>
                      <div className='time-circle' onClick={() => handleResumeRecording()}>
                        <img src={ startIcon } />
                      </div>
                      <div className='time-circle' onClick={() => handleClearBlobUrl()}>
                        <img src={ recycleIcon } />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='bottom-background-circle'></div>
              </div>
              <Row>
                <div style={{ display: 'none' }}>
                  <video ref={videoPreviewRef} src={mediaBlobUrl} controls />
                </div>
              </Row>
            </Row>
            <Row style={{ display: (recordUrl) ? 'block' : 'none' }}>
              <Col sm="12">
                <div style={{ width: "302px", margin: "auto" }}>
                  <Label className='form-label' for='content'>
                    Name recording to re-use(optional)
                  </Label>
                  <Input type='text' id='content' placeholder='My recording' style={{ width: "100%" }} value={content} onChange={e => setContent(e.target.value)} />
                </div>
              </Col>
            </Row>
          </Col>
          <Col sm="4" className="mt-5">
            <div className="">
              <Label className="form-label" for="content">
                Copy from recently used
              </Label>
            </div>
            <div className="text-left">
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                defaultValue={recentlyUsedVideos[0]}
                options={recentlyUsedVideos}
                isClearable={false}
                onChange={OnChange}
              />
            </div>
          </Col>
        </Row>
        <Col sm="12" className="mt-3">
          <div className="text-center">
            <Button.Ripple color='primary' className="primary-btn me-2" outline >
              Cancel
            </Button.Ripple>
            <Button.Ripple
              className="primary-btn"
              color="primary"
              onClick={() => handleSave(content)}
            >
              Save and Add
            </Button.Ripple>
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}

export default AddStepVideo

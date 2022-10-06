// ** React Imports
import React, { useState, Fragment, useEffect } from "react"
import WaveSurfer from "wavesurfer.js"
import { selectThemeColors } from "@utils"
import { useSelector } from 'react-redux'
import axios from "axios"
import {
  WaveformContianer,
  Wave,
  PlayButton,
  RecordingButton,
  PauseButton,
  StopRecordingButton,
  ConversationAudioContainer,
  ConversationCurrentTimeAudio
} from "./Waveform.styled"
// ** ReactAudioRecorder Imports
import { useAudioRecorder } from "@sarafhbk/react-audio-recorder"
// import audioFile from "../../assets/moana.mp3"
import Select from "react-select"
const recordingIcon =
  require("@src/assets/images/icons/custom/recording.svg").default
const startIcon = require("@src/assets/images/icons/custom/start.svg").default
const stopIcon = require("@src/assets/images/icons/custom/stop.svg").default
const pauseIcon = require("@src/assets/images/icons/custom/pause.svg").default
const pauseRecordingIcon = require("@src/assets/images/icons/custom/pauseRecording.svg").default

// ** Reactstrap Imports
import { Row, Col, Button, Input, Label } from "reactstrap"

const AddStepAudio = ({ stepType, handleAddStep }) => {
  // console.log("getUserMedia supported.")
  const {
    audioResult,
    timer,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording
    // status,
    // errorMessage
  } = useAudioRecorder()

  const [recentlyUsedAudios, setRecentlyUsedAudios] = useState([])
  const [isRecording, setRecordingState] = useState(false)
  const [content, setContent] = useState('')
  // const [isPlaying, setPlayingState] = useState(false)
  const [waveform, setWaveform] = useState(null)
  // const chunks = []
  // const dest = ctx.createMediaStreamDestination()
  const [stream, setStream] = useState(null)
  const [currentTime, setCurrentTime] = useState('00:00')
  const [hasStoppedRecording, setHasStoppedRecording] = useState(true)
  const authStore = useSelector(state => state.auth)
  const [recordUrl, setRecordUrl] = useState(null)
  const [selectedRecentFile, setSelectedRecentFile] = useState(false)

  if (!stream && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // console.log("test getUserMedia supported.")
    navigator.mediaDevices
      .getUserMedia({
        audio: true
      })
      .then((_stream) => {
        // console.log("stream getUserMedia supported.")
        setStream(_stream)
      })
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`)
      })
  } else {
    console.log("getUserMedia not supported on your browser!")
  }

  useEffect(() => {

    if (authStore.userData && authStore.userData.name) {
      axios
      .get(`steps/usedLinks/Audio`)
      .then((res) => {
        console.log("||||||||", res)
        const data = []
        res.data.step.map((item) => {
          data.push({
            value: item.content,
            label: item.content
          })
        })
        setRecentlyUsedAudios(data)
        setContent(data[0].value)
        console.log("#@", data)
      })
      .catch((error) => {
        console.log("error:", error)
      })
    }
  }, [])

  const [mediaRecorder, setMediaRecorder] = useState(null)
  useEffect(() => {
    if (!mediaRecorder && stream) {
      setMediaRecorder(new MediaRecorder(stream))
    }
  }, [stream])

  useEffect(() => {
    if (mediaRecorder) {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      mediaRecorder.ondataavailable = function (evt) {
        console.log("ondataavailable")
        chunks.push(evt.data)
      }

      mediaRecorder.onstop = function () {
        console.log("audioResult", audioResult)
        console.log("stopped")
      }
    }
  }, [mediaRecorder])

  useEffect(() => {
    if (!waveform) {
      const newWaveform = WaveSurfer.create({
        barWidth: 3,
        barGap: 5,
        cursorWidth: 1,
        container: "#waveform",
        backend: "WebAudio",
        height: 65,
        progressColor: "#7367F0",
        responsive: true,
        waveColor: "#C9C6F7",
        cursorColor: "transparent"
      })

      setWaveform(newWaveform)
    }
  }, [])

  const str_pad_left = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length)
  }

  useEffect(() => {
    if (waveform) {
      // waveform.load(audioFile)

      waveform.on('ready', function () {
        const minutes = Math.floor(waveform.getDuration() / 60)
        const seconds = Math.floor(waveform.getDuration() - (minutes * 60))
        setCurrentTime(`${ str_pad_left(minutes, "0", 2)}:${ str_pad_left(seconds, "0", 2)}`)
      })
      
      waveform.on('audioprocess', function () {
        const minutes = Math.floor(waveform.getCurrentTime() / 60)
        const seconds = Math.floor(waveform.getCurrentTime() - (minutes * 60))
        setCurrentTime(`${ str_pad_left(minutes, "0", 2)}:${ str_pad_left(seconds, "0", 2)}`)
      })
    }
  }, [waveform])

  useEffect(() => {
    if (audioResult) {
      waveform.load(audioResult)
      setRecordUrl(audioResult)
      setSelectedRecentFile(false)
    }
  }, [audioResult])

  const handleSave = async () => {
    console.log("audioResult", recordUrl)
    if (recordUrl) {
      handleAddStep(stepType, {content: recordUrl, name: `${content}.wav`}, selectedRecentFile)
      /*--------------*/
      // const audioBlob = await fetch(audioResult).then((r) => r.blob())

      // const filename = `sound-file-${new Date().getTime()}.wav`
      // const audioFile = new File([audioBlob], filename, { type: 'audio/wav' })
      // const formData = new FormData()
      // formData.append('media', audioFile) 
      // handleAddStep(stepType, filename)
      // await axios.post('messages/upload', formData, {"Content-Type": "multipart/form-data"})
      /*--------------*/
      // console.log(audioResult)
      // const audioBlob = await fetch(audioResult).then((r) => r.blob())

      // const filename = `sound-file-${new Date().getTime()}.wav`
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

  const handlePlay = () => {
    // setPlayingState(true)
    waveform.play()
  }

  const handlePause = () => {
    // setPlayingState(false)
    waveform.pause()
  }

  const handleStartPlayPauseRecording = () => {
    if (isRecording) {
      pauseRecording()
      setRecordingState(false)
    } else if (!isRecording && hasStoppedRecording) {
      startRecording()
      setRecordingState(true)
      setHasStoppedRecording(false)
    } else {
      resumeRecording()
      setRecordingState(true)
    }
  }

  const handleStopRecording = () => {
    if (isRecording) {
      setContent('')
      setRecordUrl(audioResult)
      setSelectedRecentFile(false)
      stopRecording()
      setHasStoppedRecording(true)
      setRecordingState(false)
    }
  }

  const initializeStatusAndContent = () => {
    // if (isRecording) {
    stopRecording()
    setRecordingState(false)
    setHasStoppedRecording(true)
    waveform.empty()
    setContent('')
    // }
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
    waveform.load(blobUrl)
    setRecordUrl(blobUrl)
    setSelectedRecentFile(true)
  }

  return (
    <Fragment>
      <Row>
        <Row>
          <Col sm="8">
            <Col sm="12" className="text-center">
              <PauseButton onClick={() => handlePause()} style={{ display: (isRecording || recordUrl) ? 'inline-block' : 'none' }}>
                <img src={pauseIcon} />
              </PauseButton>
              <RecordingButton onClick={() => handleStartPlayPauseRecording()}>
                <img src={ isRecording ? pauseRecordingIcon : recordingIcon } />
              </RecordingButton>
              <PlayButton onClick={() => handlePlay()} style={{ display: (isRecording || recordUrl) ? 'inline-block' : 'none' }}>
                <img src={startIcon} />
              </PlayButton>
              <StopRecordingButton onClick={() => handleStopRecording()} style={{ display: isRecording ? 'inline-block' : 'none' }}>
                <img src={stopIcon} />
              </StopRecordingButton>
            </Col>
            <Row className="text-center" style={{ display: isRecording ? 'block' : 'none' }}>
              <p className="mb-0 mt-2">{new Date(timer * 1000).toISOString().substr(11, 8)}</p>
            </Row>
            <ConversationAudioContainer style={{ display: (isRecording || recordUrl) ? 'flex' : 'none' }} >
              <Col className="p-0" style={{ flex: '10 0'}}>
                <WaveformContianer>
                  <Wave id="waveform" />
                  {/* <audio src={audioFile} /> */}
                  <audio src={audioResult} />
                </WaveformContianer>
              </Col>
              <ConversationCurrentTimeAudio>
                {currentTime}
              </ConversationCurrentTimeAudio>
            </ConversationAudioContainer>
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
                defaultValue={recentlyUsedAudios[0]}
                options={recentlyUsedAudios}
                isClearable={false}
                onChange={OnChange}
                menuPlacement="auto"
              />
            </div>
          </Col>
        </Row>
        <Col sm="12" className="mt-3">
          {/* <div className="mb-2" style={{ display: 'none' }} >
            <audio controls src={audioResult} />
            <p>
              Status : <b>{status}</b>
            </p>
            <p>
              Error Message : <b>{errorMessage}</b>
            </p>
            <div>
              <div>
                <button onClick={startRecording}>Start</button>
                <button onClick={stopRecording}>Stop</button>
                <button onClick={pauseRecording}>Pause</button>
                <button onClick={resumeRecording}>Resume</button>
              </div>
            </div>
          </div> */}
          <div className="text-center" style={{ display: hasStoppedRecording ? 'block' : 'none' }}>
            <Button.Ripple color='primary' className="primary-btn me-2" outline onClick={() => initializeStatusAndContent()}>
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

export default AddStepAudio

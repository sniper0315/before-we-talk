import React, { useState, Fragment, useEffect } from "react"
import WaveSurfer from "wavesurfer.js"
import {
  WaveformContianer,
  Wave,
  PlayPauseConversationButton,
  ConversationCurrentTimeAudio,
  ConversationAudioContainer
} from "./Waveform.styled"
const playIcon = require("@src/assets/images/icons/custom/white-start.svg").default
const pauseIcon = require("@src/assets/images/icons/custom/pauseRecording.svg").default

import { Row, Col, Button, Input, Label } from "reactstrap"

const AudioWavesurfer = ({audioUrl, audioSelector}) => {

  const [waveform, setWaveform] = useState(null)
  const [stream, setStream] = useState(null)
  const [currentTime, setCurrentTime] = useState('00:00')
  const [isPlaying, setIsPlaying] = useState(false)

  if (!stream && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true
      })
      .then((_stream) => {
        setStream(_stream)
      })
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`)
      })
  } else {
    console.log("getUserMedia not supported on your browser!")
  }

  const [mediaRecorder, setMediaRecorder] = useState(null)
  useEffect(() => {
    if (!mediaRecorder && stream) {
      setMediaRecorder(new MediaRecorder(stream))
    }
  }, [stream])

  useEffect(() => {
    if (!waveform) {
      const newWaveform = WaveSurfer.create({
        barWidth: 3,
        barGap: 5,
        cursorWidth: 1,
        container: `#${audioSelector}`,
        backend: "WebAudio",
        height: 40,
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
      if (audioUrl && audioUrl !== "") waveform.load(audioUrl)

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

  const handlePlay = () => {
    setIsPlaying(true)
    waveform.play()
  }

  const handlePause = () => {
    setIsPlaying(false)
    waveform.pause()
  }

  return (
    <Fragment>
      <ConversationAudioContainer>
        <Col className="py-0 px-0" style={{ flex: '0 0' }}>
          <PlayPauseConversationButton onClick={handlePause} style={{ display: isPlaying ? 'block' : 'none' }}>
            <img src={pauseIcon} width={10} />
          </PlayPauseConversationButton>
          <PlayPauseConversationButton onClick={handlePlay} style={{ display: isPlaying ? 'none' : 'block' }}>
            <img src={playIcon} />
          </PlayPauseConversationButton>
        </Col>
        <Col className="p-0" style={{ flex: '10 0' }}>
          <WaveformContianer>
            <Wave id={audioSelector} />
            <audio src={audioUrl} />
          </WaveformContianer>
        </Col>
        <ConversationCurrentTimeAudio>
          {currentTime}
        </ConversationCurrentTimeAudio>
      </ConversationAudioContainer>
    </Fragment>
  )
}

export default AudioWavesurfer

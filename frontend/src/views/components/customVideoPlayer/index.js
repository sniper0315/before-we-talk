import React, { useState, useRef } from "react"
import './style.css'
const playIcon = require("@src/assets/images/icons/custom/white-start.svg").default
const pauseIcon = require("@src/assets/images/icons/custom/pauseRecording.svg").default

// import { Row, Col, Button, Input, Label } from "reactstrap"

const AudioWavesurfer = ({ videoUrl, videoSelector }) => {

  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoTime, setVideoTime] = useState(0)
  const [progress, setProgress] = useState(0)

  const videoHandler = (control) => {
    if (control === "play") {
      videoRef.current.play()
      setPlaying(true)
      const vid = document.getElementById(videoSelector)

      console.log(vid)
      setVideoTime((vid.duration === Infinity) ? 0 : vid.duration)
    } else if (control === "pause") {
      videoRef.current.pause()
      setPlaying(false)
    }
  }

  // const fastForward = () => {
  //   videoRef.current.currentTime += 5
  // }

  // const revert = () => {
  //   videoRef.current.currentTime -= 5
  // }

  window.setInterval(function () {
    if (videoRef.current?.duration !== Infinity && videoRef.current?.duration !== 0) setVideoTime(videoRef.current?.duration)
    setCurrentTime(videoRef.current?.currentTime)
    setProgress((videoRef.current?.currentTime / videoTime) * 100)
  }, 1000)

  return (
    <div className="app">
      <video
        id={videoSelector}
        ref={videoRef}
        className="video"
        src={videoUrl}
      ></video>

      <div className="controlsContainer">
        <div className="controls">
          {/* <img
            onClick={revert}
            className="controlsIcon"
            alt=""
            src="/backward-5.svg"
          /> */}
          {playing ? (
            <img
              onClick={() => videoHandler("pause")}
              className="controlsIcon--small"
              alt=""
              src={pauseIcon}
            />
          ) : (
            <img
              onClick={() => videoHandler("play")}
              className="controlsIcon--small"
              alt=""
              src={playIcon}
            />
          )}
          {/* <img
            className="controlsIcon"
            onClick={fastForward}
            alt=""
            src="/forward-5.svg"
          /> */}
        </div>
      </div>

      <div className="timecontrols">
        <p className="controlsTime">
          {`${Math.floor(currentTime / 60)}:${(`0${Math.floor(currentTime % 60)}`).slice(-2)}`}
        </p>
        <div className="time_progressbarContainer">
          <div
            style={{ width: `${progress}%` }}
            className="time_progressBar"
          ></div>
        </div>
        <p className="controlsTime">
          {`${Math.floor(videoTime / 60)}:${(`0${Math.floor(videoTime % 60)}`).slice(-2)}`}
        </p>
      </div>
    </div>
  )
}

export default AudioWavesurfer

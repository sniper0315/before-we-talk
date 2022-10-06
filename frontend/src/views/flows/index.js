// ** React Imports
import { Fragment, useEffect, useState } from "react"
// import { useParams } from 'react-router-dom'
import {Helmet} from "react-helmet"

// ** Third Party Components
import axios from "axios"
// import { useDispatch } from 'react-redux'

// ** Reactstrap Imports
import toast from "react-hot-toast"
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from "reactstrap"
import { useCallbackPrompt } from '@hooks/useCallbackPrompt'

// ** Actions
// import { handleClearTempStep } from '@store/authentication'

// ** Components
import AddFlow from "./AddFlow"
import AddStep from "./AddStep"
import StepsCard from "./StepsCard"
import UnsavedModal from '@src/views/components/notificationModal/UnsavedModal'
// import ModalSuccess from './ModalSuccess'
// import ModalFailed from './ModalFailed'

// ** Styles
import "@styles/base/pages/flows.scss"

import { APP_NAME } from "../../app-config"

const initialFlow = {
  _id: "",
  link: "",
  name: ""
}

const defaultSteps = [
  {
    content:
      "Welcome to Before We Talk! BWT helps increase engagement from people outside your network while saving you time in meetings.",
    description: "",
    stepType: "Text"
  },
  {
    content:
      "Click Add Step to create your own conversation flow. You can record video and audio messages (and then re-use them) to easily create personalized messaging. Once saved, share the URL link (e.g. include in your emails) to anyone you'd like to reach. Recipients can view it and respond (also with audio and video) to start a private conversation with you. All without the need to schedule a meeting first.",
    description: "",
    stepType: "Text"
  }
]

const Flows = () => {
  // ** Hooks
  // const dispatch = useDispatch()
  // ** States
  // const [successModal, setSuccessModal] = useState(false)
  // const [failedModal, setFailedModal] = useState(false)
  const [addStepMode, setAddStepMode] = useState(false)
  const [initialSteps, setInitialSteps] = useState([])
  const [steps, setSteps] = useState([])
  const [flow, setFlow] = useState(initialFlow)
  const authStore = useSelector(state => state.auth)
  const socket = authStore.socketObject
  const [logged, setLogged] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog)
  
  console.log(authStore)
  const tempStep = authStore.tempStep
  // ** Vars
  const params = useParams()
  const navigate = useNavigate()
  const [fileList, setFileList] = useState([])

  const getBlobUrl = async (filename, stepType) => {
    console.log('filename', filename)
    if (stepType !== 'File' && ((stepType !== 'Audio' && stepType !== 'Video') || (filename.substr(-3) !== 'wav' && filename.substr(-3) !== 'mp4'))) return {blobUrl: '', blob: ''}
    const response = await axios({
      url: `${process.env.REACT_APP_API_URL}/messages/download/${filename}`,
      method: 'GET'
    })
    console.log('bloib', response)
    const array = new Uint8Array(response.data.data)
    const blob = new Blob([array])
    const blobUrl = URL.createObjectURL(blob)
    return { blobUrl, blob }
    // setUrl(blobUrl)
  }
  useEffect(() => {
    async function fetchData() {
      console.log('tempStep', tempStep)
      let tSteps = []
      if (params.flowId) {
        const res = await axios.get(`flows/${params.flowId}`)
        // .then(res => {
        const data = res.data.flow
        setFlow({
          _id: data._id,
          link: data.link,
          name: data.name
        })
        console.log("PaRAMS", res)
        const resp = await axios.get(`steps/getByFlowId/${params.flowId}`)
        // .then(res => {
        console.log("EEEEEEEE", resp)
        tSteps = resp.data.steps
        // setSteps(res.data.steps)
        // })
        // })
        // .catch(error => {
        //   console.log('error:', error)
        // })
      } else if (tempStep && tempStep.stepList.length > 0) {
        const newSteps = []
        tempStep.stepList.forEach(e => {
          newSteps[newSteps.length] = {
            stepType: e.stepType,
            content: e.content,
            description: e.description,
            type: 'history'
          }
        })
        setSteps(newSteps)
        setFlow({
          _id: "",
          link: "",
          name: tempStep.flowName
        })
        // dispatch(handleClearTempStep())
      } else {
        const res = await axios.get('/steps/getDefaultSteps/flow')
        // .then((res) => {
        if (res.data.steps.length === 0) {
          setInitialSteps(defaultSteps)
          tSteps = defaultSteps
          // setSteps(defaultSteps)
        } else {
          setInitialSteps(res.data.steps)
          tSteps = res.data.steps
          // setSteps(res.data.steps)
        }
        // })
      }
      if (authStore.userData && authStore.userData.name) {
        setLogged(true)
      }

          console.log('------------------', tSteps)
      if (!tempStep || tempStep.stepList.length === 0) {
        let arr = []
        Promise.all(tSteps.map((step) => {
          const func = new Promise(resolve => {
            getBlobUrl(step.content, step.stepType)
              .then((res) => {
                // console.log(msg)
                // newMsg.chat.push()
                if (step.stepType === 'File') {
                  
                  const tempFileList = [...fileList]
                  tempFileList[tempFileList.length] = res.blob
                  setFileList(tempFileList)
                }
                resolve({
                  content: (step.stepType === 'Video' || step.stepType === 'Audio') ? res.blobUrl : step.content,
                  blobUrl: res.blobUrl,
                  stepType: step.stepType,
                  description: step.description,
                  flow: step.flow,
                  stepNumber: step.stepNumber,
                  type: step.type,
                  user: step.user,
                  name: (step.stepType === 'Video' || step.stepType === 'Audio') ? step.content : '',
                  _id: step._id,
                  isRecent: true
                })
              })
          })
          return func
        })).then((result) => {

          arr = result.sort((a, b) => {
            if (a.stepNumber > b.stepNumber) return 1
            if (a.stepNumber < b.stepNumber) return -1
            return 0
          })
          console.log('------------------', arr)
          setSteps(arr)
        })
      }
    }
    fetchData()
  }, [])

  const handleAddStep = (stepType, content, isRecent = false, description = "") => {
    console.log("stepType:", stepType)
    console.log("content:", content)
    console.log("description:", description)
    const newSteps = [...steps]
    newSteps[newSteps.length] = {
      stepType,
      content: (stepType === 'File' && !isRecent) ? `${fileList.length}` : (stepType === 'Video' || stepType === 'Audio') ? content.content : content,
      description,
      name: (stepType === 'Video' || stepType === 'Audio') ? content.name : '',
      isRecent
    }
    if (stepType === 'File') {
      const tempFileList = [...fileList]
      tempFileList[tempFileList.length] = content
      setFileList(tempFileList)
    }
    setSteps(newSteps)
    toast.success("Step is added successfully!")
    setShowDialog(true)
  }

  const handleRemoveStep = (index) => {
    console.log("index", index)
    const newSteps = [...steps]
    newSteps.splice(index, 1)
    setSteps(newSteps)
    setShowDialog(true)
  }

  const handleCreateFlow = (flowName, flowLink = "") => {
    axios
      .post('/flows/create', { name: flowName, link: flowLink })
      .then((res) => {
        toast.success("Flow is created successfully!")
        console.log("Flow create res", res)
        setFlow(res.data.new_flow)
        setShowDialog(true)
      })
      .catch((err) => {
        console.log("Error", err)
      })
  }

  const handleUpdateFlow = async (flowId, flowName, flowLink = "") => {

    // await 
    await axios.put(`/flows/update/${flowId}`, { name: flowName, link: flowLink })
    const timeTemp = new Date().getTime()
    const stepArray = steps.map((step, index) => {
      if (!step.type && !step.isRecent && (step.stepType === 'Audio' || step.stepType === 'Video' || step.stepType === 'File')) {
        let filename = (step.name !== '') ? step.name : step.stepType === 'Audio' ? `sound-file-${timeTemp}-${index}.wav` : `video-file-${timeTemp}-${index}.mp4`
        if (step.stepType === 'File') {
          filename = fileList[parseInt(step.content)].name
        }
        return {
          flow: flowId,
          stepNumber: index + 1,
          stepType: step.stepType,
          content: filename,
          description: step.description
        }
      } else {
        return {
          flow: flowId,
          stepNumber: index + 1,
          stepType: step.stepType,
          content: step.content,
          description: step.description
        }
      }
    })
    await axios.post('/steps/create', { stepArray })


    const res = await axios.post('rooms/create', { flowId })
    console.log("Room res", res)
    const formData = new FormData()
    const messageArray = await Promise.all(steps.map(async(step, i) => {
      if (!step.type && !step.isRecent && (step.stepType === 'Audio' || step.stepType === 'Video' || step.stepType === 'File')) {
        let filename = (step.name !== '') ? step.name : step.stepType === 'Audio' ? `sound-file-${timeTemp}-${i}.wav` : `video-file-${timeTemp}-${i}.mp4`
        if (step.stepType === 'File') {
          filename = fileList[parseInt(step.content)].name
          formData.append('media', fileList[parseInt(step.content)]) 
        } else {
          const audioBlob = await fetch(step.content).then((r) => r.blob())
          const audioFile = new File([audioBlob], filename, { type: step.stepType === 'Audio' ? 'audio/wav' : 'video/mp4' })
          formData.append('media', audioFile) 
        }
        
        return {
          room: res.data.room,
          user: authStore.userData._id,
          stepType: step.stepType,
          message: filename,
          flowId
        }
      } else {
        return {
          room: res.data.room,
          user: authStore.userData._id,
          stepType: step.stepType,
          message: step.content,
          flowId,
          type: step.type
        }
      }
    }))
    formData.append('messageArray', JSON.stringify(messageArray))
    const result = await axios.post('messages/create', formData, {"Content-Type": "multipart/form-data"})
    // axios.post('messages/create', formData, {"Content-Type": "multipart/form-data"})
    console.log("message result", result)
    setShowDialog(false)
    toast.success("Flow and steps are created successfully!")
    socket.emit('flow', {action: 'new'})
  }

  const handleDeleteFlow = (flowId) => {
    axios
      .delete(`/flows/delete/${flowId}`)
      .then((res) => {
        setShowDialog(false)
        console.log("res", res)
        toast.success("Flow is deleted successfully!")
        setFlow({ ...initialFlow })
        setSteps(initialSteps)
        navigate("/flows")
      })
      .catch((err) => {
        setShowDialog(false)
        console.log("Error", err)
      })
  }

  return (
    <Fragment>

      <Helmet>
        <meta charSet="utf-8" />
        <title>Flows | {APP_NAME}</title>
        <meta name="description" content="Create a flow with Before We Talk and have more async meetings."/>
        <meta NAME="robots" CONTENT="noindex"/>
      </Helmet>

      <div className="content-body">
        <UnsavedModal showPrompt={showPrompt} confirmNavigation={confirmNavigation} cancelNavigation={cancelNavigation} />
        <h1 className="d-mobile-small-none display-4 mb-2">
          Let’s create
          <br /> a conversation flow to
          <br /> save time in meetings
        </h1>
        <h4 className="d-none d-mobile-small-block mb-2">
          Let’s create a conversation
          <br />flow to save time
          <br />in meetings
        </h4>
        <h4 className="d-mobile-small-none mb-2">
          Add 1 or more steps below to create a shareable conversation flow.{" "}
        </h4>
        <h6 className="d-none d-mobile-small-block mb-2">
          Add 1 or more steps below to create a shareable conversation flow.{" "}
        </h6>
        <Button.Ripple
          color="primary"
          className="primary-btn mb-5"
          onClick={() => setAddStepMode(true)}
          style={{ display: !addStepMode ? 'block' : 'none' }}
        >
          Add step
        </Button.Ripple>
        <Button.Ripple
          color="primary"
          className="primary-btn mb-5"
          onClick={() => {
            setAddStepMode(false)
            setSteps(initialSteps)
            setFlow(initialFlow)
          }}
          style={{ display: addStepMode ? 'block' : 'none' }}
        >
          Cancel
        </Button.Ripple>

        {addStepMode && <AddStep handleAddStep={handleAddStep} />}

        <StepsCard steps={steps} handleRemoveStep={handleRemoveStep} fileList={fileList} setSteps={setSteps} />

        <AddFlow logged={logged} steps={steps} fileList={fileList} flow={flow} handleCreateFlow={handleCreateFlow} handleUpdateFlow={handleUpdateFlow} handleDeleteFlow={handleDeleteFlow} unsavedFlowName={() => {
          setShowDialog(true)
        }} />
        {/* 
        <ModalSuccess successModal={successModal} setSuccessModal={setSuccessModal} handleSaveName={handleSaveName} />

        <ModalFailed failedModal={failedModal} setFailedModal={setFailedModal} />
        */}
      </div>
    </Fragment>
  )
}

export default Flows

// ** React Imports
import { Fragment, useEffect, useState } from "react"
// import { useParams } from 'react-router-dom'

// ** Third Party Components
import axios from "axios"
// import { useDispatch } from 'react-redux'

// ** Reactstrap Imports
import toast from "react-hot-toast"
import { Button } from "reactstrap"

// ** Actions
// import { handleClearTempStep } from '@store/authentication'

// ** Components
import AddStep from "../flows/AddStep"
import StepsCard from "../flows/StepsCard"
// import ModalSuccess from './ModalSuccess'
// import ModalFailed from './ModalFailed'

// ** Styles
import "@styles/base/pages/flows.scss"
import style from './defaultSteps.module.css'

const initialSteps = []

const DefaultSteps = () => {
  const [addStepMode, setAddStepMode] = useState(false)
  const [steps, setSteps] = useState(initialSteps)
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    axios.get('/steps/getDefaultSteps')
      .then((res) => {
      setSteps(res.data.steps)
    })
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
  }

  const handleRemoveStep = (index) => {
    console.log("index", index)
    const newSteps = [...steps]
    newSteps.splice(index, 1)
    setSteps(newSteps)
  }

  const handleUpdateDefaultSteps = async () => {
    const stepArray = steps.map((step, index) => {
      return {
        stepNumber: index + 1,
        stepType: step.stepType,
        content: step.content,
        description: step.description,
        type: 'default'
      }
    })
    await axios.post('/steps/create', { stepArray, type: 'default' })
    toast.success("Step is saved successfully!")
  }

  // const handleUpdateFlow = async (flowId, flowName, flowLink = "") => {

  //   // await 
  //   await axios.put(`/flows/update/${flowId}`, { name: flowName, link: flowLink })
    
    // const stepArray = steps.map((step, index) => {
    //   return {
    //     flow: flowId,
    //     stepNumber: index + 1,
    //     stepType: step.stepType,
    //     content: step.content,
    //     description: step.description
    //   }
    // })
    // await axios.post('/steps/create', stepArray)


  //   const res = await axios.post('rooms/create', { flowId })
  //   console.log("Room res", res)
  //   const formData = new FormData()
  //   const messageArray = await Promise.all(steps.map(async(step, i) => {
  //     if (!step.type && !step.isRecent && (step.stepType === 'Audio' || step.stepType === 'Video' || step.stepType === 'File')) {
  //       let filename = (step.name !== '') ? step.name : step.stepType === 'Audio' ? `sound-file-${new Date().getTime()}-${i}.wav` : `video-file-${new Date().getTime()}-${i}.mp4`
  //       if (step.stepType === 'File') {
  //         filename = fileList[parseInt(step.content)].name
  //         formData.append('media', fileList[parseInt(step.content)]) 
  //       } else {
  //         const audioBlob = await fetch(step.content).then((r) => r.blob())
  //         const audioFile = new File([audioBlob], filename, { type: step.stepType === 'Audio' ? 'audio/wav' : 'video/mp4' })
  //         formData.append('media', audioFile) 
  //       }
        
  //       return {
  //         room: res.data.room,
  //         user: authStore.userData._id,
  //         stepType: step.stepType,
  //         message: filename,
  //         flowId
  //       }
  //     } else {
  //       return {
  //         room: res.data.room,
  //         user: authStore.userData._id,
  //         stepType: step.stepType,
  //         message: step.content,
  //         flowId,
  //         type: step.type
  //       }
  //     }
  //   }))
  //   formData.append('messageArray', JSON.stringify(messageArray))
  //   const result = await axios.post('messages/create', formData, {"Content-Type": "multipart/form-data"})
  //   // axios.post('messages/create', formData, {"Content-Type": "multipart/form-data"})
  //   console.log("message result", result)
  //   toast.success("Flow and steps are created successfully!")
  // }

  return (
    <Fragment>
      <h1 className="display-4 mb-2">
        Default steps
      </h1>
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
        }}
        style={{ display: addStepMode ? 'block' : 'none' }}
      >
        Cancel
      </Button.Ripple>

      {addStepMode && <AddStep handleAddStep={handleAddStep} />}

      <StepsCard steps={steps} handleRemoveStep={handleRemoveStep} fileList={fileList} setSteps={setSteps}  />
      <div className={style.alignCenter}>
        <Button.Ripple
          color="primary"
          className={`primary-btn mb-5 ${style.mt5}`}
          onClick={() => {
            handleUpdateDefaultSteps()
          }}
        >
          Save
        </Button.Ripple>
      </div>
    </Fragment>
  )
}

export default DefaultSteps

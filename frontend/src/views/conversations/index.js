// ** React Imports
import Avatar from '@components/avatar'
import axios from "axios"
import classnames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { Search } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { handleClearTempStep } from '@store/authentication'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
// import { socket } from '../../utils/helper'
import CardChat from './CardChat'
import style from './Conversation.module.css'

// ** Third Party Components
import {
  Label, Card, Col, Input, InputGroup, InputGroupText, ListGroup, ListGroupItem, Nav, NavItem, NavLink, Row, TabContent, TabPane, Modal, ModalBody, ModalFooter, ModalHeader, Button
} from 'reactstrap'

const audioIcon = require('@src/assets/images/icons/custom/audio.svg').default
const videoIcon = require('@src/assets/images/icons/custom/video.svg').default
const fileIcon = require('@src/assets/images/icons/custom/file.svg').default
const manIcon = require('@src/assets/images/icons/custom/man.svg').default
const leafIcon = require('@src/assets/images/icons/custom/leaf.svg').default
// const hintIcon = require("@src/assets/images/icons/custom/hint.svg").default

import AddStepAudio from '../flows/AddStepAudio'
import AddStepFile from '../flows/AddStepFile'
import AddStepVideo from '../flows/AddStepVideo'
import NameRequestModal from '../components/notificationModal/NameRequestModal'
import { APP_NAME } from '../../app-config'

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

const Conversations = () => {
  // ** States
  // const [activeTab, setActiveTab] = useState('1')
  // const [data, setData] = useState(null)

  const [centeredModal, setCenteredModal] = useState(false)
  const [showCreateFlow, setShowCreateFlow] = useState(false)
  const params = useParams()
  const [messages, setMessages] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [active, setActive] = useState(1)
  const [msgCnt, setMsgCnt] = useState({ msgCnt: 0, chatData: {} })
  const [rooms, setRooms] = useState([])
  const [showAttachment, setShowAttachment] = useState({ value: false, id: 1 })
  const [flowId, setFlowId] = useState(null)
  const [demoRoom, setDemoRoom] = useState(null)
  const authStore = useSelector(state => state.auth)
  console.log('================', authStore)
  const socket = authStore.socketObject
  const [activeRoom, setActiveRoom] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleAddStep = async (stepType, content, isRecent = false, description = "") => {
    console.log(description)
    console.log("isRecent:", isRecent)
    const name = (stepType === 'Video' || stepType === 'Audio') ? content.name : ''
    const formData = new FormData()
    let filename = (name !== '') ? name : stepType === 'Audio' ? `sound-file-${new Date().getTime()}.wav` : `video-file-${new Date().getTime()}.mp4`
    if (stepType === 'File') {
      filename = content.name
      formData.append('media', content) 
    } else {
      const audioBlob = await fetch(content.content).then((r) => r.blob())
      const audioFile = new File([audioBlob], filename, { type: stepType === 'Audio' ? 'audio/wav' : 'video/mp4' })
      formData.append('media', audioFile) 
    }
    axios.post('messages/upload', formData, { "Content-Type": "multipart/form-data" }).then(() => {
      socket.emit('broadMessage', { user: authStore.userData, room: JSON.parse(localStorage.getItem("room")), message: stepType === 'File' ? content.name : filename, stepType, flowId: params.flowId || flowId, msgCnt: msgCnt.msgCnt, chatData: msgCnt.chatData })
    })
  }

  const stepTypes = [
    {
      id: 1,
      title: 'Audio',
      icon: audioIcon,
      content: <AddStepAudio stepType={'Audio'} handleAddStep={handleAddStep} />
    },
    {
      id: 2,
      title: 'Video',
      icon: videoIcon,
      content: <AddStepVideo stepType={'Video'} handleAddStep={handleAddStep} />
    },
    {
      id: 3,
      title: 'File',
      icon: fileIcon,
      content: <AddStepFile stepType={'File'} handleAddStep={handleAddStep} />
    }
  ]

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  useEffect(() => {
    socket.on("UserJoined", data => {
      axios.get(`rooms`)
        .then(res => {
          console.log("Rooms", res)
          setRooms(res.data.rooms)
        })
        .catch(error => {
          console.log('error:', error)
        })
      // console.log("DATA:::", data)
      if (authStore.userData._id === data.room.creator) {
        console.log("CreatorJoined", data)
        localStorage.setItem("room", JSON.stringify(data.room))
      } else {
        console.log("InvitorJoined")
      }
    })
  }, [socket])

  useEffect(() => {
    //creating the room
    async function fetchData() {
      dispatch(handleClearTempStep())
      const demoContact = await axios.get(`rooms/getDemoContact`)
      setDemoRoom(demoContact.data.room)
      console.log(demoContact)
      if (params.flowId) {
        axios
          .get(`rooms/getByFlowId/${params.flowId}`)
          .then(res => {
            console.log("CONSOLE", res.data.room)
            socket.emit('JoinRoom', { room: res.data.room, user: authStore.userData })
            setActiveRoom({
              id: res.data.room._id,
              creator: res.data.room.creator
            })
            //if the user is Invited
            if (res.data.room.creator !== authStore.userData._id) {
              axios
                .put(`rooms/update/${params.flowId}`)
                .then(res => {
                  localStorage.setItem("room", JSON.stringify(res.data.room))
                  socket.emit('JoinRoom', { room: res.data.room, user: authStore.userData })
                })
            }

            axios
              .get(`messages/getByFlowId/${params.flowId}`)
              .then(res => {
                console.log("Get messages", res)
                setMessages(res.data.messages)
              })
          })
      } else {
        
        if (demoContact.data.room) {
          socket.emit('JoinRoom', { room: demoContact.data.room, user: authStore.userData })
          setActiveRoom({
            id: demoContact.data.room._id,
            creator: demoContact.data.room.creator
          })
          setFlowId(demoContact.data.room.flow_id)
          //if the user is Invited
          if (demoContact.data.room.creator !== authStore.userData._id) {
            axios
              .put(`rooms/update/${demoContact.data.room.flow_id}`)
              .then(res => {
                localStorage.setItem("room", JSON.stringify(res.data.room))
                socket.emit('JoinRoom', { room: res.data.room, user: authStore.userData })
              })
          }

          axios
            .get(`steps/getDefaultSteps/conversation`)
            .then(res => {
              console.log("Get messages", res)
              setMessages(res.data.steps.map((eachStep) => {
                return {
                  content: eachStep.content,
                  stepType: eachStep.stepType,
                  from: {
                    _id: demoContact.data.room.creator._id,
                    name: demoContact.data.room.creator.name
                  }
                }
              }))
            })
        } else {
          setMessages(defaultSteps.map((eachStep) => {
            return {
              content: eachStep.content,
              stepType: eachStep.stepType,
              from: {
                name: 'Demo Contact'
              }
            }
          }))
        }
        // axios.get('/steps/getDefaultSteps/conversation')
        //   .then((res) => {
        //     // if (authStore.userData.)
        //     setMessages(res.data.steps.map((eachStep) => {
        //       return {
        //         content: eachStep.content,
        //         stepType: eachStep.stepType,
        //         from: {
        //           name: "Demo Contact"
        //         }
        //       }
        //     }))
        // })
      }

      axios.get(`rooms`)
        .then(res => {
          console.log("||||||||", res)
          // setActiveRoom(res.data.rooms[0].flow_id)
          setRooms(res.data.rooms)
        })
        .catch(error => {
          console.log('error:', error)
        })
    }
    fetchData()
  }, [])

  const handleFilter = e => {
    setSearchValue(e.target.value)
  }

  // const changeRoom = e => {
  //   console.log("changeRoom", e)
  // }

  const toggleRoom = room => {
    console.log("ROOMTOGGLE", room)
    if (activeRoom.id !== room._id) {
      navigate(`/conversations/${room.flow_id}`)
      setActiveRoom({
            id: room._id,
            creator: room.creator
      })
      axios
        .get(`messages/getByFlowId/${room.flow_id}`)
        .then(res => {
          console.log("Get messages", res)
          setMessages(res.data.messages)
        })
    }
  }

  const toggleDemoRoom = () => {
    if (activeRoom.id !== demoRoom._id) {
      navigate(`/conversations`)
    }
  }

  const handleShowModal = () => {
    console.log('aaa')
    setCenteredModal(true)
  }

  const handleSetCenteredModal = (data) => {
    setCenteredModal(data)
  }

  const handleShowCreateFlow = (data) => {
    setShowCreateFlow(data)
  }

  const handleShowAttachment = (id) => {
    setShowAttachment({ value: true, id })
    toggle(id)
  }

  return (
    <Fragment>

      <Helmet>
        <meta charSet="utf-8" />
        <title> Conversations | {APP_NAME}</title>
        <meta name="description" content="Your conversations on Before We Talk."/>
        <meta NAME="robots" CONTENT="noindex"/>
      </Helmet>

      <h1 className='display-3 mb-2'>Your conversations</h1>
      {showCreateFlow && 
        <>
          <Row className={style.createFlowMainBox}>
            <Col sm='4' className={style.createFlowImageMainBox}>
              <img src={manIcon} className={style.manStyle} />
              <img src={leafIcon} className={style.leafStyle} />
            </Col>
            <Col sm='8' className={style.createFlowContentMainBox}>
              <div className={style.contentBox}>
                Nice! You just saved yourself time in a meeting. Now, create your own conversation flow to share with someone else! Click Create Flow button.
              </div>
              <div className={style.contentFooter}>
              <button type="button" class={`btn btn-primary ${style.createFlowButton}`} onClick={() => {
                navigate(`/flows`)
                }} >Create Flow</button>
              </div>
              <img src={leafIcon} className={style.contentLeafStyle} />
            </Col>
          </Row>
          <Row className={style.createNextStep}>
            <Col className={style.nextStepTitle}>Next Steps</Col>
            <Col className={style.nextStepContent}>Next step - share your saved flow URL to start conversations</Col>
          </Row>
        </>
      }
      {rooms.length !== 0 && <h3 className='mb-2'>Your contacts and conversations live here. Share your flow to get more conversations</h3>}
      <Row>
        <Col sm='4' style={{position: "relative"}}>
          {rooms.length !== 0 && (
            <>
              <InputGroup className='input-group-merge mb-2'>
                <Input
                  placeholder='Search Flow...'
                  className='dataTable-filter'
                  type='text'
                  bsSize='sm'
                  id='search-input'
                  value={searchValue}
                  onChange={handleFilter}
                />
                <InputGroupText>
                  <Search size={20} />
                </InputGroupText>
              </InputGroup>
              <Card className='mb-4' style={{ height: "300px", overflowY: "auto" }}>
                <ListGroup flush>
                  {(
                    <ListGroupItem
                      className={classnames('cursor-pointer', {
                        active: activeRoom.id === demoRoom._id
                      })}
                      onClick={() => toggleDemoRoom()}
                      action >
                      <div className='d-flex align-items-center'>
                        <Avatar color="light-secondary" style={{ borderRadius: "20%" }} status='online' content={demoRoom && demoRoom.creator ? demoRoom.creator.name : `Demo Contact`} initials />
                        <div className='user-info text-truncate ms-1'>
                          <span className='d-block fw-bold text-truncate'>{`Demo Contact`}</span>
                        </div>
                      </div>
                    </ListGroupItem>
                  )}
                  {rooms.filter(room => room.invited_user && room.invited_user.name.toLowerCase().includes(searchValue)).map(room => (
                    <ListGroupItem
                      className={classnames('cursor-pointer', {
                        active: activeRoom.id === room._id
                      })}
                      onClick={() => toggleRoom(room)}
                      action >
                      <div className='d-flex align-items-center'>
                        <Avatar color={activeRoom.id === room._id ? 'secondary' : 'light-secondary'} style={{ borderRadius: "20%" }} status='online' content={room.creator._id === authStore.userData._id ? room.invited_user.name : room.creator.name} initials />
                        <div className='user-info text-truncate ms-1'>
                          <span className='d-block fw-bold text-truncate'>{room.creator._id === authStore.userData._id ? room.invited_user.name : room.creator.name}</span>
                        </div>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Card>
            </>
          )}
          {rooms.length === 0 && (
            <div className='d-flex align-items-center'>
              <Avatar color="light-secondary" style={{ borderRadius: "20%" }} status='online' content={demoRoom && demoRoom.creator ? demoRoom.creator.name : `Demo Contact`} initials />
              <div className='user-info text-truncate ms-1'>
                <span className='d-block fw-bold text-truncate'>{`Demo Contact`}</span>
              </div>
            </div>
          )}
          {centeredModal && <NameRequestModal setCenteredModal={handleSetCenteredModal} />}
        </Col>
        <Col sm='8'>
          <CardChat messages={messages} flowId={params.flowId || flowId} handleShowModal={handleShowModal} handleShowCreateFlow={handleShowCreateFlow} handleShowAttachment={handleShowAttachment} rooms={rooms} setMsgCnt={setMsgCnt} />
          {showAttachment.value && (
            <div className='mb-3'>
              <Nav tabs justified>
                {stepTypes.map(item => (
                  <NavItem key={item.id}>
                    <NavLink
                      active={active === item.id}
                      onClick={() => {
                        toggle(item.id)
                      }}
                    >
                      <img src={item.icon} />
                      <span className='align-middle mx-1'>{item.title}</span>
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
              <TabContent className='py-50' activeTab={active}>
                {stepTypes.map(item => (
                  <TabPane tabId={item.id} key={item.id}>
                    {item.content}
                  </TabPane>
                ))}
              </TabContent>
            </div>

          )}
        </Col>
      </Row>
    </Fragment >
  )
}

export default Conversations

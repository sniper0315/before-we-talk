// ** React Imports
import Avatar from '@components/avatar'
import { useEffect, useState } from 'react'
import axios from "axios"
import { useSelector } from 'react-redux'
// import { socket } from '../../utils/helper'

// ** Custom Components
import AudioWavesurfer from '../components/audioWavesurfer'
import CustomVideoPlayer from '../components/customVideoPlayer'

// ** Third Party Components
// import profilePic from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import classnames from 'classnames'
import { Image, Send } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Reactstrap Imports
import { Button, Card, CardHeader, Form, Input, InputGroup, InputGroupText, Label } from 'reactstrap'

// ** Images
// ** Styles
import '@styles/base/pages/app-chat-list.scss'
import style from './Conversation.module.css'

const attachmentIcon = require('@src/assets/images/icons/custom/conversation/attachment.svg').default
const cameraIcon = require('@src/assets/images/icons/custom/conversation/camera.svg').default
const recordingIcon = require('@src/assets/images/icons/custom/conversation/recording.svg').default
const sendIcon = require('@src/assets/images/icons/custom/conversation/send.svg').default
// const data = {
//   chat: {
//     id: 2,
//     userId: 1,
//     unseenMsgs: 0,
//     chat: [
//       {
//         message: "How can we help? We're here for you!",
//         time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
//         senderId: 11
//       },
//       {
//         message: 'Hey John, I am looking for the best admin template. Could you please help me to find it out?',
//         time: 'Mon Dec 10 2018 07:45:23 GMT+0000 (GMT)',
//         senderId: 1
//       },
//       {
//         message: 'It should be Bootstrap 5 compatible.',
//         time: 'Mon Dec 10 2018 07:45:55 GMT+0000 (GMT)',
//         senderId: 1
//       },
//       { message: 'Absolutely!', time: 'Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)', senderId: 11 },
//       {
//         message: 'Modern admin is the responsive bootstrap 5 admin template.!',
//         time: 'Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)',
//         senderId: 11
//       },
//       { message: 'Looks clean and fresh UI.', time: 'Mon Dec 10 2018 07:46:23 GMT+0000 (GMT)', senderId: 1 },
//       { message: "It's perfect for my next project.", time: 'Mon Dec 10 2018 07:46:33 GMT+0000 (GMT)', senderId: 1 },
//       { message: 'How can I purchase it?', time: 'Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)', senderId: 1 },
//       { message: 'Thanks, from ThemeForest.', time: 'Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)', senderId: 11 },
//       { message: 'I will purchase it for sure. 👍', time: '2020-12-08T13:52:38.013Z', senderId: 1 }
//     ]
//   },
//   contact: {
//     id: 1,
//     fullName: 'Felecia Rower',
//     avatar: require('@src/assets/images/portrait/small/avatar-s-20.jpg').default,
//     status: 'away'
//   }
// }

const CardChat = ({ messages, flowId, handleShowModal, handleShowCreateFlow, handleShowAttachment, rooms, setMsgCnt }) => {

  const initialChatData = {
    chat: [],
    contact: {
      id: 1,
      fullName: 'Felecia Rower',
      avatar: require('@src/assets/images/portrait/small/avatar-s-20.jpg').default,
      status: 'away'
    }
  }

  // ** States
  const [inputmsg, setInputMsg] = useState('')
  const [chatRef, setChatRef] = useState(null)
  const [chatData, setChatData] = useState(initialChatData)
  // const [url, setUrl] = useState()
  const authStore = useSelector(state => state.auth)
  const socket = authStore.socketObject
  const room = JSON.parse(localStorage.getItem("room"))
  console.log("Auth", authStore)

  const getBlobUrl = async (filename, stepType) => {
    console.log('filename', filename)
    if ((stepType !== 'Audio' && stepType !== 'Video') || (filename.substr(-3) !== 'wav' && filename.substr(-3) !== 'mp4')) return ''
    const response = await axios({
      url: `${process.env.REACT_APP_API_URL}/messages/download/${filename}`,
      method: 'GET'
    })
    console.log('bloib', response)
    const array = new Uint8Array(response.data.data)
    const blob = new Blob([array])
    const blobUrl = URL.createObjectURL(blob)
    return blobUrl
    // setUrl(blobUrl)
  }

  useEffect(() => {
    let isMounted = true
    const newMsg = { ...chatData }
    Promise.all(messages.map((msg) => {
      const func = new Promise(resolve => {
        getBlobUrl(msg.content, msg.stepType)
          .then(blobUrl => {
            console.log(msg)
            // newMsg.chat.push()
            resolve({
              message: msg.content,
              blobUrl,
              stepType: msg.stepType,
              time: msg.date ? new Date(msg.date) : new Date(),
              senderId: msg.from._id,
              user: {
                name: msg.from.name
              }
            })
        })
      })
      return func
    })).then((result) => {
      if (isMounted) {
        newMsg.chat = [...newMsg.chat, ...result]
        console.log(newMsg)
        setChatData(newMsg)
        setInputMsg('')
        setMsgCnt({
          msgCnt: newMsg.chat.length,
          chatData
        })
      }
    })
    return () => { isMounted = false }
  }, [messages])

  const handleFileDownload = (filename) => {
    const FileDownload = require('js-file-download')
    axios({
      url: `${process.env.REACT_APP_API_URL}/messages/download/${filename}`,
      method: 'GET'
    }).then((response) => {
      const array = new Uint8Array(response.data.data)
      const blob = new Blob([array])
        FileDownload(blob, filename)
    })
    // console.log('filename', filename)
  }
  //** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog = []
    if (chatData) {
      chatLog = chatData.chat
    }
    console.log('chatData', chatData)
    const formattedChatLog = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined
    let msgGroup = {
      senderId: chatMessageSenderId,
      time: chatLog[0] ? chatLog[0].time : undefined,
      name: chatLog[0] ? chatLog[0].user.name : '',
      messages: []
    }
    chatLog.forEach((msg, index) => {
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          msg: msg.message,
          stepType: msg.stepType,
          blobUrl: msg.blobUrl,
          time: msg.time
        })
      } else {
        chatMessageSenderId = msg.senderId
        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.senderId,
          time: msg.time,
          name: msg.user.name,
          messages: [
            {
              msg: msg.message,
              stepType: msg.stepType,
              blobUrl: msg.blobUrl,
              time: msg.time
            }
          ]
        }
      }
      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })
    console.log(formattedChatLog)
    return formattedChatLog
  }

  function formatAMPM(date) {
    console.log(date)
    const tDate = new Date(date)
    console.log(tDate)
    let hours = tDate.getHours()
    let minutes = tDate.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    minutes = minutes < 10 ? `0${minutes}` : minutes
    const strTime = `${hours}:${minutes} ${ampm}`
    return strTime
  }
  //** Renders user chat
  const renderChats = () => {
    console.log('formattedChatData()', formattedChatData())
    return formattedChatData().map((item, index) => {
      return (
        <div
          key={index}
          className={classnames('chat', {
            'chat-left': ((authStore.userData !== {} && item.senderId === authStore.userData._id) || (authStore.userData === {} && item.senderId))
          })}
        >
          <div className='chat-avatar'>
            {/* <Avatar
              className='box-shadow-1 cursor-pointer'
              img={authStore.userData !== {} && item.senderId === authStore.userData._id ? profilePic : chatData.contact.avatar}
            /> */}
            <Avatar color="light-secondary" style={{ borderRadius: "20%" }} status='online' content={item.name} initials />
          </div>

          <div className='chat-body'>
            <>
              <div className={`chat-content ${style.chatTime} ${authStore.userData !== {} && item.senderId === authStore.userData._id ? style.directionRTL : ''}`}>
                <span className={style.inlineBlock}>{formatAMPM(item.time)}</span>
                <span className={`${style.inlineBlock} ${authStore.userData !== {} && item.senderId === authStore.userData._id ? style.paddingRight10 : style.paddingLeft10}`}>{item.name}</span>
              </div>
            </>
            {item.messages.map(chat => (
              <>
                <div key={chat.msg} className='chat-content'>
                  {chat.stepType === 'Audio' ? <AudioWavesurfer audioUrl={ chat.blobUrl } audioSelector={ `waveform${(new Date()).getTime()}` } /> : '' }
                  { chat.stepType === 'Video' ? <CustomVideoPlayer videoUrl={ chat.blobUrl } videoSelector={ `videoplayer${(new Date()).getTime()}` } /> : '' }
                  { chat.stepType === 'File' ? <a src={chat.msg} controls width={300} height={200} onClick={ () => handleFileDownload(chat.msg)} >{chat.msg}</a> : '' }
                  { chat.stepType === 'URL' ? <a href={chat.msg} target="_blank">{chat.msg}</a> : '' }
                  { chat.stepType === 'Text' ? <p>{chat.msg}</p> : '' }
                </div>
              </>
            ))}
          </div>
        </div>
      )
    })
  }

  //** Scroll to chat bottom
  const scrollToBottom = () => {
    chatRef.scrollTop = Number.MAX_SAFE_INTEGER
  }

  useEffect(() => {
    if (chatRef !== null) {
      scrollToBottom()
    }
  }, [chatRef, chatData.chat.length])

  useEffect(() => {
    const handler = data => {
      const location = window.location.pathname.split('/')
      if (location[1] !== 'conversations') {
        document.title = 'Unread Messages - Before We Talk'
      } else {
        document.title = 'Vuexy - React Admin Dashboard Template'
      }
      getBlobUrl(data.message, data.stepType).then((blobUrl) => {
        const newMsg = { ...data.chatData }
        console.log('sendmessage', chatData)
        newMsg.chat.push({
          message: data.message,
          time: new Date(),
          blobUrl,
          stepType: data.stepType,
          senderId: data.user._id,
          user: {
            name: data.user.name
          }
        })
        setChatData(newMsg)
        setInputMsg('')
        setMsgCnt({
          msgCnt: newMsg.chat.length,
          chatData
        })
      })
    }

   socket.on("sendMessage", handler)

   return () => socket.off("sendMessage", handler)
    // if (socket) {
    //   socket.on("sendMessage", )
    // }
  }, [socket])

  const handleSendMsg = e => {
    e.preventDefault()

    if (rooms.length === 0) {
      handleShowCreateFlow(true)
      return
    }

    if (authStore.userData && authStore.userData.name && !authStore.userData.name.trim().length) {
      handleShowModal()
      return
    }
    if (inputmsg.trim().length) {
      socket.emit('newMessage', { user: authStore.userData, room, message: inputmsg, flowId, stepType: 'Text', msgCnt: chatData.chat.length, chatData })
    }
  }

  const handleSendAttachment = (e, id) => {
    e.preventDefault()

    if (rooms.length === 0) {
      handleShowCreateFlow(true)
      return
    }

    if (authStore.userData && authStore.userData.name && !authStore.userData.name.trim().length) {
      handleShowModal()
      return
    }

    handleShowAttachment(id)
  }

  const handleTrackLastActionTime = () => {
    socket.emit('messageStatus', { user: authStore.userData, room, flowId })
  }

  return (
    <Card className={`chat-widget ${style.noBoxShadow}`} onClick={ handleTrackLastActionTime }>
      {/* <CardHeader>
        <div className='d-flex align-items-center'>
          <Avatar color="light-secondary" style={{ borderRadius: "20%" }} status='online' content={authStore.userData.name ? authStore.userData.name : 'Demo Contact'} initials />
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>{authStore.userData.name ? authStore.userData.name : 'Demo Contact'}</span>
          </div>
        </div>
      </CardHeader> */}
      <div className='chat-app-window'>
        <PerfectScrollbar
          containerRef={el => setChatRef(el)}
          className='user-chats scroll-area'
          options={{ wheelPropagation: false }}
        >
          <div className='chats'>{renderChats()}</div>
        </PerfectScrollbar>
        <Form className='chat-app-form' onSubmit={e => handleSendMsg(e)}>
          <InputGroup className='input-group-merge me-1 form-send-message'>
            <InputGroupText>
              <Label className='attachment-icon mb-0' for='attach-doc'>
                <Image className='cursor-pointer text-secondary' size={14} />
                <input type='file' id='attach-doc' hidden />
              </Label>
            </InputGroupText>
            <Input
              value={inputmsg}
              className='border-0'
              onChange={e => setInputMsg(e.target.value)}
              placeholder='Type your message'
            />
          </InputGroup>
          {/* <Button className='send' color='primary'>
            <Send size={14} className='d-lg-none' />
            <span className='d-none d-lg-block'>Send</span>
          </Button> */}
          <Button
            type="button"
            color="link"
            onClick={e => handleSendAttachment(e, 3)}
            className="px-0 py-0 me-2"
          >
            <img src={attachmentIcon} />
          </Button>
          <Button
            type="button"
            color="link"
            onClick={e => handleSendAttachment(e, 2)}
            className="px-0 py-0 me-2"
          >
            <img src={cameraIcon} />
          </Button>
          <Button
            type="button"
            color="link"
            onClick={e => handleSendAttachment(e, 1)}
            className="px-0 py-0 me-2"
          >
            <img src={recordingIcon} />
          </Button>
          <Button
            type="submit"
            color="primary"
            className={`${style.p07} rounded-circle`}
          >
            <img src={sendIcon} />
          </Button>
        </Form>
      </div>
    </Card>
  )
}

export default CardChat

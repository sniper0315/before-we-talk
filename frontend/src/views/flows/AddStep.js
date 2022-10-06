// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import style from './AddStep.module.css'

// ** Icons Imports
const audioIcon = require('@src/assets/images/icons/custom/audio.svg').default
const videoIcon = require('@src/assets/images/icons/custom/video.svg').default
const textIcon = require('@src/assets/images/icons/custom/text.svg').default
const urlIcon = require('@src/assets/images/icons/custom/url.svg').default
const fileIcon = require('@src/assets/images/icons/custom/file.svg').default

// Components
import AddStepAudio from './AddStepAudio'
import AddStepFile from './AddStepFile'
import AddStepText from './AddStepText'
import AddStepURL from './AddStepURL'
import AddStepVideo from './AddStepVideo'

const AddStep = ({ handleAddStep }) => {
  // ** States
  const [active, setActive] = useState(1)

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
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
      title: 'Text',
      icon: textIcon,
      content: <AddStepText stepType={'Text'} handleAddStep={handleAddStep} />
    },
    {
      id: 4,
      title: 'URL',
      icon: urlIcon,
      content: <AddStepURL stepType={'URL'} handleAddStep={handleAddStep} />
    },
    {
      id: 5,
      title: 'File',
      icon: fileIcon,
      content: <AddStepFile stepType={'File'} handleAddStep={handleAddStep} />
    }
  ]

  return (
    <Fragment>
      <div className='mb-3'>
        <Nav tabs justified>
          {stepTypes.map(item => (
            <NavItem key={item.id}>
              <NavLink
                className={style.addStepTab}
                active={active === item.id}
                onClick={() => {
                  toggle(item.id)
                }}
              >
                <img src={item.icon} className='addStepIconImg' />
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
    </Fragment>
  )
}

export default AddStep

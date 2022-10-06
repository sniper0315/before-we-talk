// ** React Imports
import { useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { handleMenuCollapsed, handleContentWidth, handleMenuHidden } from '@store/layout'
import { handleLogin, handleUpdateUser, handleLogout } from '@store/authentication'

// ** Third Party Components
import * as Icon from 'react-feather'
import classnames from 'classnames'
import { ArrowUp } from 'react-feather'
// ** Reactstrap Imports
import { Navbar, NavbarBrand, Button, UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle, NavItem, NavLink } from 'reactstrap'

// ** Configs
import themeConfig from '@configs/themeConfig'

// ** Import Axios
import axios from 'axios'

// ** Custom Components

import Avatar from '@components/avatar'
import Customizer from '@components/customizer'
import ScrollToTop from '@components/scrolltop'
import FooterComponent from './components/footer'
import NavbarComponent from './components/navbar'
import SidebarComponent from './components/menu/vertical-menu'
import ModalSignUp from './components/ModalSignUp'
import ModalCheckEmail from './components/ModalCheckEmail'
import ModalSuccess from './components/ModalSuccess'
import ModalFailed from './components/ModalFailed'

// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'
import { useSkin } from '@hooks/useSkin'
import { useLayout } from '@hooks/useLayout'
import { useNavbarType } from '@hooks/useNavbarType'
import { useFooterType } from '@hooks/useFooterType'
import { useNavbarColor } from '@hooks/useNavbarColor'

// ** Styles
import '@styles/base/core/menu/menu-types/vertical-menu.scss'
import '@styles/base/core/menu/menu-types/vertical-overlay-menu.scss'

const VerticalLayout = props => {
  // ** Props
  const { menu, footer, children, menuData } = props
  // ** Hooks
  const [isRtl, setIsRtl] = useRTL()
  const { skin, setSkin } = useSkin()
  const { navbarType, setNavbarType } = useNavbarType()
  const { footerType, setFooterType } = useFooterType()
  const { navbarColor, setNavbarColor } = useNavbarColor()
  const { layout, setLayout, setLastLayout } = useLayout()

  // ** States
  const [isMounted, setIsMounted] = useState(false)
  const [menuVisibility, setMenuVisibility] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [filteredMenuData, setMenuData] = useState(menuData)
  const [signupModal, setSignupModal] = useState(false)
  const [checkEmailModal, setCheckEmailModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [failedModal, setFailedModal] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [rooms, setRooms] = useState([])

  // ** Vars
  const dispatch = useDispatch()
  const layoutStore = useSelector(state => state.layout)
  const authStore = useSelector(state => state.auth)
  const socket = authStore.socketObject

    // ** Search Params
  const [searchParams, setSearchParams] = useSearchParams()

  // ** Update Window Width
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }

  // ** Vars
  const location = useLocation()
  const isHidden = layoutStore.menuHidden
  const contentWidth = layoutStore.contentWidth
  const menuCollapsed = layoutStore.menuCollapsed

  // ** Toggles Menu Collapsed
  const setMenuCollapsed = val => dispatch(handleMenuCollapsed(val))

  // ** Handles Content Width
  const setContentWidth = val => dispatch(handleContentWidth(val))

  // ** Handles Content Width
  const setIsHidden = val => dispatch(handleMenuHidden(val))

  // ** Handles Sending email with a magic link
  const handleSendMagicLink = inputEmail => {
    axios.post('/auth/sendConfirmEmail', { email: inputEmail, url: window.location.href }).then(res => {
      console.log(res)
      setSignupModal(false)
      setCheckEmailModal(true)
      setEmail(inputEmail)
    }).catch(err => console.log('error:', err))
  }

  // ** Handles saving name
  const handleSaveName = inputName => {
    console.log(inputName)
    if (inputName) {
      axios.post('auth/user/update', { name: inputName })
        .then(res => {
          console.log(res)
          const data = { ...res.data.user }
          dispatch(handleUpdateUser(data))
          setSuccessModal(false)
          setSearchParams({})
        })
        .catch(error => {
          console.log('error:', error)
        })
    }
  }

  // ** Handles Log out
  const logout = () => {
    console.log('logout')
    dispatch(handleLogout())
    window.location.href = '/flows'
  }

  //** Get query string of confirmationCode
  useEffect(() => {
    console.log('searchParams', searchParams)
    if (searchParams.get('confirmationCode')) {
      // Confirm auth code and login if correct
      axios.get(`auth/confirm/${searchParams.get('confirmationCode')}`)
        .then(res => {
          console.log(res)
          const data = { ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken, tempStep: res.data.tempStep }
          dispatch(handleLogin(data))
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
          setSuccessModal(true)
        })
        .catch(error => {
          console.log('error:', error)
          setFailedModal(true)
        })
    }
  }, [searchParams])

  //** This function will detect the Route Change and will hide the menu on menu item click
  useEffect(() => {
    if (menuVisibility && windowWidth < 1400) {
      console.log('aaaaaaaaaaaaaaaaaaaa')
      setMenuVisibility(false)
    }
  }, [location])

  //** Sets Window Size & Layout Props
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener('resize', handleWindowWidth)
    }

    if (windowWidth > 479) {
      const newMenu = menuData.filter((e, index) => {
        return index !== 0 && ((rooms.length === 0 && e.id !== "savedFlows") || rooms.length !== 0)
      }).map(e => {
        if (rooms.length === 0 && e.id === 'flows') {
          return { ...e, title: 'Create Flow' }
        } else {
          return e
        }
      })
      setMenuData(newMenu)
    } else {
      const newMenu = menuData.filter((e) => {
        return ((rooms.length === 0 && e.id !== "savedFlows") || rooms.length !== 0)
      }).map(e => {
        if (rooms.length === 0 && e.id === 'flows') {
          return { ...e, title: 'Create Flow' }
        } else {
          return e
        }
      })
      setMenuData(newMenu)
    }
  }, [windowWidth, menuData, rooms])

  //** Sets navbar user name
  useEffect(() => {
    if (authStore?.userData) {
      console.log(authStore?.userData)
      setName(authStore?.userData?.name || authStore?.userData?.fullName)
      axios.get(`flows`)
        .then(res => {
          setRooms(res.data.flows)
        })
        .catch(error => {
          setRooms([])
          console.log('error:', error)
        })
    }
  }, [authStore])

  useEffect(() => {
    if (socket) {
      socket.on('flow', () => {
        axios.get(`flows`)
        .then(res => {
          setRooms(res.data.flows)
        })
        .catch(error => {
          setRooms([])
          console.log('error:', error)
        })
      })
    }
  }, [socket])

  //** ComponentDidMount
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // ** Vars
  const footerClasses = {
    static: 'footer-static',
    sticky: 'footer-fixed',
    hidden: 'footer-hidden'
  }

  const navbarWrapperClasses = {
    floating: 'navbar-floating',
    sticky: 'navbar-sticky',
    static: 'navbar-static',
    hidden: 'navbar-hidden'
  }

  const navbarClasses = {
    floating: contentWidth === 'boxed' ? 'floating-nav container-xxl' : 'floating-nav',
    sticky: 'fixed-top',
    static: 'navbar-static-top',
    hidden: 'd-none'
  }

  const bgColorCondition = navbarColor !== '' && navbarColor !== 'light' && navbarColor !== 'white'

  if (!isMounted) {
    return null
  }
  return (
    <div
      className={classnames(
        `wrapper vertical-layout ${navbarWrapperClasses[navbarType] || 'navbar-floating'} ${
          footerClasses[footerType] || 'footer-static'
        }`,
        {
          // Modern Menu
          'vertical-menu-modern': windowWidth >= 1400,
          'menu-collapsed': menuCollapsed && windowWidth >= 1400,
          'menu-expanded': !menuCollapsed && windowWidth >= 1400,

          // Overlay Menu
          'vertical-overlay-menu': windowWidth < 1400,
          'menu-hide': !menuVisibility && windowWidth < 1400,
          'menu-open': menuVisibility && windowWidth < 1400
        }
      )}
      {...(isHidden ? { 'data-col': '1-column' } : {})}
    >
      {!isHidden ? (
        <SidebarComponent
          skin={skin}
          menu={menu}
          menuData={filteredMenuData}
          menuCollapsed={menuCollapsed}
          menuVisibility={menuVisibility}
          setMenuCollapsed={setMenuCollapsed}
          setMenuVisibility={setMenuVisibility}
        />
      ) : null}
      <Navbar
        expand='lg'
        container={false}
        light={skin !== 'dark'}
        dark={skin === 'dark' || bgColorCondition}
        color={bgColorCondition ? navbarColor : undefined}
        className={classnames(
          `header-navbar navbar align-items-center top-bar ${navbarClasses['static'] || 'floating-nav'}`
        )}
      >
        {/* <div className='navbar-container d-flex content'> */}
        
        <ul className='navbar-nav d-none d-mobile-small-block'>
          <NavItem className='mobile-menu me-auto'>
            <NavLink className='nav-menu-main menu-toggle hidden-xs is-active' onClick={() => setMenuVisibility(true)}>
              <Icon.Menu className='ficon' />
            </NavLink>
          </NavItem>
        </ul>
        
        <NavbarBrand href="/" className='d-none d-large-block d-mobile-small-none'>
          <img
            alt="logo"
            src={themeConfig.app.appLogoImage}
            style={{
              height: 40,
              width: 40
            }}
          />
        </NavbarBrand>
        
        <div className='d-flex d-mobile-small-none flex-grow-1'>
          <NavbarBrand href="/" className='font-size-1 d-block d-mobile-none'>
            HOW IT WORK{name}
          </NavbarBrand>
          <UncontrolledButtonDropdown className={classnames(`nav-dropdown top-bar-dropdown`)}>
            <DropdownToggle className='nav-dropdown-toggle' color='flat-secondary' caret>
              <span className='font-weight-light'>{rooms.length > 0 ? 'Your Flows' : 'Create Flow'}</span>
            </DropdownToggle>
            <DropdownMenu className='top-1-5'>
              <DropdownItem href='/flows' tag='a'>{rooms.length > 0 ? 'Your Flows' : 'Create Flow'}</DropdownItem>
              <DropdownItem href='/savedFlows' tag='a'>Saved Flows</DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          <NavbarBrand href="/conversations" className='font-size-1'>
            Conversation
          </NavbarBrand>
        </div>

        {name ? (
          <div className='d-flex'>
            <UncontrolledButtonDropdown className={classnames(`nav-dropdown top-bar-dropdown`)}>
              <DropdownToggle className='nav-dropdown-toggle' color='flat-secondary' caret>
                <Avatar className='nav-dropdown-toggle-avatar' color='light-primary' content={name} size='lg' initials />
                <span>Hi,</span>{' '}
                <span className='text-bolder text-dark'>{name.split(' ')[0]}</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href='/accountSettings' tag='a'>Account Settings</DropdownItem>
                {/* <DropdownItem href='/defaultSteps' tag='a'>Default Steps</DropdownItem> */}
                <DropdownItem href='/flows' tag='a'>Flows</DropdownItem>
                <DropdownItem href='/conversations' tag='a'>Conversation</DropdownItem>
                <DropdownItem onClick={() => logout()} tag='div' className='d-none d-large-block'>Log out</DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <Button.Ripple color='primary' outline className="primary-btn d-block d-large-none" onClick={() => logout()}>
              Log out
            </Button.Ripple>
          </div>
        ) : (
          <Button.Ripple color='primary' className="primary-btn" onClick={() => setSignupModal(!signupModal)}>
            Sign Up
          </Button.Ripple>
        )}
        
        <ModalSignUp signupModal={signupModal} setSignupModal={setSignupModal} handleSendMagicLink={handleSendMagicLink} />

        <ModalCheckEmail checkEmailModal={checkEmailModal} setCheckEmailModal={setCheckEmailModal} email={email} />

        <ModalSuccess successModal={successModal} setSuccessModal={setSuccessModal} handleSaveName={handleSaveName} />
        
        <ModalFailed failedModal={failedModal} setFailedModal={setFailedModal} />
        
      </Navbar>

      {children}

      {/* Vertical Nav Menu Overlay */}
      <div
        className={classnames('sidenav-overlay', {
          show: menuVisibility
        })}
        onClick={() => setMenuVisibility(false)}
      ></div>
      {/* Vertical Nav Menu Overlay */}

      {themeConfig.layout.customizer === true ? (
        <Customizer
          skin={skin}
          isRtl={isRtl}
          layout={layout}
          setSkin={setSkin}
          setIsRtl={setIsRtl}
          isHidden={isHidden}
          setLayout={setLayout}
          footerType={footerType}
          navbarType={navbarType}
          setIsHidden={setIsHidden}
          themeConfig={themeConfig}
          navbarColor={navbarColor}
          contentWidth={contentWidth}
          setFooterType={setFooterType}
          setNavbarType={setNavbarType}
          setLastLayout={setLastLayout}
          menuCollapsed={menuCollapsed}
          setNavbarColor={setNavbarColor}
          setContentWidth={setContentWidth}
          setMenuCollapsed={setMenuCollapsed}
        />
      ) : null}
      <footer
        className={classnames(`footer footer-light ${footerClasses[footerType] || 'footer-static'}`, {
          'd-none': footerType === 'hidden'
        })}
      >
        {footer ? footer : <FooterComponent footerType={footerType} footerClasses={footerClasses} />}
      </footer>
      

      {themeConfig.layout.scrollTop === true ? (
        <div className='scroll-to-top'>
          <ScrollToTop showOffset={300} className='scroll-top d-block'>
            <Button className='btn-icon' color='primary'>
              <ArrowUp size={14} />
            </Button>
          </ScrollToTop>
        </div>
      ) : null}
    </div>
  )
}

export default VerticalLayout

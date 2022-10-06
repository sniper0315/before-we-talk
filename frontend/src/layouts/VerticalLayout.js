// ** React Imports
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import navigation from '@src/navigation/vertical'
import noAuthNavigation from '@src/navigation/vertical/noAuthNavigation'

const VerticalLayout = props => {
  const authStore = useSelector(state => state.auth)
  console.log('bbb', authStore.userData.name)
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  return (
    <Layout menuData={authStore.userData.name ? navigation : noAuthNavigation} {...props}>
      <Outlet />
    </Layout>
  )
}

export default VerticalLayout

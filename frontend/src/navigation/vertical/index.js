// ** Navigation imports
// import apps from './apps'
// import charts from './charts'
// import dashboards from './dashboards'
// import forms from './forms'
// import others from './others'
// import pages from './pages'
// import tables from './tables'
// import uiElements from './ui-elements'

import conversations from './conversations'
import flows from './flows'
import savedFlows from './savedFlows'
import help from './help'


// ** Merge & Export
export default [
  ...help,
  ...flows,
  ...savedFlows,
  ...conversations
  // ...dashboards,
  // ...apps,
  // ...pages,
  // ...uiElements,
  // ...forms,
  // ...tables,
  // ...charts,
  // ...others
]

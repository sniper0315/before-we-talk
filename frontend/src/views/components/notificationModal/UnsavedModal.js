// ** React Imports
// ** Reactstrap Imports
import { useEffect, useState  } from 'react'
import { Col, Label, Input } from 'reactstrap'
import style from "./UnsavedModal.module.css"

const hintIcon = require("@src/assets/images/icons/custom/hint.svg").default
const DeleteFlowModal = ({ showPrompt, cancelNavigation }) => {
  
  const [centeredModal, setCenteredModal] = useState(showPrompt)
  useEffect(() => {
    setCenteredModal(showPrompt)
  }, [showPrompt])

  return (
    <>
      {centeredModal && <div className={style.nameVerticallyCenteredModal}>
        <div className={style.nameModalContent}>
          <div className={style.nameModalHeader}>
            <img className={style.titleImageIcon} src={hintIcon} />
            <h5 className={style.modalTitle}>To save changes, please click Save at bottom</h5>
            <button type="button" className={`btn-close ${style.nameRequestModalCloseBtn}`} aria-label="Close" onClick={() => {
              cancelNavigation()
            }
            } />
          </div>
        </div>
      </div>}
    </>
  )
}
export default DeleteFlowModal

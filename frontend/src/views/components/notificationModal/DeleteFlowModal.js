// ** React Imports
// ** Reactstrap Imports
import { Col, Label, Input } from 'reactstrap'
import style from "./DeleteFlowModal.module.css"

const hintIcon = require("@src/assets/images/icons/custom/hint.svg").default
const DeleteFlowModal = ({ setCenteredModal, handleDeleteFlow }) => {
  
  return (
    <div className={style.nameVerticallyCenteredModal}>
      <div className={style.nameModalContent}>
        <div className={style.nameModalHeader}>
          <img className={style.titleImageIcon} src={hintIcon} />
          <h5 className={`modal-title`}>Confirm deleting this flow</h5>
          <button type="button" className={`btn-close ${style.nameRequestModalCloseBtn}`} aria-label="Close" onClick={() => setCenteredModal(false)} />
        </div>
        <div className={`d-flex justify-content-center ${style.modalBody}`}>
        </div>
        <div className={style.modalFooter}>
          <button type="button" className={`btn btn-primary ${style.nameRequestModalSaveBtn}`} onClick={() => handleDeleteFlow()} >Yes</button>
          <button type="button" className={`btn btn-flat-primary ${style.nameRequestModalCancelBtn}`} onClick={() => setCenteredModal(false)} >Cancel</button>
        </div>
      </div>
    </div>
  )
}
export default DeleteFlowModal

import React from "react"
import PropTypes from "prop-types"

export default class GwaAuthorizationPopup extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {}
  }

  close =() => {
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  authorizeState =(auth) => {
    let { authActions } = this.props
    let { name } = auth
    
    let newState = { [name]: auth }
    console.log(newState)
    authActions.authorize(newState)
  }

  submitAuth =(e) => {
    if (e){
      e.preventDefault()
    }

    let { authActions, closePopupWindow } = this.props

    authActions.authorize(this.state)
    closePopupWindow()
  }

  render() {
    let { authSelectors, authActions, getComponent, errSelectors, specSelectors, closePopupWindow } = this.props
    const BcGwaApiKeyAuth = getComponent("bcGwaApiKeyAuth");

    return (
      <div className="dialog-ux">
        <div className="backdrop-ux"></div>
        <div className="modal-ux">
          <div className="modal-dialog-ux">
            <div className="modal-ux-inner">
              <div className="modal-ux-header">
                <h3>Get GWA Authorization Key</h3>
                <button type="button" className="close-modal" onClick={ closePopupWindow }>
                  <svg width="20" height="20">
                    <use xlinkHref="#close" />
                  </svg>
                </button>
              </div>
              <div className="modal-ux-content">
                <BcGwaApiKeyAuth getComponent={ getComponent }
                                getComponent={ getComponent }
                                errSelectors={ errSelectors }
                                authSelectors={ authSelectors }
                                authActions={ authActions }
                                specSelectors={ specSelectors }
                                authorizeState={ this.authorizeState }
                                submitAuth={ this.submitAuth }/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  static propTypes = {
    fn: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    closePopupWindow: PropTypes.func.isRequired,
  }
}

import React, { PropTypes } from "react"

export default class BcGwaAuthorizationPopup extends React.Component {
  close =() => {
    let { authActions } = this.props

    authActions.showDefinitions(false)

    console.log("Let's add the key to Swagger now")
  }

  render() {
    let { authSelectors, authActions, getComponent, errSelectors, specSelectors, fn: { AST } } = this.props
    let definitions = authSelectors.shownDefinitions()
    const Auths = getComponent("auths")

    const iFrameStyle = {
      height: "475px",
      width: "100%"
    }

    return (
      <div className="dialog-ux">
        <div className="backdrop-ux"></div>
        <div className="modal-ux">
          <div className="modal-dialog-ux">
            <div className="modal-ux-inner">
              <div className="modal-ux-header">
                <h3>Login to Fetch API Key</h3>
                <button type="button" className="close-modal" onClick={ this.close }>
                  <svg width="20" height="20">
                    <use xlinkHref="#close" />
                  </svg>
                </button>
              </div>
              <div className="modal-ux-content">
                <iframe src="https://gwa-t.apps.gov.bc.ca/ui/apiKeys" style={iFrameStyle} />
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
  }
}

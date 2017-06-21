import React, { PropTypes } from "react"

export default class BcGwaAuthorizeBtn extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  onClick =() => {
    var request = new Request('http://gwa-t.apps.gov.bc.ca/rest/apiKeys', {
	method: 'GET', 
	mode: 'cors', 
    });
    let { authActions, authSelectors } = this.props
    let definitions = authSelectors.definitionsToAuthorize()

    fetch(request)
    .then((result) => {
      console.log(result.data)
    })
    .catch((error) => {
      authActions.showDefinitions(definitions)
    });
  }

  render() {
    let { authSelectors, getComponent } = this.props
    //must be moved out of button component
    const BcGwaAuthorizationPopup = getComponent("bcGwaAuthorizationPopup", true)
    let showPopup = !!authSelectors.shownDefinitions()
    let isAuthorized = !!authSelectors.authorized().size

    return (
      <div className="auth-wrapper">
        <button className={isAuthorized ? "btn authorize locked" : "btn authorize unlocked"} onClick={ this.onClick }>
          <span>Get API Key</span>
          <svg width="20" height="20">
            <use xlinkHref={ isAuthorized ? "#locked" : "#unlocked" } />
          </svg>
        </button>
      { showPopup && <BcGwaAuthorizationPopup /> }
      </div>
    )
  }


  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
  }
}

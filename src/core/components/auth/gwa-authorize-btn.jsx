import React from "react"
import PropTypes from "prop-types"

export default class GwaAuthorizeBtn extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      showGwaPopup: false,
    }
  }

  closePopupWindow =() => {
    this.setState({showGwaPopup: false})
  }

  onClick =() => {
    let { authActions, authSelectors } = this.props
    console.log("set state")

    this.setState({showGwaPopup: true})
  }

  render() {
  let { authSelectors, authActions, getComponent, errSelectors, specSelectors, fn: { AST } } = this.props
    //must be moved out of button component
    const GwaAuthorizationPopup = getComponent("gwaAuthorizationPopup", true)
    let showGwaPopup = this.state.showGwaPopup
    console.log(showGwaPopup)
    let isAuthorized = !!authSelectors.authorized().size

    return (
      <div className="auth-wrapper">
        <button className={isAuthorized ? "btn authorize locked" : "btn authorize unlocked"} onClick={ this.onClick }>
          <span>Get API Key</span>
          <svg width="20" height="20">
            <use xlinkHref={ isAuthorized ? "#locked" : "#unlocked" } />
          </svg>
        </button>
      { showGwaPopup && <GwaAuthorizationPopup closePopupWindow={ this.closePopupWindow }
                                               getComponent={ getComponent }
                                               errSelectors={ errSelectors }
                                               authSelectors={ authSelectors }
                                               authActions={ authActions }
                                               specSelectors={ specSelectors }
                                               AST={AST}/> 
      }
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

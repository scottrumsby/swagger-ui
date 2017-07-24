import React, { PropTypes } from "react"

export default class AuthorizeBtn extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  onClick =() => {
    let { authActions, authSelectors, specSelectors } = this.props
    let definitions = authSelectors.definitionsToAuthorize()

    //Check to see if an apikey is present
    let security = specSelectors.security()
    let securityDefinitions = specSelectors.securityDefinitions()
    let apiKeyPresent = false
    let apiKeySchema = null

    security.valueSeq().forEach( (names) => {
      names.entrySeq().forEach( ([name, scopes]) => {
        let definition = securityDefinitions.get(name)
        if (definition.get("type") === "apiKey") {
          apiKeyPresent = true
          apiKeySchema = definition
        }
      })
    })

    if (apiKeyPresent) {
      //if the key is present, go fetch the key
      this.fetchBcGwaAuthKey(apiKeySchema)
    } else {
      //Otherwise load the definitions normally
      authActions.showDefinitions(definitions)
    }
  }

  fetchBcGwaAuthKey =(apiKeySchema) => {
    let { authActions } = this.props
    //fetch runs in it's on 'this' context. so we need to rebind the function here
    let afterLoginAuth = this.fetchBcGwaAuthKeyAfterLogin
    console.log("Fetching the key")
    fetch("https://gwa.apps.gov.bc.ca/rest/apiKeys", {
      credentials: 'include',
      mode: 'cors',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("Fetch success. JSON to follow")
      console.log(responseJson);
      let newState = {
        "apikey": {
          "name": "apikey",
          "schema": apiKeySchema,
          "value": responseJson.apiKey
        }
      }
      authActions.authorize(newState)
    })
    .catch((error) => {
      console.log("User not authenticated: opening new window to provide Auth")
      let newWindow = window.open("https://gwa.apps.gov.bc.ca/ui/apiKeys", "_blank", "height=600px,width=800px")

      //Ugly method to poll for when the child window closes
      var windowPollerInterval = window.setInterval(function() {
        if (newWindow.closed !== false) {
          window.clearInterval(windowPollerInterval)
          afterLoginAuth(apiKeySchema)
        }
      }, 250)
    })
  }
  
  fetchBcGwaAuthKeyAfterLogin =(apiKeySchema) => {
    let { authActions } = this.props
    console.log("Parent window closed... auth time!")

    fetch("https://gwa.apps.gov.bc.ca/rest/apiKeys", {
      credentials: 'include',
      mode: 'cors',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("Fetch success. JSON to follow")
      console.log(responseJson);

      let newState = {
        "apikey": {
          "name": "apikey",
          "schema": apiKeySchema,
          "value": responseJson.apiKey
        }
      }
      authActions.authorize(newState)
    })
    .catch((error) => {
      console.log("Post login request failed. Set the api-key to something non-sensical")
      let newState = {
        "apikey": {
          "name": "apikey",
          "schema": apiKeySchema,
          "value": "bc-gwa-auth-failed"
        }
      }
      authActions.authorize(newState)
    })
  }

  render() {
    let { authSelectors, getComponent } = this.props
    //must be moved out of button component
    const AuthorizationPopup = getComponent("authorizationPopup", true)
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
      { showPopup && <AuthorizationPopup /> }
      </div>
    )
  }


  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
  }
}

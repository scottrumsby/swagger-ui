import React, { PropTypes } from "react"

export default class BcGwaApiKeyAuth extends React.Component {
  static propTypes = {
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    errSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    authorizeState: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    let { name, schema } = this.props
    let value = ""

    this.state = {
      name: name,
      schema: schema,
      value: value,
      apiError: false
    }
    
    this.fetchApiKey()
  }
  
  fetchApiKey() {
    let { authorizeState, authActions } = this.props
    fetch("https://gwa-d.apps.gov.bc.ca/rest/apiKeys", {
      credentials: "include"
    })
    .then((response) => {
      if (response.status && response.status == 403) {
        this.setState({apiError: true})
      } else {
        let responseJson = response.json()
        let newState = Object.assign({}, this.state, { value: responseJson.key })
        authorizeState(newState)
      }
    })
    .catch((error) => {
        this.setState({apiError: true})
      console.log(error)
      console.log("Dialog open - user not authenticated.")
    })
  }

  componentWillUnmount() {
    console.log("Unmounting")
    this.fetchApiKey()
  }

  render() {
    let { schema, getComponent, errSelectors, specSelectors, name } = this.props
    let { apiError } = this.state
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const Markdown = getComponent( "Markdown" )
    const JumpToPath = getComponent("JumpToPath", true)
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    let info = specSelectors.info()
    let contact = info.get("contact")
    let contactName = contact.get("name")
    let contactUrl = contact.get("url")
    let contactEmail = contact.get("email")

    let iframeStyle = {
      width: "100%",
      height: "400px"
    }

    if (!apiError) {
      return (
        <div>
          <iframe src="https://gwa-d.apps.gov.bc.ca/ui/apiKeys?contentOnly=true" style={iframeStyle} frameBorder="0" />
        </div>
      )
    } else {
      return (
        <div>
          <h4>Forbidden</h4>
          <p>Please contact {contactName} to request that your github account be associated with the Github group 'bcgov'</p>
        </div>
      )
    }
  }
}

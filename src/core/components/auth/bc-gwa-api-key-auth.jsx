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
    authorizeState: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
    console.log("this.props")
    console.log(this.props)
    console.log("props")
    console.log(props)
    console.log("context")
    console.log(context)
    let { name, schema } = this.props
    let value = ""

    this.state = {
      name: name,
      schema: schema,
      value: value,
      apiError: false
    }
    
    //listen for GWA message
    window.addEventListener('message', this.gwaMessageCallback.bind(this));
  }

  gwaMessageCallback(message) {
    this.setKey(message.data);
  }

  setKey(key) {
    let { authorizeState, submitAuth } = this.props
    console.log("Obtained an API key: "+key);
    let newState = Object.assign({}, this.state, { value: key })
    authorizeState(newState)
    this.setState(newState);

    submitAuth();

  }

  fetchApiKey() {
    //console.log("fetchApiKey");
    let { authorizeState, authActions } = this.props
    fetch("https://gwa.apps.gov.bc.ca/rest/apiKeys", {
      credentials: "include"
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if (responseJson && 
           "data" in responseJson && 
           responseJson.data.length > 0 &&
           responseJson.data[0].key) {
        let key = responseJson.data[0].key;
        this.setKey(key);
      }
      else {
        console.log("Unable to fetch API key");       
      }
    })
    .catch((error) => {
      console.log(error)
      console.log("Dialog open - user not authenticated.")
    })
  }


  componentWillMount() {

  }

  componentWillUnmount() {

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

    return (
      <div>
        <iframe src="https://gwa.apps.gov.bc.ca/ui/apiKeys?appName=API%20Console&appSendMessage=true&contentOnly=true" style={iframeStyle} frameBorder="0" />
      </div>
    )

  }
}
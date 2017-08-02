import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class Auths extends React.Component {
  static propTypes = {
    definitions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)

    this.state = {}
  }

  onAuthChange =(auth) => {
    let { name } = auth

    this.setState({ [name]: auth })
  }

  submitAuth =(e) => {
    if (e){
      e.preventDefault()
    }

    let { authActions } = this.props

    authActions.authorize(this.state)
    authActions.showDefinitions(false)
  }
  
  authorizeState =(auth) => {
    let { authActions } = this.props
    let { name } = auth
    
    let newState = { [name]: auth }
    authActions.authorize(newState)
  }

  logoutClick =(e) => {
    e.preventDefault()

    let { authActions, definitions } = this.props
    let auths = definitions.map( (val, key) => {
      return key
    }).toArray()

    authActions.logout(auths)
  }

  render() {
    let { definitions, getComponent, authSelectors, errSelectors, specSelectors } = this.props
    const ApiKeyAuth = getComponent("apiKeyAuth")
    const BcGwaApiKeyAuth = getComponent("bcGwaApiKeyAuth")
    const BasicAuth = getComponent("basicAuth")
    const Oauth2 = getComponent("oauth2", true)
    const Button = getComponent("Button")

    let authorized = authSelectors.authorized()

    let authorizedAuth = definitions.filter( (definition, key) => {
      return !!authorized.get(key)
    })

    let nonOauthDefinitions = definitions.filter( schema => schema.get("type") !== "oauth2")
    let oauthDefinitions = definitions.filter( schema => schema.get("type") === "oauth2")

    return (
      <div className="auth-container">
        {
          !!nonOauthDefinitions.size && <form onSubmit={ this.submitAuth }>
            {
              nonOauthDefinitions.map( (schema, name) => {
                let type = schema.get("type")
                let authEl

                switch(type) {
                  case "apiKey": authEl = <BcGwaApiKeyAuth key={ name }
                                                    schema={ schema }
                                                    name={ name }
                                                    errSelectors={ errSelectors }
                                                    specSelectors={ specSelectors }
                                                    authorized={ authorized }
                                                    getComponent={ getComponent }
                                                    onChange={ this.onAuthChange } 
                                                    authorizeState = { this.authorizeState } 
                                                    submitAuth = {this.submitAuth} />
                    break
                  case "basic": authEl = <BasicAuth key={ name }
                                                  schema={ schema }
                                                  name={ name }
                                                  errSelectors={ errSelectors }
                                                  authorized={ authorized }
                                                  getComponent={ getComponent }
                                                  onChange={ this.onAuthChange } />
                    break
                  default: authEl = <div key={ name }>Unknown security definition type { type }</div>
                }

                let buttonBar
                if (nonOauthDefinitions.size === authorizedAuth.size) {
                  if (type == "apiKey") {
                    buttonBar = <Button className="btn modal-btn auth" onClick={ this.logoutClick }>Unset API Key</Button> 
                  }
                  else {
                    buttonBar = <Button className="btn modal-btn auth" onClick={ this.logoutClick }>Logout</Button> 
                  }
                }
                else {
                  if (type == "apiKey") {
                    buttonBar = <h4 class="opblock-title">No key set</h4>
                  }
                  else {
                    buttonBar = <Button type="submit" className="btn modal-btn auth authorize">Authorize</Button>
                  }
                }
                  

                return (
                  <div key={`${name}-jump`}>
                    { authEl }                    
                    <div className="auth-btn-wrapper"> { buttonBar }</div>
                  </div>
                )

              }).toArray()
            }

          </form>
        }

        {
          oauthDefinitions && oauthDefinitions.size ? <div>
          <div className="scope-def">
            <p>Scopes are used to grant an application different levels of access to data on behalf of the end user. Each API may declare one or more scopes.</p>
            <p>API requires the following scopes. Select which ones you want to grant to Swagger UI.</p>
          </div>
            {
              definitions.filter( schema => schema.get("type") === "oauth2")
                .map( (schema, name) =>{
                  return (<div key={ name }>
                    <Oauth2 authorized={ authorized }
                            schema={ schema }
                            name={ name } />
                  </div>)
                }
                ).toArray()
            }
          </div> : null
        }

      </div>
    )
  }

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    definitions: ImPropTypes.iterable.isRequired
  }
}

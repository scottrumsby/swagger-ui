import React, { PropTypes } from "react"

export default class RequestUrl extends React.Component {
  static propTypes = {
    request: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  handleFocus(e) {
    e.target.select()
    document.execCommand("copy")
  }

  openRequestUrl(e, url) {
    window.open(url)
  }
  
  copyRequestUrl(e) {
    var ta = e.target.parentElement.parentElement.getElementsByTagName("textarea")
    if (ta.length == 1) {
      ta = ta[0]
      ta.select()
      document.execCommand("copy")
    } else {
      console.log("Unable to find textarea to select.")
      return null
    }
  }

  render() {
    let { request, getComponent } = this.props

    const buttonDivStyle = {
      float: 'right',
      marginTop: '5px'
    }
    const Button = getComponent("Button")
    const TextArea = getComponent("TextArea")

    return (
      <div>
        <h4>Request URL</h4>
        <div className="copy-paste">
          <textarea ref='content' onFocus={this.handleFocus} className="request-url" style={{ whiteSpace: "normal" }} value={ request.get("url") }></textarea>
        </div>
        <div style={ buttonDivStyle }>
          <Button onClick={ (e) => this.copyRequestUrl(e) } className={ "btn-copy" } data-clipboard-target="#request-url" title={ "Copy Request URL" }>Copy Request URL</Button>
          <Button onClick={ (e) => this.openRequestUrl(e, request.get("url")) } title={ "Open Request URL" }>Open Request URL</Button>
        </div>
      </div>
    )
  }
}

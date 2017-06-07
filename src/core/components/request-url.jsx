import React, { PropTypes } from "react"

export default class RequestUrl extends React.Component {
  static propTypes = {
    request: PropTypes.object.isRequired
  }

  handleFocus(e) {
    e.target.select()
    document.execCommand("copy")
  }

  openRequestUrl(e, url) {
    console.log(url)
    window.open(url)
  }

  render() {
    let { request } = this.props

	const buttonDivStyle = {
		float: 'right',
		marginTop: '5px'
	}

    return (
      <div>
        <h4>Request URL</h4>
        <div className="copy-paste">
          <textarea onFocus={this.handleFocus} className="request-url" style={{ whiteSpace: "normal" }} value={ request.get("url") }></textarea>
        </div>
		<div style={ buttonDivStyle }>
			<button className={ "btn-copy" } data-clipboard-target="#request-url">Copy Request URL</button>
			<button id={ "open_request_url" } onClick={(e) => this.openRequestUrl(e, request.get("url")) } >Open Request URL</button>
		</div>
      </div>
    )
  }

}

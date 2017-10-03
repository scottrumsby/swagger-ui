import React from "react"
import PropTypes from "prop-types"

export default class TryExampleButton extends React.Component {

  static propTypes = {
    onTryExampleClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    enabled: PropTypes.bool, // Try it out is enabled, ie: the user has access to the form
  };

  static defaultProps = {
    onTryExampleClick: Function.prototype,
    onCancelClick: Function.prototype,
    enabled: false,
  };

  render() {
    const { onTryExampleClick, onCancelClick, enabled } = this.props

    return (
      <div className="try-example">
        {
          enabled ? null
                  : <button className="btn try-out__btn" onClick={ onTryExampleClick }> Try example </button>
        }
      </div>
    )
  }
}

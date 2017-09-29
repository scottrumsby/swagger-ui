import React from "react"
import PropTypes from "prop-types"

export default class TryASampleButton extends React.Component {

  static propTypes = {
    onTrySampleClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    enabled: PropTypes.bool, // Try it out is enabled, ie: the user has access to the form
  };

  static defaultProps = {
    onTrySampleClick: Function.prototype,
    onCancelClick: Function.prototype,
    enabled: false,
  };

  render() {
    const { onTrySampleClick, onCancelClick, enabled } = this.props

    return (
      <div className="try-out">
        {
          enabled ? null
                  : <button className="btn try-out__btn" onClick={ onTrySampleClick }>Try a sample </button>
        }
      </div>
    )
  }
}

import React from 'react';
import PropTypes from 'prop-types';

class Label extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    for: PropTypes.string
  };

  static defaultProps = {
    for: null,
    children: null,
    className: ''
  };

  get htmlFor() {
    return this.props.for;
  }

  get renderedMessage() {
    return this.props.children;
  }

  render() {
    const { className, children, for: forProp, ...props } = this.props;

    return (
      <label {...props} htmlFor={this.htmlFor} className={className}>
        {this.renderedMessage}
      </label>
    );
  }
}

export default Label;

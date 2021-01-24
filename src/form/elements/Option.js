import React from 'react';
import PropTypes from 'prop-types';
import { NoOperation } from '../../utils/CommonFunctions';

class Option extends React.Component {
  static propTypes = {
    onOptionSelect: PropTypes.func,
    className: PropTypes.string,
    text: PropTypes.node,
    value: PropTypes.any,
    children: PropTypes.node
  };

  static defaultProps = {
    value: null,
    children: null,
    text: null,
    className: '',
    onOptionSelect: NoOperation
  };

  static getValueFromProps(props) {
    return props.value;
  }

  get className() {
    return this.props.className;
  }

  get text() {
    return typeof this.props.text !== 'string' ? this.props.value : this.props.text;
  }

  get value() {
    return Option.getValueFromProps(this.props);
  }

  render() {
    const { onOptionSelect, text, value, className, children, ...otherProps } = this.props;
    return (
      <div
        role="option"
        tabIndex="0"
        onClick={() => onOptionSelect(this)}
        className={className}
        {...otherProps}
      >
        {text || children || value}
      </div>
    );
  }
}

export default Option;

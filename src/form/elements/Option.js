/* eslint-disable react/no-unused-class-component-methods */
import React from 'react';
import PropTypes from 'prop-types';
import { NoOperation } from '../../utils/CommonFunctions';

class Option extends React.Component {
  static propTypes = {
    onOptionSelect: PropTypes.func,
    className: PropTypes.string,
    text: PropTypes.node,
    value: PropTypes.any,
    children: PropTypes.node,
  };

  static defaultProps = {
    value: null,
    children: null,
    text: null,
    className: '',
    onOptionSelect: NoOperation,
  };

  static getValueFromProps(props) {
    return props.value;
  }

  get className() {
    const { className } = this.props;
    return className;
  }

  get text() {
    const { text, value } = this.props;
    return typeof text !== 'string' ? value : text;
  }

  get value() {
    return Option.getValueFromProps(this.props);
  }

  render() {
    const { onOptionSelect, text, value, className, children, ...otherProps } = this.props;
    const optionAction = () => onOptionSelect(this);
    return (
      <div
        role="option"
        tabIndex="0"
        onClick={optionAction}
        onKeyPress={optionAction}
        className={className}
        aria-selected={false}
        {...otherProps}
      >
        {text || children || value}
      </div>
    );
  }
}

export default Option;

import React from 'react';
import PropTypes from 'prop-types';
import { NoOperation } from '../../utils/CommonFunctions';

export default class Option extends React.Component {
  static defaultProps = {
    text: null,
    className: '',
    onOptionSelect: NoOperation
  };

  static propTypes = {
    onOptionSelect: PropTypes.func,
    className: PropTypes.string,
    text: PropTypes.node
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
    const { onOptionSelect, className } = this.props;
    return (
      <div role="select" onClick={() => onOptionSelect(this)} className={className}>
        {this.text}
      </div>
    );
  }
}

import React from 'react';
import FormElement from '../FormElement';

export default class TextInput extends FormElement {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, {
      value: typeof props.value !== 'undefined' ? props.value : props.defaultValue
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value !== this.props.value) {
      this.setState({
        value: newProps.value
      });
    }
  }

  blur() {
    this.refs.input.blur();
  }

  focus() {
    this.refs.input.focus();
  }

  get selectionStart() {
    return this.refs.input.selectionStart;
  }

  get selectionEnd() {
    return this.refs.input.selectionEnd;
  }

  set selectionStart(selectionStart) {
    this.refs.input.selectionStart = selectionStart;
  }

  set selectionEnd(selectionEnd) {
    this.refs.input.selectionEnd = selectionEnd;
  }

  get type() {
    return 'text';
  }

  get value() {
    return this.state.value;
  }

  onInputChange(newValue) {
    return this.setState({ value: newValue }).then(() => this.onChange(newValue, this));
  }

  onInputBlur() {
    return this.setState({}).then(() => this.onBlur(this));
  }

  render() {
    const { value, defaultValue, name, onChange, onBlur, ...otherProps } = this.props;
    const style = {
      // width: '100%'
    };
    return (
      <div>
        <input
          ref="input"
          type={this.type}
          value={this.state.value}
          onChange={(e) => this.onInputChange(e.target.value)}
          onBlur={() => this.onInputBlur()}
          name={this.fullName}
          style={style}
          {...otherProps}
        />
        {this.renderErrorLabel()}
      </div>
    );
  }
}

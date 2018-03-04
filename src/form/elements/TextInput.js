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
    return (
      <div>
        <input
          ref="input"
          type={this.type}
          value={this.state.value}
          onChange={(e) => this.onInputChange(e.target.value)}
          onBlur={() => this.onInputBlur()}
          name={this.fullName}
        />
        {this.showErrors && <span>{this.errorMessage}</span>}
      </div>
    );
  }
}

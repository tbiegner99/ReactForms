import React from 'react';
import FormElement from '../FormElement';

export default class TextInput extends FormElement {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = Object.assign(this.state, {
      value: typeof props.value !== 'undefined' ? props.value : props.defaultValue
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        value: this.props.value
      });
    }
  }

  blur() {
    this.input.current.blur();
  }

  focus() {
    this.input.current.focus();
  }

  get selectionStart() {
    return this.input.current.selectionStart;
  }

  get selectionEnd() {
    return this.input.current.selectionEnd;
  }

  set selectionStart(selectionStart) {
    this.input.current.selectionStart = selectionStart;
  }

  set selectionEnd(selectionEnd) {
    this.input.current.selectionEnd = selectionEnd;
  }

  get selectedText() {
    const { selectionStart, selectionEnd } = this;
    return this.value.substring(selectionStart, selectionEnd);
  }

  get type() {
    return 'text';
  }

  get value() {
    return this.state.value;
  }

  async onInputChange(newValue) {
    await this.setState({ value: newValue });
    this.onChange(newValue, this);
  }

  async onInputBlur() {
    await this.setState({});
    return this.onBlur(this);
  }

  render() {
    const { value, defaultValue, name,onValidationStateChange,validateOnChange,validateOnBlur,submittable, onChange, onBlur, ...otherProps } = this.props;

    return (
      <div>
        <input
          ref={this.input}
          type={this.type}
          value={this.state.value}
          onChange={(e) => this.onInputChange(e.target.value)}
          onBlur={() => this.onInputBlur()}
          name={this.fullName}
          {...otherProps}
        />
        {this.renderErrorLabel()}
      </div>
    );
  }
}

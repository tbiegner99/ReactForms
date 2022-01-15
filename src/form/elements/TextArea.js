import React from 'react';

import TextInput from './TextInput';

class TextArea extends TextInput {
  render() {
    const {
      value,
      defaultValue,
      name,
      onValidationStateChange,
      validateOnChange,
      validateOnBlur,
      submittable,
      onChange,
      onBlur,
      ...otherProps
    } = this.props;

    return (
      <div>
        <textarea
          ref="input"
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

export default TextArea;

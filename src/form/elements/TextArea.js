import React from 'react';

import TextInput from './TextInput';

class TextArea extends TextInput {
  render() {
    const { value, defaultValue, name, onChange, onBlur, ...otherProps } = this.props;
    const style = {
      // width: '100%'
    };
    return (
      <div>
        <textarea
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

export default TextArea;

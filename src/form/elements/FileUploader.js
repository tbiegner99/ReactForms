import React from 'react';
import HiddenField from './HiddenField';
import Button from './Button';
import FileUtilities from '../../utils/FileUtilities';

class FileUploader extends HiddenField {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {};
  }

  get value() {
    return this.state.value;
  }

  componentDidUpdate(prevProps) {
    const { prompt } = this.props;
    if (prompt && prompt !== prevProps.prompt) {
      this.prompt();
    }
  }

  prompt() {
    this.input.current.click();
  }

  toBase64(file) {
    const { contentType, encoding } = this.props;
    return FileUtilities.readFile(file, { contentType, encoding });
  }

  async _onFileChange(val) {
    const { multiple, onChange } = this.props;
    const files = Array.from(val.target.files);
    const readSingleFile = (file) => this.toBase64(file);
    let value;
    if (multiple) {
      value = await Promise.all(files.map(readSingleFile));
    } else {
      value = await readSingleFile(files[0]);
    }

    await this.setState({
      value,
    });
    if (onChange) {
      onChange(value, files);
    }
    await this.validate({ showErrors: true });
  }

  renderVisibleFileUploader() {
    const { prompt } = this.props;
    if (typeof prompt === 'boolean') {
      return null;
    }
    return <Button onClick={() => this.prompt()}>Upload</Button>;
  }

  render() {
    const {
      validateOnBlur,
      validateOnChange,
      onValidationStateChange,
      accept,
      multiple,
      prompt,
      onChange,
      ...otherProps
    } = this.props;
    let acceptStr = accept;
    if (Array.isArray(accept)) {
      acceptStr = accept.join(', ');
    }
    return (
      <div {...otherProps}>
        <input
          type="file"
          ref={this.input}
          accept={acceptStr}
          multiple={multiple}
          onChange={(evt) => this._onFileChange(evt)}
          style={{ height: '1px', width: '1px' }}
        />
        {this.renderVisibleFileUploader()}
        {this.renderErrorLabel()}
      </div>
    );
  }
}

export default FileUploader;

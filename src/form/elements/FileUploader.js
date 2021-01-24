import React from 'react';
import HiddenField from './HiddenField';
import Button from './Button';

class FileUploader extends HiddenField {
  constructor(props) {
    super(props);
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
    this.refs.input.click();
  }

  getFileDimensions(file) {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = file;
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => resolve({});
    });
  }

  toBase64(file) {
    const { contentType, encoding } = this.props;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const type = contentType ? contentType.toLowerCase() : null;
      switch (type) {
        case 'url':
          reader.readAsDataURL(file);
          break;
        case 'binary':
          reader.readAsBinaryString(file);
          break;
        case 'buffer':
          reader.readAsArrayBuffer(file);
          break;
        case 'text':
        default:
          reader.readAsText(file, encoding || 'UTF-8');
      }
      reader.onload = async () =>
        resolve({
          content: reader.result,
          name: file.name,
          type: file.type,
          size: file.size,
          ...(await this.getFileDimensions(reader.result))
        });
      reader.onerror = (error) => reject(error);
    });
  }

  async _onFileChange(val) {
    const { multiple, onChange } = this.props;
    const files = Array.from(val.target.files);
    const readFiles = await Promise.all(files.map(this.toBase64.bind(this)));
    const value = multiple ? readFiles : readFiles[0];
    await this.setState({
      value
    });
    if (onChange) {
      onChange(value, files);
    }
    await this.validate({ showErrors: true });
  }

  render() {
    const { accept, multiple, prompt, onChange, ...otherProps } = this.props;
    let acceptStr = accept;
    if (Array.isArray(accept)) {
      acceptStr = accept.join(', ');
    }
    return (
      <div {...otherProps}>
        <input
          type="file"
          ref="input"
          accept={acceptStr}
          multiple={multiple}
          onChange={() => this._onFileChange()}
          style={{ height: '1px', width: '1px' }}
        />
        {typeof prompt === 'boolean' ? null : <Button onClick={() => this.prompt()}>Upload</Button>}
        {this.renderErrorLabel()}
      </div>
    );
  }
}

export default FileUploader;

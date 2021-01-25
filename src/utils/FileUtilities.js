class FileUtilities {
  // takes a file blob and returns image dimensions if an image
  static getFileDimensions(file) {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => resolve({});
      img.src = file;
    });
  }

  static createFileReader() {
    return new FileReader();
  }

  static readFile(file, options = {}) {
    const { contentType, encoding } = options;
    return new Promise((resolve, reject) => {
      const reader = FileUtilities.createFileReader();
      reader.onload = async () => {
        const imageDimensions = await FileUtilities.getFileDimensions(reader.result);
        resolve({
          content: reader.result,
          name: file.name,
          type: file.type,
          size: file.size,
          ...imageDimensions
        });
      };
      reader.onerror = (error) => reject(error);
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
    });
  }
}

export default FileUtilities;

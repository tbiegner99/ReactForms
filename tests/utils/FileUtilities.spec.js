import FileUtilities from '../../src/utils/FileUtilities';

const mockImageWidth = 360;
const mockImageHeight = 265;

describe('File Utilities', () => {
  beforeAll(() => {
    Object.defineProperty(global.Image.prototype, 'width', {
      get() {
        return mockImageWidth;
      }
    });
    Object.defineProperty(global.Image.prototype, 'height', {
      get() {
        return mockImageHeight;
      }
    });
    Object.defineProperty(global.Image.prototype, 'src', {
      set(src) {
        if (src === null) {
          setTimeout(() => this.onerror(new Error('mocked error')));
        } else {
          setTimeout(() => this.onload({ width: mockImageWidth, height: mockImageHeight }));
        }
      }
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('create file reader', () => {
    it('returns instance of file reader', () => {
      expect(FileUtilities.createFileReader()).toBeInstanceOf(FileReader);
    });
  });

  describe('get file dimensions', () => {
    it('resolves with empty object on error', async () => {
      const result = await FileUtilities.getFileDimensions(null);
      expect(result).toEqual({});
    });
    it('returns width and height', async () => {
      const { width, height } = await FileUtilities.getFileDimensions('test-src');
      expect(width).toEqual(mockImageWidth);
      expect(height).toEqual(mockImageHeight);
    });
  });

  describe('readFile', () => {
    const result = 'mock-result';
    const imageDimensions = { width: mockImageWidth, height: mockImageHeight };
    const file = {
      name: 'some-name',
      type: 'some-type',
      size: 'some-size'
    };
    describe('text file', () => {
      let mockReader;
      beforeEach(() => {
        mockReader = {
          result,
          readAsText: jest.fn().mockImplementation(() => mockReader.onload())
        };
        jest.spyOn(FileUtilities, 'getFileDimensions').mockResolvedValue({});
        jest.spyOn(FileUtilities, 'createFileReader').mockReturnValue(mockReader);
      });

      it('reads as utf 8 if no encoding', async () => {
        const results = await FileUtilities.readFile(file);
        expect(results).toEqual({
          content: result,
          ...file
        });
        expect(mockReader.readAsText).toHaveBeenCalledWith(file, 'UTF-8');
        expect(FileUtilities.getFileDimensions).toHaveBeenCalledWith(result);
      });
      it('reads with provided encoding if provided', async () => {
        const encoding = 'utf';
        const results = await FileUtilities.readFile(file, {
          contentType: 'text',
          encoding
        });
        expect(results).toEqual({
          content: result,
          ...file
        });
        expect(mockReader.readAsText).toHaveBeenCalledWith(file, encoding);
        expect(FileUtilities.getFileDimensions).toHaveBeenCalledWith(result);
      });
    });

    describe('buffer', () => {
      let mockReader;
      beforeEach(() => {
        mockReader = {
          result,
          readAsArrayBuffer: jest.fn().mockImplementation(() => mockReader.onload())
        };
        jest.spyOn(FileUtilities, 'getFileDimensions').mockResolvedValue(imageDimensions);
        jest.spyOn(FileUtilities, 'createFileReader').mockReturnValue(mockReader);
      });

      it('reads array buffer', async () => {
        const results = await FileUtilities.readFile(file, {
          contentType: 'buffer'
        });
        expect(results).toEqual({
          content: result,
          ...file,
          ...imageDimensions
        });
        expect(mockReader.readAsArrayBuffer).toHaveBeenCalledWith(file);
        expect(FileUtilities.getFileDimensions).toHaveBeenCalledWith(result);
      });
    });

    describe('binary', () => {
      let mockReader;
      beforeEach(() => {
        mockReader = {
          result,
          readAsBinaryString: jest.fn().mockImplementation(() => mockReader.onload())
        };
        jest.spyOn(FileUtilities, 'getFileDimensions').mockResolvedValue(imageDimensions);
        jest.spyOn(FileUtilities, 'createFileReader').mockReturnValue(mockReader);
      });

      it('reads binary file', async () => {
        const results = await FileUtilities.readFile(file, {
          contentType: 'binary'
        });
        expect(results).toEqual({
          content: result,
          ...file,
          ...imageDimensions
        });
        expect(mockReader.readAsBinaryString).toHaveBeenCalledWith(file);
        expect(FileUtilities.getFileDimensions).toHaveBeenCalledWith(result);
      });
    });

    describe('url', () => {
      let mockReader;
      beforeEach(() => {
        mockReader = {
          result,
          readAsDataURL: jest.fn().mockImplementation(() => mockReader.onload())
        };
        jest.spyOn(FileUtilities, 'getFileDimensions').mockResolvedValue({});
        jest.spyOn(FileUtilities, 'createFileReader').mockReturnValue(mockReader);
      });

      it('reads binary file', async () => {
        const results = await FileUtilities.readFile(file, {
          contentType: 'url'
        });
        expect(results).toEqual({
          content: result,
          ...file
        });
        expect(mockReader.readAsDataURL).toHaveBeenCalledWith(file);
        expect(FileUtilities.getFileDimensions).toHaveBeenCalledWith(result);
      });
    });

    describe('when file reading errors', () => {
      let mockReader;
      const mockError = new Error('Error reading mock error');
      beforeEach(() => {
        mockReader = {
          result,
          readAsDataURL: jest.fn().mockImplementation(() => mockReader.onerror(mockError))
        };
        jest.spyOn(FileUtilities, 'getFileDimensions').mockResolvedValue({});
        jest.spyOn(FileUtilities, 'createFileReader').mockReturnValue(mockReader);
      });

      it('returns rejected promise with error', async () => {
        try {
          await FileUtilities.readFile(file, {
            contentType: 'url'
          });
        } catch (err) {
          expect(err).toEqual(mockError);
          expect(mockReader.readAsDataURL).toHaveBeenCalledWith(file);
          expect(FileUtilities.getFileDimensions).not.toHaveBeenCalled();
          return;
        }
        throw new Error('expected failure');
      });
    });
  });
});

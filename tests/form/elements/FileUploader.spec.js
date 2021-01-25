import React from 'react';
import { mount } from 'enzyme';
import utilities from '../../helpers/Utilities';
import FileUploader from '../../../src/form/elements/FileUploader';
import Button from '../../../src/form/elements/Button';
import FileUtilities from '../../../src/utils/FileUtilities';

describe('Label Tests', () => {
  let input;
  it('exists', () => {
    expect(typeof FileUploader).toBe('function');
  });

  describe('basic rendering', () => {
    describe('on uncontrolled prompt', () => {
      it('renders prompt button', () => {
        input = mount(<FileUploader />);
        expect(input.find(Button)).toHaveLength(1);
      });

      it('prompts on button click', () => {
        input = mount(<FileUploader />);
        const spy = jest.spyOn(input.instance().input.current, 'click');
        input.find(Button).simulate('click');
        expect(spy).toHaveBeenCalled();
      });
    });
    describe('with controlled prompt', () => {
      it('does not render prompt button', () => {
        input = mount(<FileUploader prompt={false} />);
        expect(input.find(Button)).toHaveLength(0);
      });

      it('forces prompt on update when prompt attribute changes', () => {
        input = mount(<FileUploader prompt={false} />);
        const spy = jest.spyOn(input.instance().input.current, 'click');
        input.setProps({ prompt: true });
        input.update();
        expect(spy).toHaveBeenCalled();
      });

      it('passes accept extensions to input', () => {
        input = mount(<FileUploader multiple accept="jpg" prompt={false} />);
        expect(input.find("input[accept='jpg'][multiple]")).toHaveLength(1);
        input = mount(<FileUploader accept={['jpg', 'gif', '*.txt']} prompt={false} />);
        expect(input.find("input[accept='jpg, gif, *.txt']")).toHaveLength(1);
      });
    });
  });

  describe('file upload', () => {
    const files = ['file1', 'file2', 'file3'];
    const contentType = 'contentType';
    const encoding = 'UTF';
    const value = 'file-data';
    beforeEach(() => {
      jest.spyOn(FileUtilities, 'readFile').mockResolvedValue(value);
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    describe('for single file', () => {
      let validate;
      beforeEach(() => {
        input = mount(
          <FileUploader onChange={null} contentType={contentType} encoding={encoding} />
        );
        validate = jest.spyOn(input.instance(), 'validate');
        input.find('input').simulate('change', { target: { files } });
      });
      it('reads only first file and sets value and triggers change event', () => {
        expect(FileUtilities.readFile).toHaveBeenCalledTimes(1);
        expect(FileUtilities.readFile).toHaveBeenCalledWith(files[0], { contentType, encoding });
        expect(input.state('value')).toEqual(value);
      });

      it('validates element', () => {
        expect(validate).toHaveBeenCalledWith({ showErrors: true });
      });

      it('fires onChange if  event exists', async () => {
        const onChange = jest.fn();
        input = mount(
          <FileUploader onChange={onChange} contentType={contentType} encoding={encoding} />
        );
        input.find('input').simulate('change', { target: { files } });
        await utilities.wait(0);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(value, files);
      });
    });

    describe('for multiple files', () => {
      let validate;
      beforeEach(async () => {
        input = mount(
          <FileUploader onChange={null} multiple contentType={contentType} encoding={encoding} />
        );
        validate = jest.spyOn(input.instance(), 'validate');
        input.find('input').simulate('change', { target: { files } });
        await utilities.wait(0);
      });
      it('reads all filesand sets value', () => {
        expect(FileUtilities.readFile).toHaveBeenCalledTimes(3);
        expect(FileUtilities.readFile).toHaveBeenCalledWith(files[0], { contentType, encoding });
        expect(FileUtilities.readFile).toHaveBeenCalledWith(files[1], { contentType, encoding });
        expect(FileUtilities.readFile).toHaveBeenCalledWith(files[2], { contentType, encoding });
        expect(input.state('value')).toEqual([value, value, value]);
      });

      it('validates element', () => {
        expect(validate).toHaveBeenCalledTimes(1);
        expect(validate).toHaveBeenCalledWith({ showErrors: true });
      });

      it('fires onChange if  event exists', async () => {
        const onChange = jest.fn();
        input = mount(
          <FileUploader
            multiple
            onChange={onChange}
            contentType={contentType}
            encoding={encoding}
          />
        );
        input.find('input').simulate('change', { target: { files } });
        await utilities.wait(0);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith([value, value, value], files);
      });
    });
  });
});

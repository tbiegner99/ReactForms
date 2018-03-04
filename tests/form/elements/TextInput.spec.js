import React from 'react';
import { mount } from 'enzyme';
import TextInput from '../../../src/form/elements/TextInput';

describe('TextInput Tests', () => {
  let input;
  beforeEach(() => {
    input = mount(<TextInput defaultValue="b" />).instance();
  });

  it('exists', () => {
    expect(typeof TextInput).toBe('function');
  });

  it('has a type of text', () => {
    expect(input.type).toBe('text');
  });

  it('sets the initial value to value prop when provided', () => {
    input = mount(<TextInput defaultValue="b" value="c" />).instance();
    expect(input.value).toBe('c');
  });

  it('sets the initial value to default value prop when no value prop provided', () => {
    expect(input.value).toBe('b');
  });

  it('sets the initial value to undefined when ', () => {
    input = mount(<TextInput />).instance();
    expect(input.value).toBeUndefined();
  });

  describe('onChange function', () => {
    let el;
    let setStateMock;
    let onChangeMock;
    beforeEach(() => {
      el = mount(<TextInput />).instance();
      setStateMock = jest.spyOn(el, 'setState').mockReturnValue(Promise.resolve({ value: 'abc' }));
      onChangeMock = jest.spyOn(el, 'onChange');
      el.onInputChange('abc');
    });
    it('sets the state', () => {
      expect(setStateMock).toHaveBeenCalledWith({ value: 'abc' });
    });
    it('invokes form element change handle', () => {
      expect(onChangeMock).toHaveBeenCalledWith('abc', el);
    });
  });

  describe('on props changed', () => {
    let el;
    let elInstance;
    let setStateMock;
    beforeEach(() => {
      el = mount(<TextInput defaultValue="a" />);
      elInstance = el.instance();
      setStateMock = jest
        .spyOn(elInstance, 'setState')
        .mockReturnValue(Promise.resolve({ value: 'abc' }));
      jest.resetAllMocks();
    });
    it('sets the value if the value prop changes', () => {
      el.setProps({ value: 'a' });
      expect(setStateMock).toHaveBeenCalledWith({ value: 'a' });
    });

    it('does not change the value if the value prop is not set', () => {
      el.setProps({ defaultValue: 'b' });
      expect(setStateMock).not.toHaveBeenCalledWith({ value: 'b' });
    });
  });

  describe('onBlur function', () => {
    let el;
    let setStateMock;
    let onBlurMock;
    beforeEach(() => {
      el = mount(<TextInput />).instance();
      setStateMock = jest.spyOn(el, 'setState').mockReturnValue(Promise.resolve({ value: 'abc' }));
      onBlurMock = jest.spyOn(el, 'onBlur');
      el.onInputBlur();
    });
    it('sets the state', () => {
      expect(setStateMock).toHaveBeenCalledWith({});
    });
    it('invokes form element blur handle', () => {
      expect(onBlurMock).toHaveBeenCalledWith(el);
    });
  });

  describe('error label', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mount(<TextInput />);
    });
    it('does not exist if errors not shown', () => {
      expect(wrapper.find('span').length).toBe(0);
    });
    it('does not exist if errors not shown', () => {
      wrapper.setState({ showErrors: true });
      expect(wrapper.find('span').length).toBe(1);
    });
  });

  describe('input events', () => {
    let el;
    let wrapper;
    let onBlurMock;
    let onChangeMock;
    beforeEach(() => {
      wrapper = mount(<TextInput />);
      el = wrapper.instance();
      onChangeMock = jest.spyOn(el, 'onInputChange');
      onBlurMock = jest.spyOn(el, 'onInputBlur');
      el.onInputBlur();
    });
    it('invokes onchange function when text is changed ', () => {
      wrapper.find('input').simulate('change', { target: { value: 'newVal' } });
      expect(onChangeMock).toHaveBeenCalledWith('newVal');
    });

    it('invokes onchange function when text is changed ', () => {
      wrapper.find('input').simulate('blur', { target: { value: 'newVal' } });
      expect(onBlurMock).toHaveBeenCalled();
    });
  });
});

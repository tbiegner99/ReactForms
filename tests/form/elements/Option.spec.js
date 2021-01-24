import React from 'react';
import { mount } from 'enzyme';
import Option from '../../../src/form/elements/Option';
import FormElement from '../../../src/form/FormElement';

describe('Select option', () => {
  it('exists', () => {
    expect(typeof new Option()).toEqual('object');
  });
  it('is not a form element', () => {
    expect(new Option()).not.toBeInstanceOf(FormElement);
  });
  it('is a react component', () => {
    expect(new Option()).toBeInstanceOf(React.Component);
  });
  describe('getValueFromP utility', () => {
    it('returns value prop', () => {
      expect(Option.getValueFromProps({ value: 'a' })).toEqual('a');
      expect(Option.getValueFromProps({})).toBeUndefined();
    });
  });
  describe('with instance', () => {
    let el;
    let instance;
    let evt;
    beforeEach(() => {
      evt = jest.fn();
      el = mount(<Option onOptionSelect={evt} className="opt" value="abcd" />);
      instance = el.instance();
    });
    it('renders children as text', () => {
      const el2 = mount(
        <Option value="2">
          <span className="opt">1</span>
        </Option>
      );
      expect(el2.instance().value).toEqual('2');
      expect(el2.find('.opt')).toHaveLength(1);
    });
    it('exposes className prop', () => {
      expect(new Option({ className: 'opt' }).className).toEqual('opt');
    });
    it('uses text prop as text when supplied', () => {
      expect(new Option({ text: 'a', value: 'b' }).text).toEqual('a');
      expect(new Option({ text: '', value: 'b' }).text).toEqual('');
    });
    it('uses value as text when not defined as prop', () => {
      expect(new Option({ text: null, value: 'b' }).text).toEqual('b');
      expect(new Option({ value: 'b' }).text).toEqual('b');
    });
    it('reutrns props value as value', () => {
      expect(new Option({ value: { a: 1 } }).value).toEqual({ a: 1 });
    });

    it('renders div with supplied class', () => {
      expect(el.find('div.opt')).toHaveLength(1);
    });

    it('renders option text', () => {
      expect(el.text()).toEqual('abcd');
    });

    it('triggers onOptionSelectEvent on click', () => {
      el.simulate('click');
      expect(evt).toHaveBeenCalledWith(instance);
    });
  });
});

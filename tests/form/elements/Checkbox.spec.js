import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../../../src/form/elements/Checkbox';
import GroupableElement from '../../../src/form/elements/GroupableElement';
import Form from '../../../src/form/Form';

describe('checkbox', () => {
  it('is a function', () => {
    expect(typeof Checkbox).toEqual('function');
  });

  it('has a default className', () => {
    expect(Checkbox.defaultClassname).toEqual('__checkboxElement__');
  });

  it('is a groupable element', () => {
    expect(new Checkbox({})).toBeInstanceOf(GroupableElement);
  });

  describe('with valid instance', () => {
    let el;
    let instance;
    let onChange;
    beforeEach(() => {
      onChange = jest.fn();
      el = mount(<Checkbox className="myClass" onChange={onChange} />);
      instance = el.instance();
    });

    describe('actions', () => {
      it('calls onClick handler on click', () => {
        const mock = jest.spyOn(instance, 'onClick');
        el.simulate('click');
        expect(mock).toHaveBeenCalled();
      });
      it('dispatches change event on click', async () => {
        await instance.onClick();
        expect(onChange).toHaveBeenCalledWith(true, instance);
      });
      it('toggles checked state on click', async () => {
        await instance.onClick();
        expect(instance.state.checked).toEqual(true);
        await instance.onClick();
        expect(instance.state.checked).toEqual(false);
      });
    });

    describe('value', () => {
      describe('when checked', () => {
        beforeEach(async () => {
          await instance.onClick();
        });
        it('returns true value when checkedValue property is defined', () => {
          el.setProps({ checkedValue: { a: 3 } });
          expect(instance.value).toEqual({ a: 3 });
        });
        it('returns true value when checkedValue property is defined', () => {
          el.setProps({ checkedValue: null });
          expect(instance.value).toEqual(null);
        });
        it('returns true when checkedValue property is not defined', () => {
          expect(instance.value).toBe(true);
        });
      });
      describe('when not checked', () => {
        it('returns false value when falseValue property is defined', () => {
          el.setProps({ falseValue: { a: 3 } });
          expect(instance.value).toEqual({ a: 3 });
        });
        it('returns false value when falseValue property is defined', () => {
          el.setProps({ falseValue: null });
          expect(instance.value).toEqual(null);
        });
        it('returns false when falseValue property is not defined', () => {
          expect(instance.value).toBe(false);
        });
      });
    });

    describe('rendering', () => {
      it('renders a container with default class name', () => {
        expect(el.find('div.__checkboxElement__').length).toEqual(1);
      });

      it('appends suplied class name to container', () => {
        expect(el.find('div.__checkboxElement__.myClass').length).toEqual(1);
      });

      it('renders an svg in root container for a checkbox', () => {
        expect(el.find('div > svg').length).toEqual(1);
      });
    });
  });
});

import React from 'react';
import { mount } from 'enzyme';
import InputGroup from '../../../src/form/elements/InputGroup';
import GroupableElement from '../../../src/form/elements/GroupableElement';
import TextInput from '../../../src/form/elements/TextInput';

class LiteralGroupElement extends GroupableElement {
  get value() {
    return this.props.value;
  }
}

describe('Input group Tests', () => {
  let group;
  let onChange;
  beforeEach(() => {
    onChange = jest.fn();
    group = mount(<InputGroup onChange={onChange} />).instance();
  });

  it('is a Form Element', () => {
    expect(group).toBeInstanceOf(GroupableElement);
  });

  it('sets itself as group context', () => {
    const expected = { inputGroup: group };
    expect(group.getChildContext()).toEqual(expected);
  });

  it('may or may not allow multiple values', () => {
    expect(group.multiValue).toBe(false);
    group = mount(<InputGroup multiValue />).instance();
    expect(group.multiValue).toBe(true);
  });

  it('throws error on registration of non groupable element', () => {
    const el = mount(<TextInput />).instance();
    const execution = () => group.registerElement(el);
    expect(execution).toThrow(new Error('A groupable element must be registered to Input group'));
  });

  it('allows accessing of elements', () => {
    expect(group.elements).toBeInstanceOf(Array);
  });

  it('adds element to elements on registration', () => {
    const el = mount(<InputGroup />).instance();
    const execution = () => group.registerElement(el);
    expect(execution).not.toThrow(
      new Error(
        'A groupab selected elemen selected elemen selected elements on first selectionts on first selectionts on first selectionle element must be registered to Input group'
      )
    );
    expect(group.elements.length).toBe(1);
    expect(group.elements[0]).toBe(el);
  });

  it('returns unique elementId registration', () => {
    const el = mount(<InputGroup />).instance();
    expect(group.registerElement(el)).toBe(0);
    expect(group.registerElement(el)).toBe(1);
  });

  describe('element unregistration', () => {
    let el;
    let el2;
    beforeEach(() => {
      el = mount(<LiteralGroupElement value={1} />, {
        context: {
          inputGroup: group
        }
      }).instance();
      el2 = mount(<LiteralGroupElement value={2} />, {
        context: {
          inputGroup: group
        }
      }).instance();
    });

    it('does nothing on unregistration of invalid id', () => {
      expect(group.elements.length).toBe(2);
      group.unregister(-1);
      expect(group.elements.length).toBe(2);
    });

    it('removes element on unregistration', () => {
      expect(group.elements.length).toBe(2);
      group.unregister(el.groupId);
      expect(group.elements.length).toBe(1);
      group.unregister(el2.groupId);
      expect(group.elements.length).toBe(0);
    });
  });

  describe('element selection', () => {
    let el;
    let el2;
    beforeEach(() => {
      el = mount(<LiteralGroupElement value={1} />, {
        context: {
          inputGroup: group
        }
      }).instance();
      el2 = mount(<LiteralGroupElement value={2} />, {
        context: {
          inputGroup: group
        }
      }).instance();
    });

    it('exposes selected elements', () => {
      expect(group.selectedElements).toEqual({});
    });

    it('initializes selected elements on first selection', () => {
      el.select();
      expect(group.selectedElements).toEqual({ 0: true });
    });

    it('fires onChangeEvent with selectedValues', () => {
      el.select();
      expect(onChange).toHaveBeenCalledWith(el.value, group, el);
    });

    it('changes selection value on single value selection', () => {
      el.select();
      expect(group.selectedElements).toEqual({ 0: true });
      el2.select();
      expect(group.selectedElements).toEqual({ 1: true });
    });

    it('returns singular value as its value', () => {
      expect(group.value).toEqual(null);
      el.select();
      expect(group.value).toEqual(1);
      el2.select();
      expect(group.value).toEqual(2);
    });

    it('removed selected elements from selected elements on deregister', () => {
      el.select();
      expect(group.value).toEqual(1);
      group.unregister(el.groupId);
      expect(group.value).toEqual(null);
    });

    it('triggers element deselection', async () => {
      const spy = jest.spyOn(group, 'clear');
      await el.select();
      await el2.select();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    let el;
    let el2;
    let el3;
    let elSpy;
    let el2Spy;
    let el3Spy;
    beforeEach(async () => {
      group = mount(<InputGroup multiValue />).instance();
      el = mount(<LiteralGroupElement value={1} />, {
        context: {
          inputGroup: group
        }
      }).instance();
      el2 = mount(<LiteralGroupElement value={2} />, {
        context: {
          inputGroup: group
        }
      }).instance();
      el3 = mount(<LiteralGroupElement value={3} />, {
        context: {
          inputGroup: group
        }
      }).instance();

      await el.select();
      await el3.select();
      elSpy = jest.spyOn(el, 'unselect');
      el2Spy = jest.spyOn(el2, 'unselect');
      el3Spy = jest.spyOn(el3, 'unselect');
      await group.clear();
    });

    it('unselects selected elements', () => {
      expect(elSpy).toHaveBeenCalledTimes(1);
      expect(el2Spy).not.toHaveBeenCalled();
      expect(el3Spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('multi-value group', () => {
    let el;
    let el2;
    beforeEach(() => {
      group = mount(<InputGroup multiValue />).instance();
      el = mount(<LiteralGroupElement value={1} />, {
        context: {
          inputGroup: group
        }
      }).instance();
      el2 = mount(<LiteralGroupElement value={2} />, {
        context: {
          inputGroup: group
        }
      }).instance();
      el.select();
    });

    it('toggles elements on selection', () => {
      expect(group.selectedElements).toEqual({ 0: true });
      el.select();
      expect(group.selectedElements).toEqual({ 0: false });
    });

    it('allowes multiple toggled elements', () => {
      el2.select();
      expect(group.selectedElements).toEqual({ 0: true, 1: true });
    });

    it('returns an array of values as its value', () => {
      expect(group.value).toEqual([1]);
      el2.select();
      expect(group.value).toEqual([1, 2]);
      el.select();
      expect(group.value).toEqual([2]);
    });

    it('removed selected elements from selected elements on deregister', () => {
      el2.select();
      expect(group.value).toEqual([1, 2]);
      group.unregister(el.groupId);
      expect(group.value).toEqual([2]);
    });

    it('does not trigger element deselection', async () => {
      const spy = jest.spyOn(group, 'clear');
      await el.select();
      await el2.select();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});

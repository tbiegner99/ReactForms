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

  it('is not multivalued', () => {
    expect(group.multiValue).toBe(false);
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

  describe('selected element unregistration', () => {
    let el;
    beforeEach(() => {
      el = mount(<LiteralGroupElement selected value={1} />, {
        context: {
          inputGroup: group
        }
      }).instance();
      mount(<LiteralGroupElement value={2} />, {
        context: {
          inputGroup: group
        }
      }).instance();
    });

    it('removes selected element on unregistration', () => {
      expect(group.value).toEqual(1);
      expect(Object.keys(group.selectedElements)).toHaveLength(1);

      expect(group.elements).toHaveLength(2);
      el.componentWillUnmount();
      expect(group.elements).toHaveLength(1);
      expect(Object.keys(group.selectedElements)).toHaveLength(0);
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

    it('calls change with correct value', async () => {
      await el2.select();
      expect(onChange).toHaveBeenCalledWith(2, group, el2);
    });

    it('exposes selected elements', () => {
      expect(group.selectedElements).toEqual({});
    });

    it('initializes selected elements on first selection', async () => {
      await el.select();
      expect(group.selectedElements).toEqual({ 0: true });
    });

    it('fires onChangeEvent with selectedValues', async () => {
      await el.select();
      expect(onChange).toHaveBeenCalledWith(el.value, group, el);
    });

    it('changes selection value on single value selection', async () => {
      await el.select();
      expect(group.selectedElements).toEqual({ 0: true });
      await el2.select();
      expect(group.selectedElements).toEqual({ 1: true });
    });

    it('returns singular value as its value', async () => {
      expect(group.value).toEqual(null);
      await el.select();
      expect(group.value).toEqual(1);
      await el2.select();
      expect(group.value).toEqual(2);
    });

    it('removed selected elements from selected elements on deregister', async () => {
      await el.select();
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

  describe('element unselection', () => {
    it('cancels the event for single value selection groups', async () => {
      const cancel = await group.unselectElement();
      expect(cancel).toBe(false);
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
    let changeFn;
    beforeEach(async () => {
      changeFn = jest.fn();
      group = mount(<InputGroup multiValue onChange={changeFn} />).instance();
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
      await el.select();
    });

    it('returns an array as its value', async () => {
      expect(group.value).toEqual([1]);
    });
    it('calls on change with value', async () => {
      await el2.select();
      expect(changeFn).toHaveBeenCalledWith([1, 2], group, el2);
    });

    it('toggles elements on selection', async () => {
      expect(group.selectedElements).toEqual({ 0: true });
      await el.select();
      expect(group.selectedElements).toEqual({ 0: false });
    });

    it('allowes multiple toggled elements', async () => {
      await el2.select();
      expect(group.selectedElements).toEqual({ 0: true, 1: true });
    });

    it('returns an array of values as its value', async () => {
      expect(group.value).toEqual([1]);
      await el2.select();
      expect(group.value).toEqual([1, 2]);
      await el.select();
      expect(group.value).toEqual([2]);
    });

    it('removed selected elements from selected elements on deregister', async () => {
      await el2.select();
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
    describe('element unselection', () => {
      beforeEach(async () => {
        await el2.select();
        jest.resetAllMocks();
        await el.toggle();
      });

      it('fires on change event', () => {
        expect(changeFn).toHaveBeenCalledWith([2], group, el);
      });

      it('deletes the correct value', () => {
        expect(group.value).toEqual([2]);
      });

      it('returns an empty array when all elements deselected', async () => {
        jest.resetAllMocks();
        await el2.toggle();
        expect(group.value).toEqual([]);
      });
    });
  });
});

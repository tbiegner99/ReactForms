import React from 'react';
import { mount } from 'enzyme';
import InputGroup from '../../../src/form/elements/InputGroup';
import GroupableElement from '../../../src/form/elements/GroupableElement';
import FormElement from '../../../src/form/FormElement';

describe('Groupable Element Tests', () => {
  it('is a Form Element', () => {
    expect(mount(<GroupableElement />).instance()).toBeInstanceOf(FormElement);
  });

  it('does nothing on select without group, but does not throw error', () => {
    mount(<GroupableElement />)
      .instance()
      .select();
  });

  it('does nothing on unmount without group, but does not throw error', () => {
    const el = mount(<GroupableElement />);
    el.unmount();
  });

  describe('when inside a parent context', () => {
    let group;
    let el;
    let elItem;
    let registerSpy;
    let unregisterSpy;
    beforeEach(() => {
      group = mount(<InputGroup />).instance();
      registerSpy = jest.spyOn(group, 'registerElement');
      unregisterSpy = jest.spyOn(group, 'unregister');
      elItem = mount(<GroupableElement />, {
        context: {
          inputGroup: group
        }
      });
      el = elItem.instance();
    });

    it('registers itself on mount', () => {
      expect(registerSpy).toHaveBeenCalledWith(el);
    });

    it('unregisters itself on unmount', () => {
      elItem.unmount();
      expect(unregisterSpy).toHaveBeenCalledWith(el.groupId);
    });

    it('exposes the unique id of the group', () => {
      expect(el.groupId).toBe(0);
    });

    describe('select element function', () => {
      it('calls select element of group', () => {
        const selectSpy = jest.spyOn(group, 'selectElement');
        el.select();
        expect(selectSpy).toHaveBeenCalledWith(el.groupId, el);
      });
    });
  });
});

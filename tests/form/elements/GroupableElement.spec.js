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

  describe('default checked values', () => {
    it('sets default selected state when defaultSelected prop is true', () => {
      expect(new GroupableElement({ defaultSelected: true }).selected).toEqual(true);
    });
    it('sets default selected state when selected prop is true', () => {
      expect(new GroupableElement({ selected: true }).selected).toEqual(true);
    });
  });

  describe('when inside a parent context', () => {
    let group;
    let el;
    let elItem;
    let registerSpy;
    let unregisterSpy;
    beforeEach(() => {
      group = mount(<InputGroup multiValue />).instance();
      registerSpy = jest.spyOn(group, 'registerElement');
      unregisterSpy = jest.spyOn(group, 'unregister');
      elItem = mount(<GroupableElement />, {
        context: {
          inputGroup: group
        }
      });
      el = elItem.instance();
    });

    it('has selected property', () => {
      expect(el.selected).toEqual(false);
    });

    it('registers itself on mount', () => {
      expect(registerSpy).toHaveBeenCalledWith(el);
    });

    it('unregisters itself on unmount', () => {
      elItem.unmount();
      expect(unregisterSpy).toHaveBeenCalledWith(el.groupId);
    });

    it('defaults to unselected', () => {
      expect(el.state.selected).toEqual(false);
    });

    it('exposes the unique id of the group', () => {
      expect(el.groupId).toBe(0);
    });

    describe('unselect element function', () => {
      beforeEach(async () => {
        await el.select();
      });
      it('does not call select element of group', async () => {
        const selectSpy = jest.spyOn(group, 'selectElement');
        await el.unselect();
        expect(selectSpy).not.toHaveBeenCalledWith(el.groupId, el);
      });
      it('calls unselect event of group on toggle', async () => {
        const unselectSpy = jest.spyOn(group, 'unselectElement');
        const stateSpy = jest.spyOn(el, 'setState');
        await el.toggle();
        expect(unselectSpy).toHaveBeenCalledWith(el.groupId, el);
        expect(stateSpy).toHaveBeenCalledWith({ selected: false });
      });
      it('does not perform unselection if group cancels the unselection on toggle', async () => {
        const unselectSpy = jest.spyOn(group, 'unselectElement').mockReturnValue(false);
        const stateSpy = jest.spyOn(el, 'setState');
        await el.toggle();
        expect(unselectSpy).toHaveBeenCalledWith(el.groupId, el);
        expect(stateSpy).not.toHaveBeenCalled();
      });
      it('sets the selected state to false', async () => {
        expect(el.state.selected).toEqual(true);
        await el.unselect();
        expect(el.state.selected).toEqual(false);
      });
    });

    describe('select element function', () => {
      it('calls select element of group', async () => {
        const selectSpy = jest.spyOn(group, 'selectElement');
        await el.select();
        expect(selectSpy).toHaveBeenCalledWith(el.groupId, el);
      });
      it('sets the selected state', async () => {
        await el.select();
        expect(el.state.selected).toEqual(true);
      });
      it('sets selected property', async () => {
        await el.select();
        expect(el.selected).toEqual(true);
      });
    });

    describe('toggle element', () => {
      let selectSpy;
      let unselectSpy;
      beforeEach(() => {
        selectSpy = jest.spyOn(el, 'select');
        unselectSpy = jest.spyOn(el, 'unselect');
      });

      it('selects if element is unselected', async () => {
        await el.toggle();
        expect(selectSpy).toHaveBeenCalled();
        expect(unselectSpy).not.toHaveBeenCalled();
      });

      it('unselects if element is selected', async () => {
        await el.setState({ selected: true });
        await el.toggle();
        expect(unselectSpy).toHaveBeenCalled();
        expect(selectSpy).not.toHaveBeenCalled();
      });
    });
  });
});

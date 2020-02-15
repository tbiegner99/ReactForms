import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../../../src/form/elements/Checkbox';
import RadioButton from '../../../src/form/elements/RadioButton';
import GroupableElement from '../../../src/form/elements/GroupableElement';

describe('Radio button', () => {
  let el;
  let instance;
  beforeEach(() => {
    el = mount(<RadioButton />);
    instance = el.instance();
  });
  it('is a groupable element', () => {
    expect(instance).toBeInstanceOf(GroupableElement);
  });
  it('is a type of checkbox', () => {
    expect(instance).toBeInstanceOf(Checkbox);
  });

  it('renders fill when checked', () => {
    expect(el.find('.outerStroke.checked').length).toEqual(0);
    expect(el.find('.radioFill.checked').length).toEqual(0);
    el.setState({ selected: true });
    expect(el.find('.outerStroke.checked').length).toEqual(1);
    expect(el.find('.radioFill.checked').length).toEqual(1);
  });
});

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
    expect(el.find('[data-role="outerCircle"][data-selected="false"]').length).toEqual(1);
    expect(el.find('[data-role="radioFill"][data-selected="false"]').length).toEqual(1);
    el.setState({ selected: true });
    expect(el.find('[data-role="outerCircle"][data-selected="true"]').length).toEqual(1);
    expect(el.find('[data-role="radioFill"][data-selected="true"]').length).toEqual(1);
  });
});

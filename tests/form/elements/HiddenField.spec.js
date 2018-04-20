import React from 'react';
import { mount } from 'enzyme';
import HiddenField from '../../../src/form/elements/HiddenField';
import FormElement from '../../../src/form/FormElement';

describe('Hidden field element', () => {
  let el;
  let instance;
  beforeEach(() => {
    el = mount(<HiddenField value="a" />);
    instance = el.instance();
  });
  it('is a form element', () => {
    expect(instance).toBeInstanceOf(FormElement);
  });

  it('renders nothing', () => {
    expect(instance.render()).toEqual(null);
  });

  it('takes correct value', () => {
    expect(instance.value).toEqual('a');
  });

  it('changes value when prop changes', () => {
    el.setProps({ value: { a: 1, b: 2 } });
    expect(instance.value).toEqual({ a: 1, b: 2 });
  });
});

import React from 'react';
import { mount } from 'enzyme';
import PasswordInput from '../../../src/form/elements/PasswordInput';
import TextInput from '../../../src/form/elements/TextInput';

describe('PasswordInput Tests', () => {
  let input;
  beforeEach(() => {
    input = mount(<PasswordInput defaultValue="b" />).instance();
  });

  it("extends TextInput", ()=> {
    expect(input instanceof TextInput)
  })

  it('exists', () => {
    expect(typeof PasswordInput).toBe('function');
  });

  it('has a type of passwod', () => {
    expect(input.type).toBe('password');
  });



  it('sets the initial value to value prop when provided', () => {
    input = mount(<PasswordInput />);
    expect(input.find("input[type='password']")).toHaveLength(1)
  });

});

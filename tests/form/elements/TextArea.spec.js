import React from 'react';
import { mount } from 'enzyme';
import TextArea from '../../../src/form/elements/TextArea';
import TextInput from '../../../src/form/elements/TextInput';
import utilities from "../../helpers/Utilities"

describe('TextArea Tests', () => {
  let input;
  beforeEach(() => {
    input = mount(<TextArea defaultValue="b" />).instance();
  });

  it("extends TextInput", ()=> {
    expect(input instanceof TextInput)
  })

  it('exists', () => {
    expect(typeof TextArea).toBe('function');
  });



  it('sets the initial value to value prop when provided', () => {
    input = mount(<TextArea rows="3" />);
    const el=input.find("textarea[rows='3']")
    expect(el).toHaveLength(1)
  });

  it("sets value onChange", async()=> {
    const spy=jest.fn();
    const value="some-value";
    input = mount(<TextArea rows="3" onChange={spy} />);
    const el=input.find("textarea[rows='3']")
    el.simulate('change',{target:{value}}) 
    await utilities.wait(0)
    expect(spy).toHaveBeenCalled()
  })

  it("sets value onBlur", async()=> {
    const spy=jest.fn();
    input = mount(<TextArea rows="3" onBlur={spy} />);
    const el=input.find("textarea[rows='3']")
    el.simulate('blur')
    await utilities.wait(0)
    expect(spy).toHaveBeenCalled()
  })

});

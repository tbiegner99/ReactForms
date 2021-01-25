import React from 'react';
import { mount } from 'enzyme';
import Label from '../../../src/form/elements/Label';

describe('Label Tests', () => {
  let input;
  beforeEach(() => {
    input = mount(<Label defaultValue="b" />).instance();
  });


  it('exists', () => {
    expect(typeof Label).toBe('function');
  });




  it('renders correctly', () => {
    input = mount(<Label for="el" className="class" ><span className="child" /></Label>);
    expect(input.find("label.class[htmlFor='el']")).toHaveLength(1)
    expect(input.find(".child")).toHaveLength(1);
  });

});

import React from 'react';
import { mount } from 'enzyme';
import ErrorLabel from '../../../src/form/elements/ErrorLabel';

describe('Error Label Tests', () => {
  let input;
  beforeEach(() => {
    input = mount(<ErrorLabel data-msg-required="reqd message"><span className="child" /></ErrorLabel>);
  });


  it('exists', () => {
    expect(typeof ErrorLabel).toBe('function');
  });

  it("unmounts without error when no parent form", ()=> {
    input.unmount()
  })

  describe("when parent forces message to label", ()=> {
    let instance;
    const metadata = {data:"some-data"}
    beforeEach(()=> {
      instance=input.instance();
    })

    it("renders message for prop with violated rule if provided", ()=> {
      instance.forceMessage("message","required",metadata)
      input.update()
        expect(input.find(".child")).toHaveLength(0);
        expect(input.text()).toEqual("reqd message")
    })

    it("renders generic prop message if provided and no rule specific message provided", ()=> {
      input = mount(<ErrorLabel data-msg-required="reqd message" message="generic message"><span className="child" /></ErrorLabel>);
      instance=input.instance();

      instance.forceMessage("message","otherRule",metadata)
      input.update()
        expect(input.find(".child")).toHaveLength(0);
        expect(input.text()).toEqual("generic message")
    })

    it("renders provided message from form", ()=> {
      input = mount(<ErrorLabel ><span className="child" /></ErrorLabel>);
      instance=input.instance();
      instance.forceMessage("message","otherRule",metadata)
      input.update()
        expect(input.find(".child")).toHaveLength(0);
        expect(input.text()).toEqual("message")
    })


    describe("when message formmater passed", ()=> {
      it("renders result from formatter as children", ()=> {
        const formatter = jest.fn().mockReturnValue("test-message")
        input = mount(<ErrorLabel onFormatMessage={formatter} data-msg-required="msg attribute"><span className="child" /></ErrorLabel>)
        instance=input.instance();
        
        instance.forceMessage("message","required",metadata)
        input.update()
        expect(input.find(".child")).toHaveLength(0);
        expect(input.text()).toEqual("test-message")
        expect(formatter).toHaveBeenCalledWith("msg attribute","required",metadata,instance.props,instance.state);

      })
    })
  })
  describe("mounting and rendering with rootForm", ()=> {
    let registerLabel;
    let unregisterLabel;
    let instance;
    beforeEach(() => {
      registerLabel=jest.fn().mockReturnValue("some-id");
      unregisterLabel=jest.fn();
      input = mount(<ErrorLabel for="element"><span className="child" /></ErrorLabel>, {
        context: {
          rootForm: {
            unregisterLabel,
            registerLabel
          }
        }
      })
      instance=input.instance();
    });
  
    it("registers itself as label with parent form on mount",()=> {
      expect(registerLabel).toHaveBeenCalledWith(instance,"element")
    })

    it("unregisters itself on unmount", ()=> {
      input.unmount()
      expect(unregisterLabel).toHaveBeenCalledWith(instance,"element")
    })
  
    it("renders children when message is not forced by parent form",()=> {
      expect(input.find(".child")).toHaveLength(1)
    })
  
  
  })


});

import React from 'react';
import { mount } from 'enzyme';
import FormElement from '../../src/form/FormElement';
import Form from '../../src/form/Form';
import testSubmit from './Form/submit';
import testCustomErrorLabelManagement from './Form/customErrorMessages';
import testNativeForm from './Form/nativeForm';
import testFormToJson from './Form/toJson';
import testElementRegistration from './Form/elementRegistration';
import testValidate from './Form/validate';
import testUnregistration from './Form/elementUnregistration';

describe('Form', () => {
  it('is a react component', () => {
    expect(new Form()).toBeInstanceOf(React.Component);
  });
  it('is a form element', () => {
    expect(new Form()).toBeInstanceOf(FormElement);
  });
  describe('with element instance', () => {
    let el;
    let rootForm;
    beforeEach(() => {
      rootForm = new Form({ name: 'rootForm' });
      el = mount(<Form name="nestedForm" />);
    });

    describe('context setting', () => {
      it('sets root form context when it is the root form', () => {
        const elInstance = el.instance();
        expect(elInstance.getChildContext()).toEqual({
          parentForm: elInstance,
          rootForm: elInstance,
        });
      });
      it('passes the root form when it is nested', () => {
        el = mount(<Form name="nestedForm" />, {
          context: {
            rootForm,
            parentForm: rootForm,
          },
        });
        const elInstance = el.instance();
        expect(elInstance.getChildContext()).toEqual({
          parentForm: elInstance,
          rootForm,
        });
      });
    });

    testElementRegistration();

    testUnregistration();

    testFormToJson();

    testValidate();

    testSubmit();

    testNativeForm();

    testCustomErrorLabelManagement();
  });
});

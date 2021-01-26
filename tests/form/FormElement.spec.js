import React from 'react';
import { mount } from 'enzyme';
import FormElement from '../../src/form/FormElement';
import Form from '../../src/form/Form';
import ValidationManager from '../../src/validation/ValidationRuleManager';

class ValidateSpyFormElement extends FormElement {
  constructor(props) {
    super(props);
    this.validate = jest.fn();
  }
}
class ExampleFormElement extends FormElement {
  constructor(props) {
    super(props);
    this.mounted = false;
  }

  get value() {
    return this.props.value;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }
}

describe('Form Element Component', () => {
  it('is exports a class', () => {
    expect(typeof FormElement).toBe('function');
  });
  describe('error message reporting for element', () => {
    let el;
    beforeEach(() => {
      el = mount(<FormElement name="el1" />).instance();
    });
    it('returns null if validation results is null', () => {
      Object.defineProperty(el, 'validationResults', {
        get: () => null
      });
      expect(el.errorMessage).toBe(null);
    });
    it('returns null if validation was successfull', () => {
      Object.defineProperty(el, 'validationResults', {
        get: () => ({
          valid: true,
          message: 'My error message'
        })
      });
      expect(el.errorMessage).toBe(null);
    });
    it('takes message from validation results', () => {
      Object.defineProperty(el, 'validationResults', {
        get: () => ({
          valid: false,
          message: 'My error message'
        })
      });
      expect(el.errorMessage).toBe('My error message');
    });
  });

  describe('error label management', () => {
    let el;
    beforeEach(() => {
      el = mount(<FormElement name="el1" />);
    });
    it('sets state to signal hiding error messages when form tells element to yield error label management', () => {
      el.setState({ showErrors: true });
      expect(el.instance().showErrors).toEqual(true);
      el.instance().yieldErrorLabelManagement();
      expect(el.instance().showErrors).toEqual(false);
      expect(el.state('ignoreErrorRendering')).toEqual(true);
    });
  });

  describe('The instance of the base form elment', () => {
    let baseInstance;
    beforeEach(() => {
      baseInstance = new FormElement({ name: 'myName' });
    });
    it('is a react component', () => {
      expect(baseInstance).toBeInstanceOf(React.Component);
    });

    it('renders nothing', () => {
      expect(baseInstance.render()).toBe(null);
    });

    it('returns the name prop as the elements name', () => {
      expect(baseInstance.name).toBe('myName');
    });

    it('supports a submittable prop that may be supplied', () => {
      expect(new FormElement({ submittable: false }).submittable).toBe(false);
      expect(new FormElement({ submittable: () => 0 }).submittable).toBe(false);
    });
    describe('setState', () => {
      let el;
      beforeEach(() => {
        el = mount(<FormElement name="el1" />).instance();
      });
      it('returns promise', () => {
        expect(el.setState({})).toBeInstanceOf(Promise);
      });
      it('resolves with new state', async () => {
        await expect(el.setState({ value: 'abc' })).resolves.toEqual({ value: 'abc' });
      });
      it('invokes optional callback', async () => {
        const mockCallback = jest.fn();
        await el.setState({ value: 'abc' }, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith({ value: 'abc' });
      });
    });

    it('has submittable prop that is true by default if a name is present', () => {
      expect(baseInstance.submittable).toBe(true);
    });
    it('has fully qualified name base on the form chain', () => {
      // without parent form
      expect(baseInstance.fullName).toBe('myName');
      const rootForm = new Form({ name: 'root' });
      const parentForm = new Form({ name: 'parent' });
      parentForm.context = {
        parentForm: rootForm
      };
      const el = mount(<FormElement name="el1" />, {
        context: {
          parentForm
        }
      });

      expect(el.instance().fullName).toBe('root.parent.el1');
    });

    describe('supported events', () => {
      let el;
      let parentForm;
      beforeEach(() => {
        parentForm = mount(<Form validateOnChange validateOnBlur />).instance();
        el = mount(<FormElement name="el1" />, {
          context: {
            parentForm
          }
        }).instance();
      });

      describe('onChange', () => {
        it('defaults validateOnChange to false', () => {
          el = mount(<FormElement name="el1" />).instance();
          expect(el.validateOnChange).toBe(false);
        });
        it('takes value of validateOnChange from form if provided', () => {
          expect(el.validateOnChange).toBe(true);
        });
        it('overrides validateOnChange if provided in the props', () => {
          el = mount(<FormElement name="el1" validateOnChange={false} />, {
            context: {
              parentForm
            }
          }).instance();
          expect(el.validateOnChange).toBe(false);
        });

        describe('when validateOnChange is true', () => {
          let mockValidate;
          let mockChangeEvt;
          let localEl;
          beforeEach(() => {
            mockChangeEvt = jest.fn();
            localEl = mount(
              <FormElement validateOnChange onChange={mockChangeEvt} name="el1" />
            ).instance();
          });

          it('triggers change event when validation fails', async () => {
            mockValidate = jest.spyOn(localEl, 'fullValidate').mockReturnValue(Promise.reject());
            await localEl.onChange({});
            expect(mockValidate).toHaveBeenCalled();
            expect(mockChangeEvt).toHaveBeenCalledWith({}, localEl);
          });
          it('triggers change event when validation succeeds', async () => {
            mockValidate = jest.spyOn(localEl, 'fullValidate').mockReturnValue(Promise.resolve());
            await localEl.onChange({});
            expect(mockValidate).toHaveBeenCalled();
            expect(mockChangeEvt).toHaveBeenCalledWith({}, localEl);
          });
        });
      });

      describe('onBlur', () => {
        it('defaults validateOnBlur to false', () => {
          el = mount(<FormElement name="el1" />).instance();
          expect(el.validateOnBlur).toBe(false);
        });
        it('takes value of validateOnBlur from form if provided', () => {
          expect(el.validateOnBlur).toBe(true);
        });
        it('overrides validateOnBlur if provided in the props', () => {
          el = mount(<FormElement name="el1" validateOnBlur={false} />, {
            context: {
              parentForm
            }
          }).instance();
          expect(el.validateOnBlur).toBe(false);
        });

        describe('when validateOnBlur is true', () => {
          let mockValidate;
          let mockBlurEvt;
          let localEl;
          beforeEach(() => {
            mockBlurEvt = jest.fn();
            localEl = mount(
              <FormElement validateOnBlur onBlur={mockBlurEvt} name="el1" />
            ).instance();
          });

          it('triggers blur event when validation fails', async () => {
            mockValidate = jest.spyOn(localEl, 'fullValidate').mockReturnValue(Promise.reject());
            await localEl.onBlur({});
            expect(mockValidate).toHaveBeenCalled();
            expect(mockBlurEvt).toHaveBeenCalledWith({}, localEl);
          });
          it('triggers blur event when validation succeeds', async () => {
            mockValidate = jest.spyOn(localEl, 'fullValidate').mockReturnValue(Promise.resolve());
            await localEl.onBlur({});
            expect(mockValidate).toHaveBeenCalled();
            expect(mockBlurEvt).toHaveBeenCalledWith({}, localEl);
          });
        });
      });
    });
    describe('on mount', () => {
      it('calls inherited componentWillMount', () => {
        const form = new Form({});
        const registerSpy = jest.spyOn(form, 'registerElement');
        const el = mount(<ExampleFormElement />, {
          context: {
            rootForm: form,
            parentForm: form
          }
        });
        expect(registerSpy).toHaveBeenCalledWith(el.instance());
        expect(el.instance().mounted).toBe(true);
      });
      it('registers itself with the containing form', () => {
        const form = new Form({});
        const registerSpy = jest.spyOn(form, 'registerElement');
        const el = mount(<FormElement />, {
          context: {
            rootForm: form,
            parentForm: form
          }
        });
        expect(registerSpy).toHaveBeenCalledWith(el.instance());
      });
      it('performs an initial validation on mount', () => {
        const el = mount(<ValidateSpyFormElement />);
        expect(el.instance().validate).toHaveBeenCalled();
      });
    });
    describe('on unmount', () => {
      it('calls inherited componentWillUnount', () => {
        const form = new Form({});
        const el = mount(<ExampleFormElement />, {
          context: {
            rootForm: form,
            parentForm: form
          }
        });
        const instance = el.instance();
        const unmountSpy = jest.spyOn(instance, 'componentWillUnmount');
        expect(instance.mounted).toBe(true);
        el.unmount();
        expect(unmountSpy).toHaveBeenCalled();
        expect(instance.mounted).toBe(false);
      });
      it('doesnt try to unregister itself if no parent form', () => {
        const el = mount(<FormElement />);
        const instance = el.instance();
        const registerSpy = jest.spyOn(instance, '_unregisterSelf');
        el.unmount();
        expect(registerSpy).toHaveBeenCalled();
      });
      it('unregisters itself', () => {
        const form = new Form({});
        const registerSpy = jest.spyOn(form, 'unregisterElement');
        const el = mount(<FormElement />, {
          context: {
            rootForm: form,
            parentForm: form
          }
        });
        expect(el.instance().uniqueId).toBe(0);
        el.unmount();
        expect(registerSpy).toHaveBeenCalledWith(0);
      });
    });
    describe('validiation', () => {
      let validateSpy;
      beforeEach(() => {
        validateSpy = jest.spyOn(ValidationManager, 'validate');
      });
      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('has a validate function', () => {
        expect(typeof new ExampleFormElement().validate).toBe('function');
      });
      it('calls validation manager to perform validation', async () => {
        const elJsx = mount(<ExampleFormElement required value={5} />);
        const el = elJsx.instance();
        jest.clearAllMocks();
        await el.validate();
        expect(validateSpy).toHaveBeenCalledWith(el.value, el.props, {});
      });

      it('calls validation manager to perform validation with form state', async () => {
        const form = new Form({});
        jest.spyOn(form, 'getJsonValue').mockReturnValue('formData');
        const elJsx = mount(<ExampleFormElement required value={5} />, {
          context: {
            rootForm: form,
            parentForm: form
          }
        });
        const el = elJsx.instance();
        jest.clearAllMocks();
        await el.validate();
        expect(validateSpy).toHaveBeenCalledWith(el.value, el.props, 'formData');
      });
      it('updates state with validation results', async () => {
        const elJsx = mount(<ExampleFormElement required value={5} />);
        const el = elJsx.instance();
        expect(el.validationResults).toBe(null);
        expect(el.isValid).toBeUndefined();
        expect(el.showErrors).toBe(false);
        await el.validate({ showErrors: true });
        expect(el.validationResults).not.toBe(null);
        expect(el.isValid).toBe(true);
        expect(el.showErrors).toBe(true);
      });
      it('returns resolved promise when validation succeeds', async () => {
        const elJsx = mount(<ExampleFormElement required value={5} />);
        const el = elJsx.instance();
        const result = await el.validate({ showErrors: true });
        expect(result).toEqual({
          valid: true,
          message: null,
          name: undefined,
          uniqueId: null,
          isForm: false,
          ruleName: null,
          numberOfInvalidElements: 0,
          numberOfRulesViolated: 0
        });
      });
      it('returns rejected promise when validation fails', async () => {
        const elJsx = mount(<ExampleFormElement name="element" required value={null} />);
        const el = elJsx.instance();
        await expect(el.validate({ showErrors: true })).rejects.toEqual({
          valid: false,
          isForm: false,
          uniqueId: null,
          name: 'element',
          ruleName: 'required',
          message: 'Field is required.',
          numberOfInvalidElements: 1,
          numberOfRulesViolated: 1
        });
      });
      it('triggers onValidationStateChange only when validation state changes', async () => {
        const stateChange = jest.fn();
        const validationFinished = jest.fn();
        const parentForm = mount(<Form />).instance();
        const elJsx = mount(
          <ExampleFormElement
            name="element"
            onValidationStateChange={stateChange}
            onValidationFinished={validationFinished}
            required
            value={null}
          />,
          {
            context: {
              parentForm
            }
          }
        );
        const el = elJsx.instance();
        let result = {
          valid: false,
          isForm: false,
          name: 'element',
          uniqueId: 0,
          ruleName: 'required',
          message: 'Field is required.',
          numberOfInvalidElements: 1,
          numberOfRulesViolated: 1
        };
        await expect(el.validate({ showErrors: true })).rejects.toEqual(result);
        expect(stateChange).toHaveBeenCalledWith(false, el, result);
        expect(validationFinished).toHaveBeenCalledWith(result);
        stateChange.mockReset();
        elJsx.setProps({ value: 1 });
        result = {
          valid: true,
          message: null,
          name: 'element',
          isForm: false,
          uniqueId: 0,
          ruleName: null,
          numberOfInvalidElements: 0,
          numberOfRulesViolated: 0
        };
        let lastValidationResult = await el.validate({ showErrors: true });
        expect(lastValidationResult).toEqual(result);
        expect(stateChange).toHaveBeenCalledWith(true, el, result);
        stateChange.mockReset();
        elJsx.setProps({ value: 2 });
        lastValidationResult = await el.validate({ showErrors: true });
        expect(lastValidationResult).toEqual(result);
        expect(stateChange).not.toHaveBeenCalled();
        expect(validationFinished).toHaveBeenCalledWith(result);
      });
      it('notifies the parent form of its validation state', async () => {
        const parentForm = mount(<Form />).instance();
        const elJsx = mount(<ExampleFormElement required value={null} />, {
          context: {
            parentForm
          }
        });
        const el = elJsx.instance();
        const formSpy = jest.spyOn(parentForm, 'notifyElementValidationState');
        const result = {
          valid: false,
          isForm: false,
          name: undefined,
          uniqueId: 0,
          ruleName: 'required',
          message: 'Field is required.',
          numberOfInvalidElements: 1,
          numberOfRulesViolated: 1
        };
        try {
          await el.validate({ showErrors: true });
        } catch (err) {
          expect(err).toEqual(result);
          expect(formSpy).toHaveBeenCalledWith(el, result, true);
          return;
        }
        throw new Error('expected failure');
      });
      it('shows errors on full validate', async () => {
        const elJsx = mount(<ExampleFormElement required value={null} />);
        const el = elJsx.instance();
        await expect(el.fullValidate()).rejects.toEqual({
          valid: false,
          isForm: false,
          uniqueId: null,
          ruleName: 'required',
          message: 'Field is required.',
          numberOfInvalidElements: 1,
          numberOfRulesViolated: 1
        });
        expect(el.showErrors).toBe(true);
      });
    });
  });
});

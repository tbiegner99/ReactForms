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

    componentWillMount() {
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
                await el.validate();
                expect(validateSpy).toHaveBeenCalledWith(el.value, el.props);
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
                await expect(el.validate({ showErrors: true })).resolves.toEqual({
                    valid: true,
                    message: null,
                    numberOfInvalidElements: 0,
                    numberOfRulesViolated: 0
                });
            });
            it('returns rejected promise when validation fails', async () => {
                const elJsx = mount(<ExampleFormElement required value={null} />);
                const el = elJsx.instance();
                await expect(el.validate({ showErrors: true })).rejects.toEqual({
                    valid: false,
                    message: 'Rule violated for value null - RequiredRule',
                    numberOfInvalidElements: 1,
                    numberOfRulesViolated: 1
                });
            });
            it('triggers onValidationStateChange only when validation state changes', async () => {
                const stateChange = jest.fn();
                const parentForm = mount(<Form />).instance();
                const elJsx = mount(
                  <ExampleFormElement
                      onValidationStateChange={stateChange}
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
                    message: 'Rule violated for value null - RequiredRule',
                    numberOfInvalidElements: 1,
                    numberOfRulesViolated: 1
                };
                await expect(el.validate({ showErrors: true })).rejects.toEqual(result);
                expect(stateChange).toHaveBeenCalledWith(false, el, result);
                stateChange.mockReset();
                elJsx.setProps({ value: 1 });
                result = {
                    valid: true,
                    message: null,
                    numberOfInvalidElements: 0,
                    numberOfRulesViolated: 0
                };
                await expect(el.validate({ showErrors: true })).resolves.toEqual(result);
                expect(stateChange).toHaveBeenCalledWith(true, el, result);
                stateChange.mockReset();
                elJsx.setProps({ value: 2 });
                await expect(el.validate({ showErrors: true })).resolves.toEqual(result);
                expect(stateChange).not.toHaveBeenCalled();
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
                    message: 'Rule violated for value null - RequiredRule',
                    numberOfInvalidElements: 1,
                    numberOfRulesViolated: 1
                };
                await expect(el.validate({ showErrors: true })).rejects.toEqual(result);
                expect(formSpy).toHaveBeenCalledWith(el, result);
            });
            it('shows errors on full validate', async () => {
                const elJsx = mount(<ExampleFormElement required value={null} />);
                const el = elJsx.instance();
                await expect(el.fullValidate()).rejects.toEqual({
                    valid: false,
                    message: 'Rule violated for value null - RequiredRule',
                    numberOfInvalidElements: 1,
                    numberOfRulesViolated: 1
                });
                expect(el.showErrors).toBe(true);
            });
        });
    });
});

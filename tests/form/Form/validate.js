import React from 'react';
import { mount } from 'enzyme';
import FormElement from '../../../src/form/FormElement';
import Form from '../../../src/form/Form';

class MockFormElement extends FormElement {
    get value() {
        return this.props.value;
    }
}
export default () => {
    describe('validation state notification', () => {
        let form;
        let element;
        let elInstance;
        let stateChangeSpy;
        beforeEach(async () => {
            stateChangeSpy = jest.fn();
            form = mount(<Form onValidationStateChange={stateChangeSpy} />).instance();
            element = mount(<MockFormElement name="el1" required data-rule-number value="" />, {
                context: { parentForm: form }
            });
            elInstance = element.instance();
            try {
                await form.validate();
            } catch (e) {}
            stateChangeSpy.mockReset();
        });

        it('modifies existing form state appropriately', async () => {
            expect(form.validationState).toEqual({
                valid: false,
                uniqueId: null,
                name: undefined,
                numberOfInvalidElements: 1,
                elementResults: {
                    0: {
                        name: 'el1',
                        valid: false,
                        numberOfInvalidElements: 1,
                        numberOfRulesViolated: 1,
                        message: 'Rule violated for value  - RequiredRule'
                    }
                }
            });
            element.setProps({ value: 5 });
            try {
                await elInstance.validate();
            } catch (e) {}
            expect(form.validationState).toEqual({
                valid: true,
                uniqueId: null,
                name: undefined,
                numberOfInvalidElements: 0,
                elementResults: {
                    0: {
                        name: 'el1',
                        valid: true,
                        numberOfInvalidElements: 0,
                        numberOfRulesViolated: 0,
                        message: null
                    }
                }
            });
            expect(stateChangeSpy).toHaveBeenCalled();
        });
        it('fires an onValidationStateChange event when element changing submittability triggers a validation status change', async () => {
            element.setProps({ value: 'A' });
            try {
                await elInstance.validate();
            } catch (e) {}
            expect(stateChangeSpy).not.toHaveBeenCalled();
            element.setProps({ value: 'A', name: null });
            try {
                await elInstance.validate();
            } catch (e) {}
            expect(form.validationState).toEqual({
                valid: true,
                uniqueId: null,
                name: undefined,
                numberOfInvalidElements: 0,
                elementResults: {}
            });
            expect(stateChangeSpy).toHaveBeenCalled();
        });
        it('fires an onValidationStateChange event only when valid state changes', async () => {
            element.setProps({ value: 'A' });
            try {
                await elInstance.validate();
            } catch (e) {}
            expect(stateChangeSpy).not.toHaveBeenCalled();
            element.setProps({ value: 5 });
            try {
                await elInstance.validate();
            } catch (e) {}

            expect(stateChangeSpy).toHaveBeenCalled();
        });
    });
    describe('form validation', () => {
        describe('with all valid elements', () => {
            let formJsx;
            let form;
            beforeEach(() => {
                formJsx = mount(
                  <Form>
                      <MockFormElement required value="A" name="el1" />
                      <MockFormElement value="" required />
                      <MockFormElement required data-rule-number value="5" name="el2" />
                    </Form>
                );
                form = formJsx.instance();
            });
            it('resolves with validation results object', async () => {
                await expect(form.validate()).resolves.toEqual({
                    valid: true,
                    numberOfInvalidElements: 0,
                    name: undefined,
                    uniqueId: null,
                    elementResults: {
                        0: {
                            valid: true,
                            numberOfInvalidElements: 0,
                            message: null,
                            numberOfRulesViolated: 0,
                            name: 'el1'
                        },
                        2: {
                            valid: true,
                            numberOfInvalidElements: 0,
                            message: null,
                            numberOfRulesViolated: 0,
                            name: 'el2'
                        }
                    }
                });
            });
        });
    });
    describe('with some invalid elements', () => {
        let formJsx;
        let form;
        beforeEach(() => {
            formJsx = mount(
                <Form>
                <MockFormElement required value="A" name="el1" />
                <MockFormElement value="" required />
                    <MockFormElement required data-rule-number value="A" name="el2" />
              </Form>
            );
            form = formJsx.instance();
        });
        it('rejects with validation results object', async () => {
            await expect(form.validate()).rejects.toEqual({
                valid: false,
                numberOfInvalidElements: 1,
                name: undefined,
                uniqueId: null,
                elementResults: {
                    0: {
                        valid: true,
                        numberOfInvalidElements: 0,
                        message: null,
                        numberOfRulesViolated: 0,
                        name: 'el1'
                    },
                    2: {
                        valid: false,
                        numberOfInvalidElements: 1,
                        message: 'Rule violated for value A - NumberRule',
                        numberOfRulesViolated: 1,
                        name: 'el2'
                    }
                }
            });
        });
    });
    describe('with a nested form', () => {
        describe('that has ivalid result', () => {
            let formJsx;
            let form;
            beforeEach(() => {
                formJsx = mount(
                  <Form>
                      <Form name="sf1">
                          <MockFormElement required value="" name="el1" />
                            <MockFormElement required value="" name="el2" />
                        </Form>
                      <Form>
                            <MockFormElement required value="A" name="el1" />
                        </Form>
                        <MockFormElement required data-rule-number value="5" name="el2" />
                    </Form>
                );
                form = formJsx.instance();
            });
            it('generates correct validationResult', async () => {
                await expect(form.validate()).rejects.toEqual({
                    valid: false,
                    numberOfInvalidElements: 2,
                    name: undefined,
                    uniqueId: null,
                    elementResults: {
                        0: {
                            valid: false,
                            numberOfInvalidElements: 2,
                            name: 'sf1',
                            uniqueId: 0,
                            elementResults: {
                                0: {
                                    valid: false,
                                    numberOfInvalidElements: 1,
                                    message: 'Rule violated for value  - RequiredRule',
                                    numberOfRulesViolated: 1,
                                    name: 'sf1.el1'
                                },
                                1: {
                                    valid: false,
                                    numberOfInvalidElements: 1,
                                    message: 'Rule violated for value  - RequiredRule',
                                    numberOfRulesViolated: 1,
                                    name: 'sf1.el2'
                                }
                            }
                        },
                        2: {
                            valid: true,
                            numberOfInvalidElements: 0,
                            message: null,
                            numberOfRulesViolated: 0,
                            name: 'el2'
                        }
                    }
                });
            });
        });
        describe('full validate', () => {
            let form;
            let formJsx;
            beforeEach(() => {
                formJsx = mount(
                  <Form>
                      <MockFormElement required value="A" name="el1" />
                    </Form>
                );
                form = formJsx.instance();
            });
            it('calls validate with showErrors option', async () => {
                const validateSpy = jest.spyOn(form, 'validate');
                await form.fullValidate();
                expect(validateSpy).toHaveBeenCalledWith({ showErrors: true });
            });
        });
    });
};

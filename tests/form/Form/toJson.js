import React from 'react';
import { mount } from 'enzyme';
import Form from '../../../src/form/Form';
import MockFormElement from '../Form.spec';

export default () => {
    describe('has a function that creates json object containing form values', () => {
        let el;
        beforeEach(() => {
            el = mount(<Form name="nestedForm" />);
        });
        it('exists', () => {
            expect(typeof el.instance().getJsonValue).toBe('function');
        });
        it('gets called by value', () => {
            const form = el.instance();
            jest.spyOn(form, 'getJsonValue').mockReturnValue({});
            const formVal = form.value;
            expect(formVal).toEqual({}); // proper Mocking
            expect(form.getJsonValue).toHaveBeenCalled();
        });
        describe('return value', () => {
            let testForm;
            const createNestedForm = () => {
                const form = new Form({ name: 'subForm' });
                form.registerElement(
                    new MockFormElement({
                        name: 'conflictEl',
                        value: 3
                    })
                );
                form.registerElement(
                    new MockFormElement({
                        name: 'otherEl',
                        value: false
                    })
                );
                form.registerElement(
                    new MockFormElement({
                        name: 'nullEl',
                        value: null
                    })
                );
                return form;
            };
            const buildForm = (form) => {
                testForm = form;
                form.registerElement(
                    new MockFormElement({
                        name: 'myEl1',
                        value: [3, 4, 5]
                    })
                );
                form.registerElement(
                    new MockFormElement({
                        value: 'shouldSkip'
                    })
                );
                form.registerElement(
                    new MockFormElement({
                        name: 'toSkip',
                        value: 'shouldSkip',
                        submittable: (value) => value !== 'shouldSkip'
                    })
                );
                form.registerElement(
                    new MockFormElement({
                        name: 'objectVal',
                        value: { field: 'ofDreams' }
                    })
                );
                form.registerElement(createNestedForm());
                form.registerElement(
                    new MockFormElement({
                        name: 'conflictEl',
                        value: 1
                    })
                );
                form.registerElement(
                    new MockFormElement({
                        name: 'conflictEl',
                        value: 'str'
                    })
                );
            };

            beforeEach(buildForm.bind(null, new Form({})));

            it('has mapping from form element name to its value', () => {
                const val = testForm.getJsonValue();
                expect(val.myEl1).toEqual([3, 4, 5]);
            });

            it('skips elements where submittable is false', () => {
                const val = testForm.getJsonValue();
                expect(val.toSkip).toBeUndefined();
            });

            it('overrides elements with confliting names', () => {
                const val = testForm.getJsonValue();
                expect(val.conflictEl).toEqual('str');
            });

            it('creates nested forms as nested json object', () => {
                const val = testForm.getJsonValue();
                expect(val.subForm).toEqual({
                    conflictEl: 3,
                    otherEl: false,
                    nullEl: null
                });
            });

            it('creates the full expectedValue', () => {
                const val = testForm.getJsonValue();
                expect(val).toEqual({
                    myEl1: [3, 4, 5],
                    objectVal: { field: 'ofDreams' },
                    conflictEl: 'str',
                    subForm: {
                        conflictEl: 3,
                        otherEl: false,
                        nullEl: null
                    }
                });
            });
        });
    });
};

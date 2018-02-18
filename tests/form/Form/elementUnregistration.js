import React from 'react';
import { mount } from 'enzyme';
import FormElement from '../../../src/form/FormElement';
import Form from '../../../src/form/Form';

class MockElement extends FormElement {}

export default () => {
    describe('unregisters element', () => {
        let form;
        let element;
        let elId;
        beforeEach(() => {
            form = mount(<Form />).instance();
            element = mount(<MockElement />).instance();
            elId = form.registerElement(element);
        });
        it('unregisters component', () => {
            expect(form.elementCount).toBe(1);
            form.unregisterElement(elId);
            expect(form.elementCount).toBe(0);
        });
        it('ignores component with unknown id', () => {
            expect(form.elementCount).toBe(1);
            form.unregisterElement(elId + 1);
            expect(form.elementCount).toBe(1);
        });
    });
};

import React from 'react';
import { mount } from 'enzyme';
import Form from '../../../src/form/Form';
import MockFormElement from '../Form.spec';

export default () => {
    describe('element registration', () => {
        let el;
        beforeEach(() => {
            el = mount(<Form name="nestedForm" />);
        });

        it('can register form elements', () => {
            expect(typeof el.instance().registerElement).toBe('function');
        });
        it('throws an error on attempt to register non Form Element', () => {
            const badRegister = () => {
                el.instance().registerElement({});
            };
            expect(badRegister).toThrow('Cannot register something that is not a FormElement');
        });
        it('returns an identifier when it registers the element', () => {
            const form = el.instance();
            const reg1 = form.registerElement(new MockFormElement());
            const reg2 = form.registerElement(new MockFormElement());
            expect(reg1).toBe(0);
            expect(reg2).toBe(1);
        });
        it('exposes registered elements as array', () => {
            const form = el.instance();
            const el1 = new MockFormElement();
            const el2 = new MockFormElement();
            const reg1 = form.registerElement(el1);
            const reg2 = form.registerElement(el2);
            expect(reg1).toBe(0);
            expect(reg2).toBe(1);
            const els = form.elements;
            expect(els).toBeInstanceOf(Array);
            expect(els.length).toBe(2);
            expect(els.findIndex((item) => item === el1)).toBeGreaterThan(-1);
            expect(els.findIndex((item) => item === el1)).toBeGreaterThan(-1);
        });
    });
};

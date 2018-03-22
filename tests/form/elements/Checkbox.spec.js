import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../../../src/form/elements/Checkbox';
import GroupableElement from '../../../src/form/elements/GroupableElement';
import Form from '../../../src/form/Form';

describe("checkbox", ()=> {
    it("is a function",()=> {
        expect(typeof Checkbox).toEqual("function");
    })

    it("has a default className",()=> {
        expect(Checkbox.defaultClassname).toEqual("__checkboxElement__");
    });

    it("is a groupable element",()=> {
        expect(new Checkbox()).toBeInstanceOf(GroupableElement)
    })

    describe("with valid instance",()=> {
        let el
        let instance;
        let onChange;
        beforeEach(()=> {
            onChange = jest.fn();
            el = mount(<Checkbox className="myClass" onChange={onChange}/>);
            instance=el.instance();
        })

        describe("actions",()=> {
            it("dispatches change event on click", ()=> {
                el.simulate("click");
                expect(onChange).toHaveBeenCalledWith(true,instance);
            })
        })

        describe("rendering", ()=> {
            it("renders a container with default class name", ()=> {
                expect(el.find("div.__checkboxElement__").length).toEqual(1)
            })

            it("appends suplied class name to container", ()=> {
                expect(el.find("div.__checkboxElement__.myClass").length).toEqual(1)
            })

            it("renders an svg in root container for a checkbox", ()=> {
                expect(el.find("div > svg").length).toEqual(1)
            })
        })

    } )


})
import { mount, shallow } from 'enzyme';
import React from 'react';
import Form from '../../../src/form/Form';

export default () => {
  const className = 'some-class-name';
  const rootForm = <Form />;
  describe('native form', () => {
    it('renders div when root form and native is true', () => {
      const component = <Form className={className} native />;
      const rendered = mount(component, {
        context: {
          rootForm: shallow(rootForm).instance()
        }
      });
      expect(rendered.find(`div.${className}`)).toHaveLength(1);
    });

    it('renders div when  no root form and native is false', () => {
      const component = <Form className={className} native={false} />;
      const rendered = mount(component, {
        context: {
          rootForm: null
        }
      });
      expect(rendered.find(`div.${className}`)).toHaveLength(1);
    });
    describe('when no root form and native is not defined', () => {
      let rendered;
      let onSubmit;
      beforeEach(() => {
        onSubmit = jest.fn();
        const component = (
          <Form className={className} onSubmit={onSubmit}>
            <div>Child</div>
          </Form>
        );
        rendered = mount(component, {
          context: {
            rootForm: null
          }
        });
      });
      it('renders the native html form element insteadof a div', () => {
        expect(rendered.find(`form.${className}`)).toHaveLength(1);
      });

      it('gives form supplied children', () => {
        expect(rendered.children()).toHaveLength(1);
      });
      describe('when native form event is submitted', () => {
        beforeEach(() => {
          rendered.find('form').simulate('submit');
        });
        it('subits the react form when native form is submitted', () => {
          expect(onSubmit).toHaveBeenCalled();
        });
      });
    });
  });
};

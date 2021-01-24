import React from 'react';
import { mount } from 'enzyme';
import Form from '../../../src/form/Form';
import TextInput from '../../../src/form/elements/TextInput';
import ErrorLabel from '../../../src/form/elements/ErrorLabel';

export default () => {
  describe('Form custom error label rendering', () => {
    let instance;
    let el;
    beforeEach(() => {
      el = mount(
        <Form>
          <TextInput data-rule-required data-msg-required="e1 required" name="el1" />
          <b>
            <ErrorLabel data-error-for="el1" for="el1" />
          </b>
        </Form>
      );
      instance = el.instance();
    });
    describe('when trying to register element that is not an Error Label', () => {
      it('throws an error', () => {
        const action = () => {
          instance.registerLabel(new TextInput({}), 'el1');
        };
        expect(action).toThrow('Cannot register something that is not a ErrorLabel');
      });
    });

    describe('when trying to unregister element that is not a registered', () => {
      it('does nothing', () => {
        expect(Object.keys(instance.labels)).toHaveLength(1);
        expect(instance.labels.el1).toBeDefined();
        instance.unregisterLabel(new ErrorLabel({}), 'el2');
        expect(Object.keys(instance.labels)).toHaveLength(1);
        expect(instance.labels.el1).toBeDefined();
      });
    });
    describe('mounting', () => {
      it('registers error labels with the parent form', () => {
        expect(Object.keys(instance.labels)).toHaveLength(1);
        expect(instance.labels.el1).toBeDefined();
      });
    });

    describe('unmounting', () => {
      it('registers error labels with the parent form', () => {
        expect(Object.keys(instance.labels)).toHaveLength(1);
        expect(instance.labels.el1).toBeDefined();
        el.unmount();
        expect(Object.keys(instance.labels)).toHaveLength(0);
      });

      describe('validation', () => {
        describe('when element has error', () => {
          beforeEach(async () => {
            try {
              await instance.validate({ showErrors: true });
            } catch (validationErrors) {
              // expected
            }
          });
          it('renders error message in linked error label', () => {
            expect(el.find('label[data-error-for="el1"]').text()).toEqual('e1 required');
          });

          it('does not render message in element with error', () => {
            const input = el.find(TextInput);
            expect(input.find('[data-role="error-msg"]')).toHaveLength(0);
          });
          describe('when element becomes valid', () => {
            beforeEach(async () => {
              const textInput = el.find(TextInput);
              textInput.setState({ value: 'value' });
              await instance.validate({ showErrors: true });
            });

            it('clears error message in linked error label', () => {
              expect(el.find('label[data-error-for="el1"]').text()).toEqual('');
            });

            it('does not render message in element with error', () => {
              const input = el.find(TextInput);
              expect(input.find('[data-role="error-msg"]')).toHaveLength(0);
            });
          });
        });
      });
    });
  });
};

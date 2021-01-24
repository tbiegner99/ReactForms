import React from 'react';
import { mount } from 'enzyme';
import Button, { SubmitButton } from '../../../src/form/elements/Button';
import GroupableElement from '../../../src/form/elements/GroupableElement';
import Form from '../../../src/form/Form';
import InputGroup from '../../../src/form/elements/InputGroup';

describe('Button Tests', () => {
  let button;
  beforeEach(() => {
    button = mount(<Button />).instance();
  });

  it('exists', () => {
    expect(typeof Button).toBe('function');
  });

  it('is a groupable element', () => {
    expect(button).toBeInstanceOf(GroupableElement);
  });

  it('has a default button type', () => {
    expect(button.type).toBe('default');
  });

  it('has submittable from props', () => {
    expect(button.submittable).toBe(false);
    button = mount(<Button submittable />).instance();

    expect(button.submittable).toBe(true);
  });

  it('contains a value from props', () => {
    expect(button.value).toBeUndefined();
    button = mount(<Button submittable value={6} />).instance();

    expect(button.value).toBe(6);
  });

  describe('when is part of input group', () => {
    let group;
    let submitButton;
    let buttonInstance;
    beforeEach(() => {
      group = mount(<InputGroup />).instance();
      submitButton = mount(<Button value={6} name="btn" />, {
        context: {
          inputGroup: group
        }
      });
      buttonInstance = submitButton.instance();
      jest.spyOn(buttonInstance, 'select').mockResolvedValue();
    });

    it('selects current button', async () => {
      await buttonInstance.onClick();
      expect(buttonInstance.select).toHaveBeenCalled();
    });
  });

  describe('Submit Button', () => {
    let wrapper;
    let submit;
    beforeEach(() => {
      submit = jest.fn();
      wrapper = mount(
        <Form onSubmit={submit} native={false}>
          <SubmitButton data-prop="value">Submit</SubmitButton>
        </Form>
      );
    });

    it('submits form onClick', async () => {
      wrapper.find('button').simulate('click');
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(submit).toHaveBeenCalled();
    });
  });

  describe('on click', () => {
    it('raises event', async () => {
      const clickSpy = jest.fn();
      const submitButton = mount(<Button onClick={clickSpy} submittable value="me" name="btn" />);
      await submitButton.instance().onClick();
      expect(clickSpy).toHaveBeenCalled();
    });

    describe('is submit button', () => {
      let buttonForm;
      let submitButton;
      let submitSpy;
      let buttonInstance;
      beforeEach(() => {
        submitSpy = jest.fn();
        buttonForm = mount(<Form onSubmit={submitSpy} native={false} />).instance();
        submitButton = mount(<Button submittable onClick={() => 0} value={6} name="btn" />, {
          context: {
            rootForm: buttonForm,
            parentForm: buttonForm
          }
        });
        buttonInstance = submitButton.instance();
      });

      it('cancels submission if onClick returns false', async () => {
        submitButton = mount(<Button onClick={() => false} submittable value="me" name="btn" />, {
          context: {
            rootForm: buttonForm,
            parentForm: buttonForm
          }
        });
        buttonInstance = submitButton.instance();

        await buttonInstance.onClick(null);
        expect(submitSpy).not.toHaveBeenCalled();
      });
      it('calls onClick function on click', () => {
        const mock = jest.spyOn(buttonInstance, 'onClick');
        submitButton.simulate('click');
        expect(mock).toHaveBeenCalled();
      });
      it('fires form submission onClick', async () => {
        await buttonInstance.onClick(null);

        expect(submitSpy).toHaveBeenCalledWith({ btn: 6 }, buttonForm);
      });
      it('does not submit form without root form', async () => {
        submitButton = mount(<Button onClick={() => false} submittable value="me" name="btn" />, {
          context: {
            parentForm: buttonForm
          }
        });
        buttonInstance = submitButton.instance();

        await buttonInstance.onClick(null);
        expect(submitSpy).not.toHaveBeenCalled();
      });
      it('does not submit form if button is not submittable', async () => {
        submitButton = mount(<Button value="me" name="btn" />, {
          context: {}
        });
        buttonInstance = submitButton.instance();

        await expect(buttonInstance.onClick(null)).resolves.toBeUndefined();
        expect(submitSpy).not.toHaveBeenCalled();
      });
    });
  });
});

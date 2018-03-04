import React from 'react';
import { mount } from 'enzyme';
import Button from '../../../src/form/elements/Button';
import Form from '../../../src/form/Form';

describe('Button Tests', () => {
  let button;
  beforeEach(() => {
    button = mount(<Button />).instance();
  });

  it('exists', () => {
    expect(typeof Button).toBe('function');
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

  it('returns a default class name with type', () => {
    expect(button.defaultClassName).toBe('__btn_default__');
  });

  describe('on click', () => {
    it('raises event', () => {
      const clickSpy = jest.fn();
      const submitButton = mount(<Button onClick={clickSpy} submittable value="me" name="btn" />);
      submitButton.simulate('click');
      expect(clickSpy).toHaveBeenCalled();
    });
    describe('is submit button', () => {
      let buttonForm;
      let submitButton;
      let submitSpy;
      let buttonInstance;
      beforeEach(() => {
        submitSpy = jest.fn();
        buttonForm = mount(<Form onSubmit={submitSpy} />).instance();
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

        await expect(buttonInstance.onClick(null)).resolves.toBeUndefined();
        expect(submitSpy).not.toHaveBeenCalled();
      });
      it('calls onClick function on click', () => {
        const mock = jest.spyOn(buttonInstance, 'onClick');
        submitButton.simulate('click');
        expect(mock).toHaveBeenCalled();
      });
      it('fires form submission onClick', async () => {
        await expect(buttonInstance.onClick(null)).resolves.not.toBeUndefined();

        expect(submitSpy).toHaveBeenCalledWith({ btn: 6 }, buttonForm);
      });
      it('does not submit form without root form', async () => {
        submitButton = mount(<Button onClick={() => false} submittable value="me" name="btn" />, {
          context: {
            parentForm: buttonForm
          }
        });
        buttonInstance = submitButton.instance();

        await expect(buttonInstance.onClick(null)).resolves.toBeUndefined();
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

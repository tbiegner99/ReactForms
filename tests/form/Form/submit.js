import React from 'react';
import { mount } from 'enzyme';
import FormElement from '../../../src/form/FormElement';
import Form from '../../../src/form/Form';

class MockFormElement extends FormElement {
  get value() {
    return this.props.value;
  }

  get isValid() {
    return true;
  }
}

export default () => {
  describe('submit action', () => {
    it('passes action to root form if not root', async () => {
      const rootForm = new Form({});
      const submitSpy = jest.fn();
      const formJsx = (
        <Form onSubmit={submitSpy}>
          <MockFormElement name="el" value={3} />
        </Form>
      );
      const form = mount(formJsx, {
        context: {
          rootForm,
          parentForm: rootForm
        }
      });
      const rootSubmitSpy = jest.spyOn(rootForm, 'submit');
      await form.instance().submit();
      expect(submitSpy).not.toHaveBeenCalled();
      expect(rootSubmitSpy).toHaveBeenCalled();
    });
    it('maintains submit attempts', async () => {
      const formJsx = (
        <Form>
          <MockFormElement name="el" value={3} />
        </Form>
      );
      const form = mount(formJsx);
      const validateSpy = jest.spyOn(form.instance(), 'validate').mockReturnValue({ valid: true });
      await form.instance().submit();
      await form.instance().submit();
      expect(form.instance().submitAttempts).toBe(2);
      form.instance().clearSubmitAttempts();
      expect(form.instance().submitAttempts).toBe(0);
      await form.instance().submit();
      expect(form.instance().submitAttempts).toBe(1);
      expect(validateSpy).toHaveBeenCalled();
    });
    it('performs expected submission sequence', async () => {
      const submitSpy = jest.fn();
      const submitFailSpy = jest.fn();
      const beforeSubmitSpy = jest.fn().mockReturnValue(0);
      const formJsx = (
        <Form
          onSubmit={submitSpy}
          onBeforeSubmit={beforeSubmitSpy}
          onSubmissionFailure={submitFailSpy}
        >
          <MockFormElement name="el" value={3} />
        </Form>
      );
      const form = mount(formJsx);
      const validateSpy = jest.spyOn(form.instance(), 'validate').mockReturnValue({ valid: true });
      const result = await form.instance().submit();

      expect(validateSpy).toHaveBeenCalled();
      expect(submitSpy).toHaveBeenCalledWith({ el: 3 }, form.instance());
      expect(beforeSubmitSpy).toHaveBeenCalled();
      expect(submitFailSpy).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        validationResult: { valid: true },
        message: 'Success',
        value: { el: 3 },
        details: undefined
      });
    });
    it('does not require any submission events to submit successfully', async () => {
      const submitSpy = jest.fn();
      const beforeSubmitSpy = jest.fn().mockReturnValue('false');
      const formJsx = (
        <Form>
          <MockFormElement name="el" value={3} />
        </Form>
      );
      const form = mount(formJsx);
      const validateSpy = jest.spyOn(form.instance(), 'validate').mockReturnValue({ valid: true });
      const result = await form.instance().submit();

      expect(validateSpy).toHaveBeenCalled();
      expect(submitSpy).not.toHaveBeenCalled();
      expect(beforeSubmitSpy).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        validationResult: { valid: true },
        message: 'Success',
        value: { el: 3 },
        details: undefined
      });
    });
    describe('failure cases', () => {
      it('invokes pre submit event even if validation fails', async () => {
        const submitSpy = jest.fn();
        const beforeSubmitSpy = jest.fn();
        const formJsx = (
          <Form onSubmit={submitSpy} onBeforeSubmit={beforeSubmitSpy}>
            <MockFormElement name="el" value={3} />
          </Form>
        );
        const form = mount(formJsx);
        const validateSpy = jest.spyOn(form.instance(), 'validate').mockImplementation(() => {
          const err = { valid: false };
          throw err;
        });

        const result = await form.instance().submit();

        const expectResult = {
          success: false,
          validationResult: { valid: false },
          message: 'Validation failed',
          value: { el: 3 }
        };

        expect(validateSpy).toHaveBeenCalled();
        expect(submitSpy).not.toHaveBeenCalled();
        expect(beforeSubmitSpy).toHaveBeenCalled();
        expect(result).toEqual(expectResult);
      });
      it('should cancel submission if presubmit returns rejected promise', async () => {
        const submitSpy = jest.fn();
        const beforeSubmitSpy = jest.fn().mockImplementation(() => {
          const reject = { message: 'Error occurred' };
          throw reject;
        });
        const formJsx = (
          <Form onSubmit={submitSpy} onBeforeSubmit={beforeSubmitSpy}>
            <MockFormElement name="el" value={3} />
          </Form>
        );
        const form = mount(formJsx);
        const validateSpy = jest
          .spyOn(form.instance(), 'validate')
          .mockReturnValue({ valid: true });

        const result = await form.instance().submit();

        const expectResult = {
          success: false,
          validationResult: { valid: true },
          message: 'Presubmit failed',
          value: { el: 3 },
          details: { message: 'Error occurred' }
        };

        expect(validateSpy).toHaveBeenCalled();
        expect(submitSpy).not.toHaveBeenCalled();
        expect(beforeSubmitSpy).toHaveBeenCalled();
        expect(result).toEqual(expectResult);
      });
      it('should cancel submission if presubmit returns false', async () => {
        const submitSpy = jest.fn();
        const beforeSubmitSpy = jest.fn().mockReturnValue(false);
        const formJsx = (
          <Form onSubmit={submitSpy} onBeforeSubmit={beforeSubmitSpy}>
            <MockFormElement name="el" value={3} />
          </Form>
        );
        const form = mount(formJsx);
        const validateSpy = jest
          .spyOn(form.instance(), 'validate')
          .mockReturnValue({ valid: true });

        const result = await form.instance().submit();

        const expectResult = {
          success: false,
          validationResult: { valid: true },
          message: 'Presubmit failed',
          value: { el: 3 },
          details: { message: 'Returned false' }
        };

        expect(validateSpy).toHaveBeenCalled();
        expect(submitSpy).not.toHaveBeenCalled();
        expect(beforeSubmitSpy).toHaveBeenCalled();
        expect(result).toEqual(expectResult);
      });
      it('handles error from onSubmit', async () => {
        const submitSpy = jest.fn().mockImplementation(() => {
          throw new Error('An error happened');
        });
        const beforeSubmitSpy = jest.fn();
        const formJsx = (
          <Form onSubmit={submitSpy} onBeforeSubmit={beforeSubmitSpy}>
            <MockFormElement name="el" value={3} />
          </Form>
        );
        const form = mount(formJsx);
        const validateSpy = jest
          .spyOn(form.instance(), 'validate')
          .mockReturnValue({ valid: true });
        const result = await form.instance().submit();

        const expectResult = {
          success: false,
          validationResult: { valid: true },
          message: 'Submission failed',
          value: { el: 3 },
          details: new Error('An error happened')
        };

        expect(validateSpy).toHaveBeenCalled();
        expect(submitSpy).toHaveBeenCalled();
        expect(beforeSubmitSpy).toHaveBeenCalled();
        expect(result).toEqual(expectResult);
      });
      it('invokes on submit failure event on submission failures', async () => {
        const submitFailSpy = jest.fn();
        const formJsx = (
          <Form onSubmissionFailure={submitFailSpy}>
            <MockFormElement name="el" value={3} />
          </Form>
        );
        const form = mount(formJsx);
        const validateSpy = jest.spyOn(form.instance(), 'validate').mockImplementation(() => {
          const err = { valid: false };
          throw err;
        });
        await form.instance().submit();

        expect(validateSpy).toHaveBeenCalled();
        expect(submitFailSpy).toHaveBeenCalledWith({
          success: false,
          validationResult: { valid: false },
          message: 'Validation failed',
          value: { el: 3 }
        });
      });
    });
  });
};

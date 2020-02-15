import React from 'react';
import PropTypes from 'prop-types';
import FormElement from './FormElement';
import { ResolveFunction } from '../utils/CommonFunctions';
import ValueEnforcer from '../utils/ValueEnforcer';
import ErrorLabel from './elements/ErrorLabel';
import ArrayUtilities from '../utils/ArrayUtilities';

const _nextElementId = Symbol('_nextElementId');
const _elements = Symbol('_elements');
const _labels = Symbol('_labels');
const _submitAttempts = Symbol('_submitAttempts');
const _validationState = Symbol('validationState');

export default class Form extends FormElement {
  static childContextTypes = {
    rootForm: PropTypes.instanceOf(Form),
    parentForm: PropTypes.instanceOf(Form)
  };

  static propTypes = {
    ...FormElement.propTypes,
    onSubmitAttempt: PropTypes.func
  };

  static defaultProps = {
    ...FormElement.defaultProps,
    onSubmitAttempt: ResolveFunction
  };

  constructor(props) {
    super(props);
    this[_submitAttempts] = 0;
    this[_nextElementId] = 0;
    this[_elements] = {};
    this[_labels] = {};
    this[_validationState] = {
      valid: undefined,
      numberOfInvalidElements: 0,
      elementResults: {}
    };
  }

  get submitAttempts() {
    return this[_submitAttempts];
  }

  get value() {
    return this.getJsonValue();
  }

  get labels() {
    return Object.assign({}, this[_labels]);
  }

  get elements() {
    return Object.values(this[_elements]);
  }

  get elementCount() {
    return Object.values(this[_elements]).length;
  }

  get useNativeForm() {
    const { native } = this.props;
    const { rootForm } = this.context;
    return !rootForm && native !== false;
  }

  get rootForm() {
    return this.context && this.context.rootForm;
  }

  get parentForm() {
    return this.context && this.context.parentForm;
  }

  get validationState() {
    return Object.assign({}, this[_validationState]);
  }

  clearSubmitAttempts() {
    this[_submitAttempts] = 0;
  }

  getJsonValue() {
    const ret = {};
    const submittables = this.elements.filter((el) => el.submittable);
    submittables.forEach((el) => {
      ret[el.name] = el.value;
    });
    return ret;
  }

  notifyElementValidationState(element, validationResults) {
    const { onValidationStateChange } = this.props;
    let validationState = this[_validationState];
    const isCurrentValid = validationState.valid;
    validationState = this._addElementToValidationResults(
      validationState,
      element,
      validationResults
    );
    validationState = this._rectifyValidationState(validationState);

    if (validationState.valid !== isCurrentValid) {
      onValidationStateChange(validationState.valid, this, validationState);
    }
  }

  _rectifyValidationState(validationState) {
    const { elementResults } = validationState;
    const formValidStateFromElement = (currentFormState, elementValidState) => {
      const nextFormState = {
        valid: currentFormState.valid && elementValidState.valid,
        numberOfInvalidElements:
          currentFormState.numberOfInvalidElements + elementValidState.numberOfInvalidElements
      };
      return Object.assign(currentFormState, nextFormState);
    };

    const validationStateFromElements = Object.values(elementResults).reduce(
      formValidStateFromElement,
      {
        valid: true,
        numberOfInvalidElements: 0
      }
    );

    return Object.assign(validationState, validationStateFromElements);
  }

  _addElementToValidationResults(validationState, element, elementValidationResults) {
    const { elementResults } = validationState;

    if (!element.submittable) {
      delete elementResults[element.uniqueId];
    } else {
      elementResults[element.uniqueId] = elementValidationResults;
    }

    return validationState;
  }

  registerLabel(label, elementName) {
    if (!(label instanceof ErrorLabel)) {
      throw new Error('Cannot register something that is not a ErrorLabel');
    }
    this[_labels][elementName] = label;
  }

  unregisterLabel(label, elementName) {
    if (this[_labels][elementName]) {
      delete this[_labels][elementName];
    }
  }

  registerElement(element) {
    if (!(element instanceof FormElement)) {
      throw new Error('Cannot register something that is not a FormElement');
    }
    const registeredElementId = this[_nextElementId];
    this[_elements][registeredElementId] = element;
    this[_nextElementId]++;

    return registeredElementId;
  }

  unregisterElement(elementId) {
    if (this[_elements][elementId]) {
      delete this[_elements][elementId];
    }
  }

  getChildContext() {
    return {
      rootForm: this.context.rootForm || this,
      parentForm: this
    };
  }

  async validate(opts) {
    let options = ValueEnforcer.toBeObject(opts, {});
    options = Object.assign({}, { noNotify: true }, options);
    const alwaysResolveValidationWithResults = async (el) => {
      let results;
      try {
        results = await el.validate(options);
      } catch (failureResults) {
        results = failureResults;
      }
      return {
        uniqueId: el.uniqueId,
        element: el,
        fullName: el.fullName,
        name: el.name,
        valid: results.valid,
        results
      };
    };
    const submittableElements = this.elements.filter((el) => el.submittable);
    const validationPromises = submittableElements.map(alwaysResolveValidationWithResults);
    const validationReport = await Promise.all(validationPromises);

    const aggregateReport = (accumulator, elementReport) => {
      const { results } = elementReport;
      const elementResults = Object.assign(accumulator.elementResults, {
        [elementReport.uniqueId]: results
      });
      const resultsToAppend = {
        name: this.fullName,
        isForm: true,
        uniqueId: this.uniqueId,
        valid: accumulator.valid && elementReport.valid,
        numberOfInvalidElements:
          accumulator.numberOfInvalidElements + results.numberOfInvalidElements,
        elementResults
      };
      return Object.assign(accumulator, resultsToAppend);
    };

    const results = validationReport.reduce(aggregateReport, {
      valid: true,
      numberOfInvalidElements: 0,
      elementResults: {}
    });

    this[_validationState] = results;
    this.setState({
      validationResults: Object.assign({}, results),
      vaild: results.valid
    });

    if (results.valid) {
      return results;
    }
    if (options.showErrors) {
      this.handleValidationFailures(results);
    }
    throw results;
  }

  async fullValidate() {
    return this.validate({ showErrors: true });
  }

  getLabelForElement(elementName) {
    return this[_labels][elementName];
  }

  hasLabelForElement(elementName) {
    return Boolean(this.getLabelForElement(elementName));
  }

  clearErrorMessages(result, containingForm) {
    const { name, uniqueId, isForm } = result;

    if (this.hasLabelForElement(name)) {
      const label = this.getLabelForElement(name);
      label.clearMessage();
    }

    if (isForm) {
      const element = containingForm[_elements][uniqueId];
      this.handleValidationFailures(result, element);
    }
  }

  coordinateErrorMessageRendering(failureResult, containingForm) {
    const { name, uniqueId, isForm, message, ruleName } = failureResult;
    const element = containingForm[_elements][uniqueId];
    if (this.hasLabelForElement(name)) {
      const label = this.getLabelForElement(name);
      label.forceMessage(message, ruleName, { failureResult });
      element.yieldErrorLabelManagement();
    }
    if (isForm) {
      this.handleValidationFailures(failureResult, element);
    }
  }

  handleValidationFailures(results, containingForm = this) {
    const { elementResults } = results;
    const resultsArray = Object.values(elementResults);
    const validity = (item) => item.valid;
    const elementsByValidity = ArrayUtilities.partitionBy(resultsArray, validity);
    elementsByValidity.false.forEach((result) =>
      this.coordinateErrorMessageRendering(result, containingForm)
    );
    elementsByValidity.true.forEach((result) => this.clearErrorMessages(result));
  }

  async submit() {
    if (this.rootForm) {
      return this.context.rootForm.submit();
    }
    this[_submitAttempts]++;
    const formValue = this.getJsonValue();
    const chainStatus = {
      success: false,
      validationResult: null,
      message: null,
      value: formValue
    };
    const { onBeforeSubmit, onSubmit, onSubmissionFailure } = this.props;
    const executeBeforeSubmit = async () => {
      let beforeSubmitResult;
      try {
        if (typeof onBeforeSubmit !== 'function') return;
        beforeSubmitResult = await onBeforeSubmit(chainStatus.validationResult);
      } catch (e) {
        chainStatus.message = 'Presubmit failed';
        chainStatus.details = e;
        throw chainStatus;
      }
      if (beforeSubmitResult === false) {
        chainStatus.message = 'Presubmit failed';
        chainStatus.details = { message: 'Returned false' };
        throw chainStatus;
      }
    };

    const checkValidation = async (validationResult) => {
      if (!validationResult.valid) {
        chainStatus.message = 'Validation failed';
        throw chainStatus;
      }
    };

    const doSubmit = async () => {
      try {
        if (typeof onSubmit === 'function') {
          const submitResult = await onSubmit(formValue, this);
          chainStatus.details = submitResult;
        }
        chainStatus.success = true;
        chainStatus.message = 'Success';
      } catch (e) {
        chainStatus.message = 'Submission failed';
        chainStatus.details = e;
        throw chainStatus;
      }
    };
    try {
      chainStatus.validationResult = await this.validate({ showErrors: true });
    } catch (results) {
      chainStatus.validationResult = results;
    }
    try {
      await executeBeforeSubmit();
      await checkValidation(chainStatus.validationResult);
      await doSubmit();
      return chainStatus;
    } catch (failure) {
      if (typeof onSubmissionFailure === 'function') {
        onSubmissionFailure(failure);
      }
      throw failure;
    }
  }

  async submitNativeForm(evt) {
    evt.preventDefault();
    await this.submit();
  }

  render() {
    const { className, children } = this.props;
    if (this.useNativeForm) {
      return (
        <form onSubmit={(e) => this.submitNativeForm(e)} className={className}>
          {children}
        </form>
      );
    }
    return <div className={className}>{children}</div>;
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import ValidationManager from '../validation/ValidationRuleManager';
import { NoOperation } from '../utils/CommonFunctions';

const _uniqueId = Symbol('_uniqueId');
export default class FormElement extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    submittable: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    validateOnChange: PropTypes.bool,
    validateOnBlur: PropTypes.bool,

    onValidationStateChange: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
  };

  static defaultProps = {
    submittable: undefined,
    name: undefined,
    validateOnChange: undefined,
    validateOnBlur: undefined,

    onValidationStateChange: NoOperation,
    onChange: NoOperation,
    onBlur: NoOperation
  };

  static contextTypes = {
    parentForm: PropTypes.instanceOf(FormElement),
    rootForm: PropTypes.instanceOf(FormElement)
  };

  constructor(props) {
    super(props);
    this.state = {
      showErrors: false,
      valid: undefined,
      validationResults: null
    };
    this.componentWillMount = this.willMount.bind(this, this.componentWillMount);
    this.componentWillUnmount = this.willUnmount.bind(this, this.componentWillUnmount);
  }

  async onChange(newValue) {
    const { onChange } = this.props;
    const triggerEvent = () => onChange(newValue, this);

    if (this.validateOnChange) {
      await this.fullValidate()
        .then(triggerEvent)
        .catch(triggerEvent);
    }
    triggerEvent();
  }

  async onBlur(e) {
    const { onBlur } = this.props;
    const triggerEvent = () => onBlur(e, this);

    if (this.validateOnBlur) {
      await this.fullValidate()
        .then(triggerEvent)
        .catch(triggerEvent);
    }
    triggerEvent();
  }

  get validateOnChange() {
    if (typeof this.props.validateOnChange === 'boolean') {
      return this.props.validateOnChange;
    } else if (this.parentForm) {
      return this.parentForm.validateOnChange;
    }
    return false;
  }

  get value() {
    return null;
  }

  get validateOnBlur() {
    if (typeof this.props.validateOnBlur === 'boolean') {
      return this.props.validateOnBlur;
    } else if (this.parentForm) {
      return this.parentForm.validateOnBlur;
    }
    return false;
  }

  get showErrors() {
    return this.state.showErrors;
  }

  get isValid() {
    return this.state.valid;
  }

  get validationResults() {
    return this.state.validationResults;
  }

  get parentForm() {
    return this.context && this.context.parentForm;
  }

  get rootForm() {
    return this.context && this.context.rootForm;
  }

  get name() {
    return this.props.name;
  }

  get uniqueId() {
    return this[_uniqueId];
  }

  get fullName() {
    if (this.parentForm && this.name) {
      const parentName = this.parentForm.fullName ? `${this.parentForm.fullName}.` : '';
      return `${parentName}${this.name}`;
    }
    return this.name;
  }

  get submittable() {
    if (typeof this.props.submittable === 'function') {
      return !!this.props.submittable(this.value, this);
    }
    if (typeof this.props.submittable === 'boolean') {
      return this.props.submittable;
    }
    return !!this.name;
  }

  get errorMessage() {
    if (this.validationResults && !this.validationResults.valid) {
      return this.validationResults.message;
    }
    return null;
  }

  setState(newState, callback) {
    return new Promise((resolve) =>
      super.setState(newState, () => {
        if (typeof callback === 'function') {
          callback(newState);
        }
        resolve(newState);
      })
    );
  }

  willMount(componentWillMount) {
    this[_uniqueId] = this._registerSelf();
    if (typeof componentWillMount === 'function') {
      componentWillMount.bind(this)();
    }
    this.validate();
  }

  willUnmount(componentWillUnmount) {
    this._unregisterSelf();
    if (typeof componentWillUnmount === 'function') {
      componentWillUnmount.bind(this)();
    }
  }

  async validate(opts) {
    const options = opts || {};
    let validationOutput;
    try {
      validationOutput = await ValidationManager.validate(this.value, this.props);
    } catch (failureResults) {
      validationOutput = failureResults;
    }
    Object.assign(validationOutput, { name: this.fullName });
    const elementIsValid = validationOutput.valid;
    const validationStateChange = elementIsValid !== this.state.valid;

    return new Promise((resolve, reject) => {
      this.setState(
        {
          valid: elementIsValid,
          validationResults: validationOutput,
          showErrors: options.showErrors
        },
        () => {
          const { validationResults } = this.state;
          if (!options.noNotify) this._notifyParentOfValidationState(validationResults);
          this._raiseValidationStateChangeEvent(validationStateChange, validationResults);
          if (elementIsValid) {
            resolve(validationOutput);
          } else {
            reject(validationOutput);
          }
        }
      );
    });
  }

  async fullValidate() {
    return this.validate({ showErrors: true });
  }

  _notifyParentOfValidationState(validationState) {
    if (this.parentForm) {
      this.parentForm.notifyElementValidationState(this, validationState);
    }
  }

  _raiseValidationStateChangeEvent(validationStateChange, validationResults) {
    if (validationStateChange) {
      this.props.onValidationStateChange(validationResults.valid, this, validationResults);
    }
  }

  _registerSelf() {
    if (this.context.parentForm) {
      return this.context.parentForm.registerElement(this);
    }
    return null;
  }

  _unregisterSelf() {
    if (this.context.parentForm) {
      return this.context.parentForm.unregisterElement(this.uniqueId);
    }
    return null;
  }

  render() {
    return null;
  }
}

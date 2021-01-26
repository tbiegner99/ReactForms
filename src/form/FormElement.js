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
    hideErrors: PropTypes.bool,

    onValidationFinished: PropTypes.func,
    onValidationStateChange: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
  };

  static contextTypes = {
    parentForm: PropTypes.instanceOf(FormElement),
    rootForm: PropTypes.instanceOf(FormElement)
  };

  static defaultProps = {
    hideErrors: false,
    submittable: undefined,
    name: undefined,
    validateOnChange: undefined,
    validateOnBlur: undefined,

    onValidationFinished: NoOperation,
    onValidationStateChange: NoOperation,
    onChange: NoOperation,
    onBlur: NoOperation
  };

  constructor(props) {
    super(props);
    this.state = {
      showErrors: false,
      valid: undefined,
      validationResults: null
    };
    this.mounted = false;
    this.unmounted = false;
    this.componentDidMount = this.willMount.bind(this, this.componentDidMount);
    this.componentWillUnmount = this.willUnmount.bind(this, this.componentWillUnmount);
  }

  async onChange(newValue, ...args) {
    const { onChange } = this.props;
    const triggerEvent = () => onChange(newValue, this, ...args);

    if (this.validateOnChange) {
      try {
        await this.fullValidate();
      } catch (e) {
        // do nothing
      }
    }
    triggerEvent();
  }

  async onBlur(evt) {
    const { onBlur } = this.props;
    const triggerEvent = () => onBlur(evt, this);

    if (this.validateOnBlur) {
      try {
        await this.fullValidate();
      } catch (ex) {
        // do nothing
      }
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
    return !this.props.hideErrors && this.state.showErrors && !this.state.ignoreErrorRendering;
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

  async willMount(componentWillMount) {
    this[_uniqueId] = this._registerSelf();
    if (!this.mounted && typeof componentWillMount === 'function') {
      this.mounted = true;
      componentWillMount.bind(this)();
    }
    try {
      await this.validate({ ignoreFailure: true });
    } catch (err) {
      // do nothing
    }
  }

  willUnmount(componentWillUnmount) {
    this._unregisterSelf();
    if (!this.unmounted && typeof componentWillUnmount === 'function') {
      this.unmounted = true;
      componentWillUnmount.bind(this)();
    }
  }

  yieldErrorLabelManagement() {
    this.setState({
      ignoreErrorRendering: true
    });
  }

  async validate(opts) {
    const options = opts || {};
    let validationOutput;
    try {
      const formState = this.context.rootForm ? this.context.rootForm.getJsonValue() : {};
      validationOutput = await ValidationManager.validate(this.value, this.props, formState);
    } catch (failureResults) {
      validationOutput = failureResults;
    }
    Object.assign(validationOutput, {
      name: this.fullName,
      isForm: false,
      uniqueId: this.uniqueId
    });
    const elementIsValid = validationOutput.valid;
    const validationStateChange = elementIsValid !== this.state.valid;
    await this.setState({
      valid: elementIsValid,
      validationResults: validationOutput,
      showErrors: options.showErrors
    });

    const { validationResults } = this.state;
    if (!options.noNotify) {
      this._notifyParentOfValidationState(validationResults, options.showErrors);
    }
    this._raiseValidationStateChangeEvent(validationStateChange, validationResults);
    if (!elementIsValid && !options.ignoreFailure) {
      throw validationOutput;
    }
    return validationOutput;
  }

  async fullValidate() {
    return this.validate({ showErrors: true });
  }

  _notifyParentOfValidationState(validationState, showErrors) {
    if (this.parentForm) {
      this.parentForm.notifyElementValidationState(this, validationState, showErrors);
    }
  }

  _raiseValidationStateChangeEvent(validationStateChange, validationResults) {
    if (validationStateChange) {
      this.props.onValidationStateChange(validationResults.valid, this, validationResults);
    }
    this.props.onValidationFinished(validationResults);
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

  renderErrorLabel() {
    if (!this.showErrors) {
      return null;
    }
    return <span data-role="error-msg">{this.errorMessage}</span>;
  }

  render() {
    return null;
  }
}

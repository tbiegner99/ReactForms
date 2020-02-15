import PropTypes from 'prop-types';
import Label from './Label';
import FormElement from '../FormElement';
import { IdentityFunction } from '../../utils/CommonFunctions';

class ErrorLabel extends Label {
  static propTypes = {
    ...Label.propTypes,
    message: PropTypes.string,
    onFormatMessage: PropTypes.func.isRequired,
    for: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(FormElement)])
  };

  static defaultProps = {
    ...Label.defaultProps,
    message: null,
    onFormatMessage: IdentityFunction,
    for: undefined
  };

  static contextTypes = {
    rootForm: PropTypes.instanceOf(FormElement)
  };

  get htmlFor() {
    return this.elementName;
  }

  get elementName() {
    const { for: forProp } = this.props;
    if (forProp instanceof FormElement) {
      return forProp.fullName;
    }
    return forProp;
  }

  get renderedMessage() {
    const { forced, message, ruleViolated, metadata } = this.state;
    const { onFormatMessage, children, message: propMessage } = this.props;
    if (forced) {
      const messageForRule = this.props[`data-msg-${ruleViolated}`];
      const messageToDisplay = messageForRule || propMessage || message;
      return onFormatMessage(messageToDisplay, ruleViolated, metadata, this.props, this.state);
    }
    return children;
  }

  clearMessage() {
    return this.setState({
      forced: false,
      message: null,
      metadata: null
    });
  }

  forceMessage(text, ruleViolated, metadata) {
    return this.setState({ forced: true, ruleViolated, message: text, metadata });
  }

  componentWillMount() {
    this.setState({
      id: this._registerSelf()
    });
  }

  componentWillUnmount() {
    this._unregisterSelf();
  }

  _registerSelf() {
    const { rootForm } = this.context;
    if (rootForm) {
      rootForm.registerLabel(this, this.elementName);
    }
  }

  _unregisterSelf() {
    const { rootForm } = this.context;
    if (rootForm) {
      rootForm.unregisterLabel(this, this.elementName);
    }
  }
}

export default ErrorLabel;

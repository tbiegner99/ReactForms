import React from 'react';
import PropTypes from 'prop-types';
import FormElement from '../FormElement';
import { NoOperation } from '../../utils/CommonFunctions';

export default class Button extends FormElement {
  static propTypes = {
    ...FormElement.defaultProps,
    onClick: PropTypes.func
  };

  static defaultProps = {
    ...FormElement.defaultProps,
    onClick: NoOperation
  };

  get value() {
    return this.props.value;
  }

  get defaultClassName() {
    return `__btn_${this.type}__`;
  }

  get type() {
    return 'default';
  }

  get submittable() {
    return !!this.props.submittable;
  }

  _isSubmittable() {
    return this.submittable && this.rootForm;
  }

  onClick(e) {
    const cancel = this.props.onClick(e) === false;
    if (cancel) return Promise.resolve();
    if (this._isSubmittable()) {
      return this.rootForm.submit();
    }
    return Promise.resolve();
  }

  render() {
    const { className } = this.props;
    return (
      <button
        onClick={(e) => this.onClick(e)}
        className={`${this.defaultClassName} ${className}`}
      />
    );
  }
}

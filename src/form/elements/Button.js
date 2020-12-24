import React from 'react';
import combineClasses from "classnames"
import PropTypes from 'prop-types';
import GroupableElement from './GroupableElement';
import { NoOperation } from '../../utils/CommonFunctions';

export default class Button extends GroupableElement {
  static propTypes = {
    ...GroupableElement.propTypes,
    submittable: PropTypes.bool,
    onClick: PropTypes.func
  };

  static defaultProps = {
    ...GroupableElement.defaultProps,
    submittable: false,
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
    return this.props.type === 'submit' || !!this.props.submittable;
  }

  _isSubmittable() {
    return this.submittable && this.rootForm && !this.rootForm.useNativeForm;
  }

  async onClick(e) {
    const cancel = (await this.props.onClick(e)) === false;
    if (cancel) return;
   
    try {
      if (this.context.inputGroup) {
        await this.select();
      }
      if (this.rootForm && this._isSubmittable()) {
        await this.rootForm.submit();
      }
    } catch (err) {
      console.error(err)
      // do nothing on submission fail. form will handle it
    }
  }

  render() {
    const { className, children, type, ...otherProps } = this.props;
    const buttonType = this.submittable ? 'submit' : 'button';
    const selected = this.selected;
    return (
      <button
        type={buttonType}
        {...otherProps}
        onClick={(e) => this.onClick(e)}
        className={combineClasses(this.defaultClassName, className, {selected})}
      >
        {children}
      </button>
    );
  }
}

export const SubmitButton = (props) => <Button {...props} submittable />;

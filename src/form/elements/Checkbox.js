import React from 'react';
import GroupableElement from './GroupableElement';
import ValueEnforcer from '../../utils/ValueEnforcer';

import './styles/Checkbox.css';

export default class Checkbox extends GroupableElement {
  static defaultClassname = '__checkboxElement__';

  constructor(props) {
    super(props);
    let defaultChecked = ValueEnforcer.toNotBeNullOrUndefined(props.defaultChecked, false);
    defaultChecked = ValueEnforcer.toNotBeNullOrUndefined(props.checked, defaultChecked);
    this.state = Object.assign(this.state, { checked: defaultChecked });
  }

  get value() {
    const { checked } = this.state;
    const { checkedValue = true, falseValue = false } = this.props;

    return checked ? checkedValue : falseValue;
  }

  async onClick() {
    await this.setState({
      checked: !this.state.checked
    });
    await super.onChange(this.state.checked, this.value);
  }

  accessibilityClick() {}

  render() {
    const { className, label, tabIndex = 0 } = this.props;
    const { checked } = this.state;
    return (
      <div
        onClick={() => this.onClick()}
        onKeyDown={(evt) => this.accessibilityClick(evt)}
        className={`${Checkbox.defaultClassname} ${className} ${checked && 'checked'}`}
        role="checkbox"
        aria-checked={checked}
        tabIndex={tabIndex}
      >
        <svg viewBox="0 0 10 10" width="15" height="15">
          <rect
            x="0"
            y="0"
            stroke="#666"
            strokeWidth=".5"
            fill="rgba(0,0,0,0)"
            rx="3"
            ry="3"
            height="10"
            width="10"
          />
          <path
            d="M1.5 6L4 8L8 1.5"
            strokeWidth="1.5"
            className={`checkMark ${checked && 'checked'}`}
            fill="none"
            stroke="#666"
          />
        </svg>
        {label}
      </div>
    );
  }
}

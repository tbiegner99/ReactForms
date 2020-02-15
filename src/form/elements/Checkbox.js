import React from 'react';
import GroupableElement from './GroupableElement';

import './styles/Checkbox.css';

export default class Checkbox extends GroupableElement {
  static defaultClassname = '__checkboxElement__';

  constructor(props) {
    super({
      ...props,
      defaultSelected:
        typeof props.defaultChecked !== 'undefined' ? props.defaultChecked : props.defaultSelected,
      selected: typeof props.checked !== 'undefined' ? props.checked : props.selected
    });
  }

  get value() {
    const { checkedValue = true, falseValue = false } = this.props;

    return this.checked ? checkedValue : falseValue;
  }

  get checked() {
    return this.selected;
  }

  async onClick() {
    await super.toggle();
    await super.onChange(this.state.selected, this.value);
  }

  async accessibilityClick() {
    await this.onClick();
  }

  renderIcon() {
    const { selected } = this.state;
    return (
      <svg viewBox="0 0 11 11" width="15" height="15">
        <rect
          x=".5"
          y=".5"
          stroke="#666"
          strokeWidth=".5"
          fill="rgba(0,0,0,0)"
          rx="2"
          ry="2"
          height="10"
          width="10"
        />
        <svg x=".5" y=".5">
          <path d="M1.5 6L4 8L8 1.5" className={`checkMark ${selected && 'checked'}`} fill="none" />
        </svg>
      </svg>
    );
  }

  render() {
    const { className, label, tabIndex = 0 } = this.props;
    const { selected } = this.state;
    return (
      <div
        onClick={() => this.onClick()}
        onKeyDown={(evt) => this.accessibilityClick(evt)}
        className={`__checkElementRoot__ ${Checkbox.defaultClassname} ${className} ${selected &&
          'checked'}`}
        role="checkbox"
        aria-checked={selected}
        tabIndex={tabIndex}
      >
        <div className="__checkboxIcon__">{this.renderIcon()}</div>
        <span>{label}</span>
      </div>
    );
  }
}

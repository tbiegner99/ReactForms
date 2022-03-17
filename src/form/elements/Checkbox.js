import React from 'react';
import GroupableElement from './GroupableElement';

export default class Checkbox extends GroupableElement {
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
    const selected = this.checked;
    const baseStyles = {
      strokeDasharray: 15,
      strokeDashoffset: 15,
      stroke: '#666',
      strokeWidth: 1.5,
      transition: 'all .5s ease-in-out',
    };
    if (selected) {
      Object.assign(baseStyles, {
        strokeDashoffset: 0,
      });
    }

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
          <path className="__checkmark__" d="M1.5 6L4 8L8 1.5" style={baseStyles} fill="none" />
        </svg>
      </svg>
    );
  }

  renderLabel() {
    const { label, children } = this.props;
    return label || children;
  }

  render() {
    const { className, style, tabIndex = 0 } = this.props;
    const selected = this.checked;
    const baseStyles = {
      outline: 'none',
      cursor: 'pointer',
      display: 'flex',
    };
    const iconStyles = {
      paddingRight: '10px',
      paddingTop: '2px',
    };
    return (
      <div
        onClick={() => this.onClick()}
        onKeyDown={(evt) => this.accessibilityClick(evt)}
        className={className}
        style={Object.assign(baseStyles, style)}
        role="checkbox"
        aria-checked={selected}
        tabIndex={tabIndex}
      >
        <div style={iconStyles}>{this.renderIcon()}</div>
        <span>{this.renderLabel()}</span>
      </div>
    );
  }
}

import React from 'react';
import Checkbox from './Checkbox';

export default class RadioButton extends Checkbox {
  renderIcon() {
    const { selected, className } = this.state;
    return (
      <svg className={className} viewBox="0 0 11 11" width="15" height="15">
        <circle
          data-role="outerCircle"
          data-selected={`${selected}`}
          style={{ stroke: '#666', strokeWidth: 0.5, fill: 'rgba(0,0,0,0)' }}
          cx="5.5"
          cy="5.5"
          r="5"
        />
        <circle data-role="radioFill" data-selected={`${selected}`} cx="5.5" cy="5.5" r="5" />
        <circle data-role="outerStroke" data-selected={`${selected}`} cx="5.5" cy="5.5" r="3" />
      </svg>
    );
  }
}

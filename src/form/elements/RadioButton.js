import React from 'react';
import Checkbox from './Checkbox';

import './styles/RadioButton.css';

export default class RadioButton extends Checkbox {
  renderIcon() {
    const { checked } = this.state;
    return (
      <svg viewBox="0 0 11 11" width="15" height="15">
        <circle className="outerCircle" cx="5.5" cy="5.5" r="5" />
        <circle className={`outerStroke ${checked && 'checked'}`} cx="5.5" cy="5.5" r="5" />
        <circle className={`radioFill ${checked && 'checked'}`} cx="5.5" cy="5.5" r="3" />
      </svg>
    );
  }
}

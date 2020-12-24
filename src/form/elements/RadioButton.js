import React from 'react';
import Checkbox from './Checkbox';
import combineClasses from 'classnames';
import styles from './styles/RadioButton.css';

export default class RadioButton extends Checkbox {
  renderIcon() {
    const { selected } = this.state;
    return (
      <svg viewBox="0 0 11 11" width="15" height="15">
        <circle className={styles.outerCircle} cx="5.5" cy="5.5" r="5" />
        <circle
          className={combineClasses(styles.outerStroke, { [styles.checked]: selected })}
          cx="5.5"
          cy="5.5"
          r="5"
        />
        <circle
          className={combineClasses(styles.radioFill, { [styles.checked]: selected })}
          cx="5.5"
          cy="5.5"
          r="3"
        />
      </svg>
    );
  }
}

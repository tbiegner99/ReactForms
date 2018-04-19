import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import RadioButton from '../../../src/form/elements/RadioButton';
import Form from '../../../src/form/Form';

storiesOf('Radio Button', module)
  .add('displays correctly', () => <RadioButton label="Radio label" />)
  .add('has on change event', () => (
    <RadioButton
      checkedValue="a"
      falseValue="b"
      onChange={(check, obj) => alert(obj.value)}
      label="Checkbox label"
      Checkbox
    />
  ));

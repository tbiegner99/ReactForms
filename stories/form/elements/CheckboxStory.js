import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Button from '../../../src/form/elements/Button';
import Checkbox from '../../../src/form/elements/Checkbox';
import Form from '../../../src/form/Form';

storiesOf('Checkbox', module)
  .add('displays correctly', () => <Checkbox label="Checkbox label" />)
  .add('has on change event', () => (
    <Checkbox
      checkedValue="a"
      falseValue="b"
      onChange={(check, obj) => alert(obj.value)}
      label="Checkbox label"
    />
  ));

import React from 'react';
import { storiesOf } from '@storybook/react';
import Form from '../../src/form/Form';

storiesOf('Form', module)
  .add('with elements', () => <Form />)
  .add('with nesting', () => {})
  .add('with submission', () => {});

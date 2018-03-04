import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '../../../src/form/elements/Button';

storiesOf('Button', module)
  .add('works as normal button', () => <Button onClick={alert('im clicked')} />)
  .add('can trigger form submission')
  .add('can store value')
  .add('has default exetnsions')
  .add('can be styled using the default classes');

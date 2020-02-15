import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Button from '../../../src/form/elements/Button';
import Form from '../../../src/form/Form';

storiesOf('Button', module)
  .add('works as normal button', () => <Button onClick={() => alert('im clicked')} />)
  .add('can trigger form submission')
  .add('can store value', () => (
    <Form onSubmit={(value) => alert(JSON.stringify(value))}>
      <Button value={1} submittable>
        Btn with value
      </Button>
    </Form>
  ))
  .add('has default exetnsions')
  .add('can be styled using the default classes');

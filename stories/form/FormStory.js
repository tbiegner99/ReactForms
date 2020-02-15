import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Form from '../../src/form/Form';
import Select from '../../src/form/elements/Select';
import Option from '../../src/form/elements/Option';
import Button from '../../src/form/elements/Button';
import Text from '../../src/form/elements/TextInput';
import HiddenField from '../../src/form/elements/HiddenField';
import nestedFormStory from './form/nesting.jsx';
import errorLabelsStory from './form/errorLabels';

storiesOf('Form', module)
  .add('with elements', () => <Form />)
  .add('with nesting', () => nestedFormStory)
  .add('with custom error label placement', () => errorLabelsStory)
  .add('with submission', () => (
    <Form onSubmit={action('onSubmit')}>
      <Select name="select1" data-rule-integer>
        <Option text="Option 1" value="opt1" />
        <Option value="opt2" />
        <Option value={3} />
      </Select>
      <HiddenField name="hidden1" value="some-value" />
      <HiddenField value="ignore-value" />
      <Form name="nestedValues">
        <HiddenField name="hidden1" value="nested-hidden" />
      </Form>
      <Text
        name="text1"
        required
        data-rule-number
        data-priority-number={2}
        data-rule-regex={/[a-z]{3,6}/}
        data-priority-regex={1}
      />
      <Text
        name="text1"
        required
        data-rule-number
        data-priority-number={1}
        data-rule-regex={/[a-z]{3,6}/}
        data-priority-regex={2}
      />
      <Button name="submitBtn" submittable>
        Submit
      </Button>
    </Form>
  ));

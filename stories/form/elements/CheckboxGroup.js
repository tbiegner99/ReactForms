import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import InputGroup from '../../../src/form/elements/InputGroup';
import Checkbox from '../../../src/form/elements/Checkbox';

storiesOf('Checkbox Group', module)
  .add('displays Correctly', () => (
    <InputGroup onChange={(value) => alert(value)}>
      <Checkbox checkedValue="b" label="Checkbox label" />
      <Checkbox
        checkedValue="a"
        label="A really really long Checkbox label whose text should wrap, and the display flex should center the checkbox"
      />
    </InputGroup>
  ))
  .add('multivalue', () => (
    <InputGroup onChange={(value) => alert(value)} multiValue>
      <Checkbox checkedValue="b" label="Checkbox label" />
      <Checkbox
        checkedValue="a"
        label="A really really long Checkbox label whose text should wrap, and the display flex should center the checkbox"
      />
    </InputGroup>
  ));

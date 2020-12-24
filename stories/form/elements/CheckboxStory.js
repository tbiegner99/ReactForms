import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Checkbox from '../../../src/form/elements/Checkbox';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

storiesOf('Checkbox', module)
  .addDecorator(withKnobs)
  .add('displays correctly', () => (
    <Checkbox defaultChecked={boolean('checked', true)} label="Checkbox label" />
  ))
  .add('has on change event', () => (
    <Checkbox
      checkedValue="a"
      falseValue="b"
      onChange={(check, obj) => alert(obj.value)}
      label="Checkbox label"
    />
  ))
  .add('has long label text', () => (
    <Checkbox
      checkedValue="a"
      falseValue="b"
      onChange={(check, obj) => alert(obj.value)}
      label="A really really long Checkbox label whose text should wrap, and the display flex should center the checkbox"
    />
  ));

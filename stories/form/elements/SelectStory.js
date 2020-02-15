import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Select from '../../../src/form/elements/Select';
import Option from '../../../src/form/elements/Option';
import Form from '../../../src/form/Form';

storiesOf('Select', module).add('displays correctly', () => (
  <Select>
    <Option text="Option 1" value="opt1" />
    <Option value="opt2" />
    <Option value={3} />
  </Select>
));

import React from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from '../../../src/form/elements/TextInput';

storiesOf('TextInput', module).add('with text', () => <TextInput required />);

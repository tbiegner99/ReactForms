import React from 'react';
import Form from '../../../src/form/Form';
import TextInput from '../../../src/form/elements/TextInput';
import { SubmitButton } from '../../../src/form/elements/Button';
import ErrorLabel from '../../../src/form/elements/ErrorLabel';

export default (
  <Form onSubmit={() => {}} native={false}>
    <b>
      <ErrorLabel for="some-element" />
    </b>
    <TextInput name="some-element" required />
    <Form name="nested">
      <TextInput name="nested-element" required />
    </Form>
    <ErrorLabel for="nested.nested-element" message="This is required." />

    <SubmitButton>Submit</SubmitButton>
  </Form>
);

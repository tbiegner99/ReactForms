import FormElement from '../../src/form/FormElement';

export default class MockFormElement extends FormElement {
  get value() {
    const value =
      typeof this.props.value === 'undefined' ? { name: 'myVal', value: 2 } : this.props.value;
    return value;
  }
}

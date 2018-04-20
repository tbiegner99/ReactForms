import FormElement from '../FormElement';

export default class HiddenField extends FormElement {
  get value() {
    return this.props.value;
  }

  render() {
    return null;
  }
}

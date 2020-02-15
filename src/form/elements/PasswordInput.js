import TextInput from './TextInput';

export default class PasswordInput extends TextInput {
  get type() {
    return 'password';
  }
}

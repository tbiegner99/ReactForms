import PropTypes from 'prop-types';
import FormElement from '../FormElement';

const _groupId = Symbol('groupId');
export default class GroupableElement extends FormElement {
  static defaultProps = {
    ...FormElement.defaultProps
  };

  static propTypes = {
    ...FormElement.propTypes
  };

  static contextTypes = {
    ...FormElement.contextTypes,
    inputGroup: PropTypes.instanceOf(GroupableElement)
  };

  constructor(props) {
    super(props);
    this[_groupId] = null;
  }

  get groupId() {
    return this[_groupId];
  }

  select() {
    if (this.context.inputGroup) {
      this.context.inputGroup.selectElement(this.groupId, this);
    }
  }

  willMount(componentWillMount) {
    this[_groupId] = this._registerSelfWithGroup();
    super.willMount(componentWillMount);
  }

  willUnmount(componentWillUnmount) {
    this._unregisterSelfWithGroup();
    super.willUnmount(componentWillUnmount);
  }

  _registerSelfWithGroup() {
    if (this.context.inputGroup) {
      return this.context.inputGroup.registerElement(this);
    }
    return null;
  }

  _unregisterSelfWithGroup() {
    if (this.context.inputGroup) {
      return this.context.inputGroup.unregister(this.groupId);
    }
    return null;
  }
}

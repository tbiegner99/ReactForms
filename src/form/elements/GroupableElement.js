import PropTypes from 'prop-types';
import FormElement from '../FormElement';
import ValueEnforcer from '../../utils/ValueEnforcer';

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
    let defaultSelected = ValueEnforcer.toNotBeNullOrUndefined(props.selected, false);
    defaultSelected = ValueEnforcer.toNotBeNullOrUndefined(props.defaultSelected, defaultSelected);

    this.state = Object.assign(this.state, { selected: defaultSelected });
  }

  get groupId() {
    return this[_groupId];
  }

  get selected() {
    return this.state.selected;
  }

  async select() {
    await this.setState({
      selected: true
    });

    if (this.context.inputGroup) {
      this.context.inputGroup.selectElement(this.groupId, this);
    }
  }

  async toggle() {
    if (!this.state.selected) {
      await this.select();
    } else {
      if (this.context.inputGroup) {
        const proceed = await this.context.inputGroup.unselectElement(this.groupId, this);
        if (proceed === false) {
          return;
        }
      }

      await this.unselect();
    }
  }

  async unselect() {
    await this.setState({
      selected: false
    });
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

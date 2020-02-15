import React from 'react';
import FormElement from '../FormElement';
import Assert from '../../utils/Assert';
import Option from './Option';

import './styles/Select.css';

const ArrowIcon = (props) => (
  <svg className={props.className} viewBox="0 0 10 10" width="10" height="10">
    <path d="M0 0L10 0L5 10Z" />
  </svg>
);
export default class Select extends FormElement {
  static propTypes = {
    ...FormElement.propTypes,
    children: (props, propName, componentName) => {
      const children = props[propName];
      let error = null;
      React.Children.forEach(children, (child) => {
        const { type } = child;
        const isAnOption = type.prototype instanceof Option || type.prototype === Option;
        if (isAnOption) {
          return;
        }
        const name = typeof type === 'string' ? type : type.name;
        error = new Error(`\`${componentName}\`: children may only be an option. Found ${name}`);
      });
      return error;
    }
  };

  constructor(props) {
    super(props);
    this.options = {};
    this.selectOption = this.selectOption.bind(this);
    this.state = Object.assign(this.state, { closed: true });
  }

  componentWillMount() {
    this.setState({ value: this.getInitialValue() });
  }

  tryValue(value) {
    Assert.toBeDefined(value);
    Assert.toBeTruthy(this.valueIsAnOption(value));
  }

  valueIsAnOption(value) {
    const valueIsChildValue = (child) => value === Option.getValueFromProps(child.props);
    const valueExistsInOptions = React.Children.toArray(this.props.children).reduce(
      (valueFound, child) => valueFound || valueIsChildValue(child),
      false
    );
    return typeof value !== 'undefined' && valueExistsInOptions;
  }

  getInitialValue() {
    const { defaultValue, value } = this.props;
    try {
      this.tryValue(defaultValue);
      return defaultValue;
    } catch (e) {
      // continue;
    }
    try {
      this.tryValue(value);
      return value;
    } catch (e) {
      return this.getValueFromOptions();
    }
  }

  getValueFromOptions() {
    return null;
  }

  get value() {
    return this.state.value;
  }

  async selectOption(option) {
    if (option.props.disabled) {
      return;
    }
    const { value } = option;
    await this.setState({ value });
    this.props.onChange(value, this);
  }

  async toggleOpen() {
    await this.setState({ closed: !this.state.closed });
  }

  renderOption(child, selectChild) {
    const { className } = child.props;
    const { optionClass } = this.props;
    const newClassName = `selectOption ${className} ${optionClass}`;
    return React.cloneElement(child, {
      className: newClassName,
      onOptionSelect: (option) => this.selectOption(option),
      selected: selectChild
    });
  }

  render() {
    const { closed, value } = this.state;
    const { className } = this.props;
    let optionSelected = false;
    const options = React.Children.map(this.props.children, (child) => {
      const selected = child.props.value === this.value;
      const canSelectOption = !optionSelected && selected;
      const childItem = this.renderOption(child, canSelectOption);
      optionSelected = optionSelected || selected;
      return childItem;
    });
    return (
      <div
        className={`__selectBox__ ${className}`}
        onClick={() => this.toggleOpen()}
        role="dropdown"
      >
        <div className="__selectedOptionBox__">
          <div className="valueDisplay">{value}</div>
          <ArrowIcon className={`arrowIcon ${closed ? '' : 'up'}`} />
        </div>
        <div className={`options ${closed ? 'closed' : ''}`}>{options}</div>
      </div>
    );
  }
}

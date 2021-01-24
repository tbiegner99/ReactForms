import React from 'react';
import Radium from 'radium';
import combineClasses from 'classnames';
import PropTypes from 'prop-types';
import FormElement from '../FormElement';
import Assert from '../../utils/Assert';
import Option from './Option';

const SelectBoxStyles = {
  position: 'relative',
  background: 'white'
};

const OptionBoxStyles = {
  border: '1px solid black',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 20px',
  cursor: 'pointer'
};

const SelectOptionStyles = {
  cursor: 'pointer',
  padding: '10px',
  ':hover': {
    background: '#777'
  }
};

const getOptionsStyles = (closed) => ({
  height: 'auto',
  maxHeight: closed ? 0 : '100px',
  overflowY: closed ? 'hidden' : 'auto',
  transition: 'all .25s ease-in-out',
  position: 'absolute',
  width: '100%',
  borderStyle: 'solid',
  borderWidth: '0 1px 1px 1px',
  background: 'inherit'
});

const getArrowStyles = (closed) => ({
  transformOrigin: 'center',
  transform: `rotate(${closed ? 180 : 0}deg)`,
  transition: 'all .25s ease-in-out'
});

const ArrowIcon = (props) => (
  <svg {...props} viewBox="0 0 10 10" width="10" height="10">
    <path d="M0 0L10 0L5 10Z" />
  </svg>
);
class Select extends FormElement {
  static propTypes = {
    ...FormElement.propTypes,
    children: PropTypes.node
  };

  constructor(props) {
    super(props);
    this.options = {};
    this.selectOption = this.selectOption.bind(this);
    this.state = Object.assign(this.state, { closed: true });
  }

  componentDidMount() {
    const value = this.getInitialValue();
    const selectedOption = this.getOptionWithValue(value);
    this.setState({ value, selectedOption });
  }

  tryValue(value) {
    Assert.toBeDefined(value);
    Assert.toBeTruthy(this.valueIsAnOption(value));
  }

  valueIsAnOption(value) {
    const valueExistsInOptions = typeof this.getOptionWithValue(value) !== 'undefined';
    return typeof value !== 'undefined' && valueExistsInOptions;
  }

  getOptionWithValue(value) {
    const valueIsChildValue = (child) => value === Option.getValueFromProps(child.props);
    return React.Children.toArray(this.props.children).find((child) => valueIsChildValue(child));
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
    await this.setState({ value, selectedOption: option });
    this.props.onChange(value, this);
  }

  async toggleOpen() {
    await this.setState({ closed: !this.state.closed });
  }

  renderOption(child, selectChild) {
    const { className } = child.props;
    const { optionClass } = this.props;
    const newClassName = combineClasses(className, optionClass);
    return React.cloneElement(child, {
      style: SelectOptionStyles,
      className: newClassName,
      onOptionSelect: (option) => this.selectOption(option),
      selected: selectChild
    });
  }

  render() {
    const { closed, selectedOption } = this.state;
    const { className, placeholder } = this.props;
    let optionSelected = false;
    const options = React.Children.map(this.props.children, (child) => {
      const selected = child.props.value === this.value;
      const canSelectOption = !optionSelected && selected;
      const childItem = this.renderOption(child, canSelectOption);
      optionSelected = optionSelected || selected;
      return childItem;
    });

    const placeholderComponent = <i className="placeholder">{placeholder || 'Select One...'}</i>;
    const selectedText = selectedOption ? selectedOption.props.text : placeholderComponent;
    return (
      <div
        style={SelectBoxStyles}
        className={className}
        onClick={() => this.toggleOpen()}
        role="select"
        tabIndex="0"
      >
        <div style={OptionBoxStyles}>
          <div className="valueDisplay">{selectedText}</div>
          <ArrowIcon className="arrowIcon" style={getArrowStyles(!closed)} />
        </div>
        <div closed={`${closed}`} role="listbox" style={getOptionsStyles(closed)}>
          {options}
        </div>
      </div>
    );
  }
}
export { Select };
export default Radium(Select);

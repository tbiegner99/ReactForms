import React from 'react';
import PropTypes from 'prop-types';
import GroupableElement from './GroupableElement';

const _elements = Symbol('elements');
const _selectedElements = Symbol('selectedElements');
const _uniqueId = Symbol('uniqueId');
export default class InputGroup extends GroupableElement {
  static defaultProps = {
    ...GroupableElement.defaultProps,
    multiValue: false
  };

  static propTypes = {
    ...GroupableElement.propTypes,
    multiValue: PropTypes.bool
  };

  static childContextTypes = {
    inputGroup: PropTypes.instanceOf(GroupableElement)
  };

  constructor(props) {
    super(props);
    this[_elements] = {};
    this[_uniqueId] = 0;
    this[_selectedElements] = {};
  }

  get elements() {
    return Object.values(this[_elements]);
  }

  get selectedElements() {
    return Object.assign({}, this[_selectedElements]);
  }

  get multiValue() {
    return !!this.props.multiValue;
  }

  get value() {
    const selectedIds = Object.keys(this.selectedElements).filter(
      (key) => this.selectedElements[key]
    );
    const selectedValues = selectedIds
      .filter((key) => typeof this[_elements][key] !== 'undefined')
      .map((key) => this[_elements][key].value);

    return this.multiValue ? selectedValues : selectedValues[0] || null;
  }

  async unselectElement(elementId) {
    if (!this.multiValue) {
      return false;
    }
    delete this[_selectedElements][elementId];
    this.onChange(this.value, this[_elements][elementId]);
    return true;
  }

  selectElement(elementId) {
    if (!this.multiValue) {
      this.clear();
      this[_selectedElements] = { [elementId]: true };
    } else {
      this[_selectedElements][elementId] = !this[_selectedElements][elementId];
    }

    this.onChange(this.value, this[_elements][elementId]);
  }

  clear() {
    const selectedElementIds = Object.keys(this.selectedElements);
    selectedElementIds.forEach((id) => {
      this[_elements][id].unselect();
    });
  }

  registerElement(el) {
    if (!(el instanceof GroupableElement)) {
      throw new Error('A groupable element must be registered to Input group');
    }
    const elId = this[_uniqueId]++;
    this[_elements][elId] = el;
    if (el.selected) {
      this.selectElement(elId);
    }

    return elId;
  }

  unregister(elId) {
    if (this[_elements][elId]) {
      delete this[_elements][elId];
    }
    if (this[_selectedElements][elId]) {
      delete this[_selectedElements][elId];
    }
  }

  getChildContext() {
    return {
      inputGroup: this
    };
  }

  render() {
    const { children, name, ...otherProps } = this.props;
    return <div {...otherProps}>{children}</div>;
  }
}

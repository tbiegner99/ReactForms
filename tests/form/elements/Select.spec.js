import React from 'react';
import { mount } from 'enzyme';
import Select from '../../../src/form/elements/Select';
import Option from '../../../src/form/elements/Option';
import FormElement from '../../../src/form/FormElement';

describe.only('Select form element', () => {
  let el;
  let instance;
  it('exists', () => {
    expect(new Select()).toBeInstanceOf(Select);
  });
  it('is a form element', () => {
    expect(new Select()).toBeInstanceOf(FormElement);
  });
  it('returns state value as its value', async () => {
    instance = mount(<Select />).instance();
    await instance.setState({ value: 'ty' });
    expect(instance.value).toEqual('ty');
  });

  describe('default value initialization', () => {
    describe('defaultValue prop', () => {
      beforeEach(() => {
        el = mount(
          <Select optionClass="childClass" defaultValue="a" value="b">
            <Option value="a" />
            <Option value="b" />
            <Option value="a" />
          </Select>
        );
        instance = el.instance();
      });

      it('sets selected value to defaultValue prop if value matches an option value', () => {
        expect(instance.value).toEqual('a');
      });
      it('selects first option that matches defaultValue', () => {
        expect(
          el
            .find(Option)
            .first()
            .prop('selected')
        ).toEqual(true);
        expect(
          el
            .find(Option)
            .last()
            .prop('selected')
        ).toEqual(false);
      });
    });

    describe('when value prop matches option', () => {
      beforeEach(() => {
        el = mount(
          <Select optionClass="childClass" value="b">
            <Option value="a" />
            <Option value="b" />
            <Option value="b" />
          </Select>
        );
        instance = el.instance();
      });
      it('sets default value to value prop', () => {
        expect(instance.value).toEqual('b');
      });
      it('selects proper option', () => {
        expect(
          el
            .find(Option)
            .at(1)
            .prop('selected')
        ).toEqual(true);
        expect(
          el
            .find(Option)
            .last()
            .prop('selected')
        ).toEqual(false);
      });
    });

    describe('when value prop doesnt matche option', () => {
      it('sets default value to null', () => {
        el = mount(
          <Select optionClass="childClass" value="c">
            <Option value="a" />
            <Option value="b" />
            <Option value="a" />
          </Select>
        );
        instance = el.instance();
        expect(instance.value).toEqual(null);
      });
    });
  });
  describe('allowed children', () => {
    let errorSpy;
    beforeEach(() => {
      errorSpy = jest.spyOn(global.console, 'error');
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('allows options as children', () => {
      mount(
        <Select>
          <Option text="a" value="b" />
        </Select>
      );
      expect(errorSpy).not.toHaveBeenCalled();
    });
    it('allows subclassed options as children', () => {
      const SubOption = class extends Option {};

      mount(
        <Select>
          <SubOption text="a" value="b" />
        </Select>
      );
      expect(errorSpy).not.toHaveBeenCalled();
    });
    it('allows ony options as its children', () => {
      mount(
        <Select>
          <div />
        </Select>
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Warning: Failed prop type: \`Select\`: children may only be an option. Found div`
        )
      );
    });
  });

  describe('display', () => {
    let optA;
    let optB;
    beforeEach(() => {
      optA = <Option className="optClass" selected={false} value="a" />;
      optB = <Option value="b" selected={false} />;
      el = mount(
        <Select optionClass="childClass">
          {optA}
          {optB}
          {optB}
        </Select>
      );
      instance = el.instance();
    });
    it('has options closed initially', () => {
      expect(el.find('.options')).toHaveLength(1);
      expect(el.find('.options.closed')).toHaveLength(1);
    });
    it('calls renderOption to render each of its children', () => {
      const renderSpy = jest.spyOn(instance, 'renderOption');
      instance.render();
      expect(renderSpy).toHaveBeenCalledWith(optA, false);
      expect(renderSpy).toHaveBeenCalledWith(optB, false);
      expect(renderSpy).toHaveBeenCalledTimes(3);
    });

    it('has options as children', () => {
      expect(el.find(Option)).toHaveLength(3);
    });

    it('applies optionClass to all children', () => {
      expect(el.find('div.childClass')).toHaveLength(3);
    });
    it('applies option specific class to the child', () => {
      const optEl = el.find('div.optClass');
      expect(optEl).toHaveLength(1);
    });
  });
  describe('on click', () => {
    it('opens options', () => {
      el.simulate('click');
      expect(el.find('.options')).toHaveLength(1);
      expect(el.find('.options.closed')).toHaveLength(0);
    });
    describe('when option clicked', () => {
      let optA;
      let onChangeSpy;
      let optB;
      beforeEach(() => {
        optA = <Option className="optClass" value="a" />;
        optB = <Option value="b" />;
        onChangeSpy = jest.fn();
        el = mount(
          <Select optionClass="childClass" defaultValue="b" onChange={onChangeSpy}>
            {optA}
            {optB}
            <Option value="c" disabled />
          </Select>
        );
        instance = el.instance();
      });

      describe('if option is disabled', () => {
        beforeEach(() => {
          el.find('Option[disabled]').simulate('click');
        });

        it('does not change selected value', () => {
          expect(el.instance().value).toEqual('b');
        });
        it('does not fire on change', () => {
          expect(onChangeSpy).not.toHaveBeenCalled();
        });
      });
      describe('if option is enabled', () => {
        let selectSpy;
        let childOption;
        beforeEach(async () => {
          await instance.setState({ closed: false });
          selectSpy = jest.spyOn(instance, 'selectOption');
          childOption = el.find(Option).first();
          childOption.simulate('click');
        });
        it('calls selectOption with selectedOption on option click', () => {
          expect(selectSpy).toHaveBeenCalledWith(childOption.instance());
        });

        it('sets option as selected value', async () => {
          expect(instance.value).toEqual('a');
        });
        it('fires on change event', () => {
          expect(onChangeSpy).toHaveBeenCalledWith('a', instance);
        });
        it('closes the options', () => {
          expect(el.find('.options.closed')).toHaveLength(1);
        });
      });
    });
  });
});

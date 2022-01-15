# Form Element

The base class of a element in the form. The methods get value() and render() must be overidden when extended.  All elements of this class support validation props. For more information, see validation props.

## Passable props
In addition to the passed props, this element suports all validation props and additional applicable DOM props and events and DOM data props.
| Name | Type | Required | Default Value | Description |
| ---- | ---- | -------- | ------- | ----------- |
| name | string | false | null | unique name for element. When form data is generated this will be the field in the resulting json object. If not passed, the fields value will not be in the form data submission object |
| submittable | bool / func(object,FormElement) -> bool | false | true | wether the value of the element should be added to the form submission data object. A function that takes the value of the element and the element itself may be passed and it should return an object whose truthiness will be used. |
| validateOnChange | boolean | false | parent form validateOnChange value | whether a change event on the element will trigger a validation of the element. If no value, this property will be taken from the parent form. In this way it is an override for that value. |
| validateOnBlur | boolean | false | parent form validateOnBlur value | whether a blur event on the element will trigger a validation of the element. If no value, this property will be taken from the parent form. In this way it is an override for that value. |
| hideErrors | boolean | false | false | when true, will not render the error label |

## Passable Events
| Name | Args | Description |
| -- | -- | -- |
| onChange(newValue,element, ...args) | newValue - the new Value of the element<br/> element- the FormElement object that triggered the event<br/> ...args - any additional arguments passed into the event. This is usually just the native dom change event | fires when the value changes on the element |
| onBlur(evt,element) | evt - the native DOM event object<br/> element- the FormElement object that triggered the event<br/> ...args - any additional arguments passed into the event. This is usually just the native dom change event | fires when the element loses focus |
| onValidationFinished(results) | results - ValidationResults - the details of the current elements validation state | fired after the elements validation has finished |
| onValidationStateChanged(isValid, element,results) | isValid - boolean - true if the element is currently valid<br/> element - FormElement - the element that was validated <br/> validationResults - ValidationResults - detailed results of the validation | fired when the states validity changes (ie from false->true or true->false). This event would be fired in addition to the onValidationFinished, which is fired regardless of validity. | 

## Required Overide Methods
These methods must be overriden by implementers
| Name | Return Type | Description |
| -- | -- | -- |
| get value() | object | the value of the element to be submitted. This value will be submitted with the form and passed into validation |
| render()  | JSX element | describes ho to render the form element |


## Accessible methods
These methods are useful for child implementers to use. 
**It is not recommended to override these**

| Name | Return Type | description |
| -- |-- |-- |
| get showErrors() | bool | returns true if error label will be rendered |
| get isValid() | bool | returns the current validation state of the element |
| get validationResults() | ValidationResults object | reutrns the details of the previous validation |
| get parentForm() | Form | returns the container Form of the current element |
| get rootForm() | Form | returns the Form at the top of the Form chain |
| get name() | string | the name of the element |
| get fullName() | string | the full anme of the element this is composed of the names of all the parent forms in the chain separated by . i.e. form1.form2.elementName |
| get uniqueId() | string | the unique id of the element given by the parent form |
| get submittable() | boolean | if the form element will be submitted with the form (assuming a name is also given) |
| get errorMessage() | string | the currently displayed error message from the validation results as long as showErrors is true. if it is false, this is the message that would have been rendered |
| get validateOnChange() | bool | returns whether the element will be validate on the change event |
that would have been rendered |
| get validateOnBlur() | bool | returns whether the element will be validate on the blur event |
| async onChange(value,...args) | null | value the new value of the element. this does not update the value of the element
| async validate(opts) | ValidationResults | validates the element using the provided options: <br/> showErrors - boolean(false) - if labels should be rendered after validate <br/> noNotify - boolean(true) - if the parent form should be notified of the elements validation state <br/>ignoreFailure - boolean (false) - if true, will not throw on validation error. |
| async fullValidate() | ValidationResult |validates element and shows error label if failure  |

 # Form
The base container element for form elements. This is actually a type of form element. In that way forms may be nested to create complex json submission objects. However only the top level for can be an html form and only top level submission events will be triggered. This will render as an html form element unless:
- the form is nested
- the prop native is passed and set to false
  


## How submission is handled
When a form is mounted, it adds itself as the parentForm in the react context. If there is not already a rootForm it also adds sets itself as root. The root form should have all submission properties as any submission properties on nested forms will be ignored. Prior to submission, the form data is gathered from its form element children (via get value() method) and passed to the validator with the elements rules. If all elements pass validation the form is submitted. submission logic is left to the user via the onSubmit event

The order of sumission events are as follows
- onValidationStateChange (if applicable) - when validation state of form has changed
- onValidationFinished - after validation
- onBeforeSubmit - prior to submission, may cancel submission if false is returned
- onSubmit - called to submit the form
- onSubmissionFailure (if applicable) - when submission results in an error

## Custom error labels
By default errors render as par of the component with a simple span. Error labels allow cusomizing he error's location and style. ErrorLables register themselves with the parent form like a component. Upon validation failure, the form matches the error label name with its desired element and sends the message to render to the label. See ErrorLabel  form element for more details

## Passing Props
The following props inherited from FormElement have no effect: 
- validateOnChange

  
The Form takes all other props of a FormElement with these additional props:
| Name | Type | Required | Refault | Description |
| -- | -- | -- | -- | -- |
| native | bool | false | true | set to false to use &lt;div&gt; instead of &lt;form&gt; for rendering |


## Passing events
The following events inherited from FormElement have no effect:
- onChange 

The Form takes all other events of a FormElement with these additional events:

| Event | Args | Description |
| -- | -- | -- | 
| onSubmit(formData, form) | formData - object - the data for the form to submit where the keys are the element name and values are the element value. Nested form values will have a key of the nested form name and value be a json object of its elements values.<br/>form - Form - the form object that is being submitted | fired when the form is submitting. Either manually or clicking a submittable button |
| onBeforeSubmit(validationResult,formData,form) | validationResults - ValidationResults - the results of the validation of the form<br/>formData - object - the form elements data for submission<br/>form - Form - the form object being submitted | Fired prior to a form being submitted. May be asynchronous, but if this event returns a boolean value of false, the sumission is cancelled |
| onSubmissionFailure(error,formData,form) | error - Error - the error thrown during the submission<br/>formData - object - the form elements data for submission<br/>form - Form - the form object being submitted | fired whenever a submission failure occurs, be it for validation reasons or an error that occurred during the onSubmit or onBeforeSubmit  events |

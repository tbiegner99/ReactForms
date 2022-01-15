# Validation Rule Manager
This object is responsible for running validation given the props of a form element. This is also where rules are registered to be recognized by the DOM props. Upon validation, it converts a set of dom properties into a rule configuration. See `ValidationConfig` 

## Methods
| Method | Args | ReturnType | Description |
| - | - | - | - |
| async validate(value,props,formValues) | value - `any` - the value to validate<br/>props - `object` - the props passed to a form element. These props will be converted to an array of `RuleConfiguration` objects to be passed to validation<br/>formValues - `object` - object of submitted formValues to be passed to rule validation | Promise->`ValidationResult` | Performs validation of a `FormElement` given its props. It converts the props to a validation configuration to pass to validation. See `Validator` |
createRuleConfigurationFromProps(props)  | props - `object` - props to convert to configuration | Array(`RuleConfiguration`) | Converts set of props of an element to a validation configuration for validation |
| registerRule(rule) | rule - class extending `Rule` type - rule to register | Registers rule class with `ValidationManager`. After registration the name returned by `static get ruleName()` can be used as part of props for validation i.e. `data-rule-customRuleName`. **Note** an error will be thrown if an attempt is made to register two rules of the same name or rule is not a class that extends `Rule`
| deregisterRule(rule) | rule - class extending `Rule` type - rule to deregister | Unregisters rule class with `ValidationManager`. After registration the rule will not be able to be used with props |
| get rules() | object | returns a copy of an object containing all registered rules. Key is the rule name. value is the rule type. |

## Supported Rule Props
When passed into a form element, these props will be converted into a an array of `RuleConfiguration` objects for validation. `<rule-name>` in this document should be replaced with a string which would match `static get ruleName()` of a registered rule class. See `Rule` and `registerRule()` method of `ValidationManager` for more info. 

| Prop | Type | Description |
| - | - | -|
| `data-rule-<rule-name>` | any | If provided it enables the rule type for validation. The value of this prop will be passed into the constructor of the rule type. |
| `data-msg-<rule-name>` | `string \| function` | When an error occurs this is the text that will be shown in an error label. If the provided an argument is a function, it will invoked at validation type with the arguments:<br/> <ol><li>value - the value that is validated</li><li>rule - the rule object that threw the error</li><li>formData - all submitted form values</li></ol> |
| `data-priority-<rule-name>` | integer | the priority of the rule to evaluate. The lower the number, the higher the priority. This overrides the default priority of the rule object. See Rule and Validator for more details |
| `data-validation-config` | Array(ValidationConfig) | overrides any other props config on the object. if passed this config will directly be passed into validation. See ValidationConfig for info on the structure of these objects |

## ValidationConfig object

| Field | type | Description |
| - | - | - |
| rule | Rule | An instance of a rule object that will perform validation on a value |
| message | string \| function(value,rule,formdata)->string |  a string or function that returns a string that the error label will render when the rule fails. this overrides the getDefaultMessage method of the rule instance |
| priority | integer | the priority of the rule evaluation. See Validator for information on rule sets and details. This overrides the priority field on the rulle instance |
| name | string | the name of the rule to evaluate |


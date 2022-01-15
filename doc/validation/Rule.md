# Rule
A rule is the base class for enforcement of element values during validation. Any rule must extend this class. For more info on how rules are used in validation, see Validator. A rule has the following properties:
- ruleName: a uniquely identifying name to identify the rule type. This must be statically defined on the type
- defaultPriority: defines the order of eveluation of the rule by default, the lowere the number, the earlier it evaluates. See the Validator for more detail on rule evaluation
- message: this is the message displayed when the rule triggers a validation failure

## Required method overrides
| Method name | Arguments | Description |
| -- | -- | --|
| async validate(value,formValues) | value - any - the value to validate returned by the form element<br/> formValues - object - an object containing all values for the form. For some rules, it is useful to have all the values for the form to use in relative evaluation. i.e. password matching | the rule validation method. Upon failure should return rejected promise (or throw error in async). A resolved promise will be treated as a passing validation |

## Recommended method overrides
| method name | Arguments | Default Return Value | Description |
| -- | -- | -- | -- |
| static get ruleName() -> string | N/A | The contructor name (name of class) | A unique name for the rule. It should be hyphen separated and contain only dom-friendly characters. **Note:** This is a static method |
| get defaultPriority() -> integer | N/A | 1 | The default priority of the rule if not overriden on the element | 
| getDefaultMessage(value,ruleInstance) -> string | value - any - the value that failed validation<br/>ruleInstance - Rule - the current instance of the rule |  `Rule violated for value ${value} - ${ruleInstance.ruleName}` | Returns a default error message for the violated rule if none provided on the element |

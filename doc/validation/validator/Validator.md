## Validator
This object is responsible for performing validations on a value given a set of rules. It exposes a singge method

# Validate Method

The validate() method is asynchronous and takes the following arguments
| Arg | Type | Description |
| - | - | - |
| value | any | the value to validate against |
| config | Array(Rule) | the rules used to validate the value |
| formValues | object | other values that are submitted with the form (if any) to be validated against. Some rules (like password match rule) may use these for validation |




## Validation Algorithm
1. The passed validation rules from the config are sorted and partitioned by priority. These partitions are known as Rule Sets.
2. For each rule set:
   1. rules in the set will be evaulated in parallel calling the validate() method on a rule instance
   2. If any rule fails, the set fails
   3. The resulting failure or success will be returned for all rules in the set and combined:
        - if any rule is invalid, valid field will be false
        - rule name and message is the first rule violated (order is not guaranteed)
        - number of rules violated will be the count of failing rules
        - number of invalid elements will be 0 if valid or 1 if invalid
3. If the set fails, no further sets will be evaluated and the result returned in a rejected promise.
4. If all rule sets pass, a resolved promise is returned with a valid validation result 


## ValidationResults object

| Field | Type | Description |
| -- | -- | -- |
| valid | bool | if element is valid or not |
| message | string | the message for the first violated validation rule. NULL if element is valid. |
| ruleName | string | the name of the first validated rule |
| numberOfRulesViolated | integer |the number of rules violated in the first failing rule set. Because validation fails on the first failing rule set, this does not include lower priority rules that would have been evaluated after the failing set. |
| numberOfInvalidElements | integer | the number of form elements failing validation. For an element that is not a form, this will be either 0 or 1.
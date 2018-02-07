import RequiredRule from './rules/RequiredRule';
import LengthMinRule from './rules/LengthMinRule';
import LengthMaxRule from './rules/LengthMaxRule';
import LengthRangeRule from './rules/LengthRangeRule';
import NumberRule from './rules/NumberRule';
import IntegerRule from './rules/IntegerRule';
import MinRule from './rules/MinRule';
import MaxRule from './rules/MaxRule';
import RegexRule from './rules/RegexRule';
// import RangeRule from './rules/RangeRule';
// import GreaterThanZeroRule from './rules/GreaterThanZeroRule';
// import EmailRule from './rules/RangeRule';
// import PhoneRule from './rules/RangeRule';
// import DateRule from './rules/DateRule';
// import CustomRule from './rules/CustomRule';
// import ZipcodeRule from './rules/ZipcodeRule';
// import CreditCardNumberRule from './rules/CreditCardNumberRule';

export default {
    [RequiredRule.ruleName]: RequiredRule,
    [LengthMinRule.ruleName]: LengthMinRule,
    [LengthMaxRule.ruleName]: LengthMaxRule,
    [LengthRangeRule.ruleName]: LengthRangeRule,
    [MinRule.ruleName]: MinRule,
    [MaxRule.ruleName]: MaxRule,
    // [RangeRule.ruleName]: RangeRule,
    [RegexRule.ruleName]: RegexRule,
    // [EmailRule.ruleName]: EmailRule,
    // [PhoneRule.ruleName]: PhoneRule,
    [NumberRule.ruleName]: NumberRule,
    // [GreaterThanZeroRule.ruleName]: GreaterThanZeroRule,
    [IntegerRule.ruleName]: IntegerRule
    // [CustomRule.ruleName]: CustomRule,
    // [ZipcodeRule.ruleName]: ZipcodeRule,
    // [CreditCardNumberRule.ruleName]: CreditCardNumberRule,
    // [DateRule.ruleName]: DateRule,
};

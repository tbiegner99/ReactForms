import RequiredRule from './rules/RequiredRule';
import LengthMinRule from './rules/LengthMinRule';
import LengthMaxRule from './rules/LengthMaxRule';
import LengthRangeRule from './rules/LengthRangeRule';
import MinRule from './rules/MinRule';
import MaxRule from './rules/MaxRule';
import RangeRule from './rules/RangeRule';
import RegexRule from './rules/RegexRule';
import EmailRule from './rules/RangeRule';
import PhoneRule from './rules/RangeRule';
import NumberRule from './rules/RangeRule';
import IntegerRule from './rules/RangeRule';
import GreaterThanZeroRule from './rules/GreaterThanZeroRule';
import DateRule from './rules/DateRule';
import CustomRule from './rules/CustomRule';
import ZipcodeRule from './rules/ZipcodeRule';
import CreditCardNumberRule from './rules/CreditCardNumberRule';


export default {
  [RequiredRule.name]: RequiredRule,
  [LengthMinRule.name]: LengthMinRule,
  [LengthMaxRule.name]: LengthMaxRule,
  [LengthRangeRule.name]: LengthRangeRule,
  [MinRule.name]: MinRule,
  [MaxRule.name]: MaxRule,
  [RangeRule.name]: RangeRule,
  [RegexRule.name]: RegexRule,
  [EmailRule.name]: EmailRule,
  [PhoneRule.name]: PhoneRule,
  [NumberRule.name]: NumberRule,
  [GreaterThanZeroRule.name]: GreaterThanZeroRule,
  [IntegerRule.name]: IntegerRule,
  [CustomRule.name]: CustomRule,
  [ZipcodeRule.name]: ZipcodeRule,
  [CreditCardNumberRule.name]: CreditCardNumberRule,
  [DateRule.name]: DateRule,

};

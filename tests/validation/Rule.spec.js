import Rule from '../../src/validation/Rule';

class CustomRule extends Rule {}
describe('Rule base class definition', () => {
  let rule;
  beforeEach(() => {
    rule = new Rule();
  });
  it('exists', () => {
    expect(typeof Rule).toBe('function');
  });
  it('has a default static rule name as class Name', () => {
    expect(Rule.ruleName).toBe('Rule');
    expect(CustomRule.ruleName).toEqual('CustomRule');
  });
  it('has a default rule name as static for instance', () => {
    expect(rule.ruleName).toBe('Rule');
    expect(new CustomRule().ruleName).toEqual('CustomRule');
  });
  it('has a getDefaultMessage function', () => {
    expect(typeof rule.getDefaultMessage).toBe('function');
    expect(rule.getDefaultMessage('val')).toBe('Rule violated for value val - Rule');
  });
  it('has a default validate function that rejects', async () => {
    expect(typeof rule.validate).toBe('function');
    await expect(rule.validate('val')).rejects.toBeInstanceOf(Error);
  });
});

import Rule from '../../src/validation/Rule';

describe('Rule base class definition', () => {
  let rule;
  beforeEach(() => {
    rule = new Rule();
  });
  it('exists', () => {
    expect(typeof Rule).toBe('function');
  });
  it('has a default null rule name', () => {
    expect(Rule.name).toBe(null);
  });
  it('has a getDefaultMessage function', () => {
    expect(typeof rule.getDefaultMessage).toBe('function');
    expect(rule.getDefaultMessage('val')).toBe('Rule violated for value val - null');
  });
  it('has a default validate function that rejects', async () => {
    expect(typeof rule.validate).toBe('function');
    await expect(rule.validate('val')).rejects.toBeInstanceOf(Error);
  });
});

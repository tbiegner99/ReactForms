export class ValidationResults {
  static Builder = class {
    constructor() {
      this.result = new ValidationResults()
    }
    withResult(result) {

    }
  }
  constructor() {
    throw new Error("please use ValidationResults.Builder")
  }
}

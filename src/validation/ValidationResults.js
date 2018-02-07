export default class ValidationResults {
    static Builder = class {
        constructor() {
            this.result = new ValidationResults();
        }

        withResult() {}
    };

    constructor() {
        throw new Error('please use ValidationResults.Builder');
    }
}

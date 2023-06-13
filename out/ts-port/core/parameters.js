class _global_parameters {
    constructor(dict) {
        this.dict = {};
        this.dict = dict;
        this.evaluate = this.dict["evaluate"];
        this.distribute = this.dict["distribute"];
        this.exp_is_pow = this.dict["exp_is_pow"];
    }
}
const global_parameters = new _global_parameters({ "evaluate": true, "distribute": true, "exp_is_pow": false });
export { global_parameters };
//# sourceMappingURL=parameters.js.map
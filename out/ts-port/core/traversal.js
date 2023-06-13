class preorder_traversal {
    constructor(node) {
        this._skip_flag = false;
        this._pt = this._preorder_traversal(node);
    }
    *_preorder_traversal(node) {
        yield node;
        if (this._skip_flag) {
            this._skip_flag = false;
            return;
        }
        if (node.instanceofBasic) {
            let args;
            if (node._argset) {
                args = node._argset;
            }
            else {
                args = node._args;
            }
            for (const arg of args) {
                for (const val of this._preorder_traversal(arg)) {
                    yield val;
                }
            }
        }
        else if (Symbol.iterator in Object(node)) {
            for (const item of node) {
                for (const val of this._preorder_traversal(item)) {
                    yield val;
                }
            }
        }
    }
    asIter() {
        const res = [];
        for (const item of this._pt) {
            res.push(item);
        }
        return res;
    }
}
export { preorder_traversal };
//# sourceMappingURL=traversal.js.map
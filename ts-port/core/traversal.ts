class preorder_traversal {
    _skip_flag: any;
    _pt: any;
    constructor(node: any) {
        this._skip_flag = false;
        this._pt = this._preorder_traversal(node);
    }

    * _preorder_traversal(node: any): any {
        yield node;
        if (this._skip_flag) {
            this._skip_flag = false;
            return;
        }
        if (node.instanceofBasic) {
            let args;
            if (node._argset) {
                args = node._argset;
            } else {
                args = node._args;
            }
            for (const arg of args) {
                for (const val of this._preorder_traversal(arg)) {
                    yield val;
                }
            }
        } else if (Symbol.iterator in Object(node)) {
            for (const item of node) {
                for (const val of this._preorder_traversal(item)) {
                    yield val;
                }
            }
        }
    }

    asIter() {
        const res: any[] = [];
        for (const item of this._pt) {
            res.push(item);
        }
        return res;
    }
}

export {preorder_traversal};

import { Basic, _Basic } from "./basic";

class preorder_traversal {
    /*
    Do a pre-order traversal of a tree.
    This iterator recursively yields nodes that it has visited in a pre-order
    fashion. That is, it yields the current node then descends through the
    tree breadth-first to yield all of a node's children's pre-order
    traversal.
    For an expression, the order of the traversal depends on the order of
    .args, which in many cases can be arbitrary.
    Parameters
    ==========
    node : SymPy expression
        The expression to traverse.
    keys : (default None) sort key(s)
        The key(s) used to sort args of Basic objects. When None, args of Basic
        objects are processed in arbitrary order. If key is defined, it will
        be passed along to ordered() as the only key(s) to use to sort the
        arguments; if ``key`` is simply True then the default keys of ordered
        will be used.
    Yields
    ======
    subtree : SymPy expression
        All of the subtrees in the tree.
    Examples
    ========
    >>> from sympy import preorder_traversal, symbols
    >>> x, y, z = symbols('x y z')
    The nodes are returned in the order that they are encountered unless key
    is given; simply passing key=True will guarantee that the traversal is
    unique.
    >>> list(preorder_traversal((x + y)*z, keys=None)) # doctest: +SKIP
    [z*(x + y), z, x + y, y, x]
    >>> list(preorder_traversal((x + y)*z, keys=True))
    [z*(x + y), z, x + y, x, y]
    */

    _skip_flag: any;
    _pt: any;
    node: any
    constructor(node: any) {
        this._skip_flag = false;
        this.node = node;
    }

    * _preorder_traversal(node: any): any {
        yield node;
        if (this._skip_flag) {
            this._skip_flag = false;
            return;
        }
        if (node.isinstance(Basic)) {
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
        for (const item of this._preorder_traversal(this.node)) {
            res.push(item);
        }
        return res;
    }
}

export {preorder_traversal};

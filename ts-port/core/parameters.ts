/*
Notable changes made:
- Dictionary system reworked as class properties
*/

class _global_parameters {
    /*
    Thread-local global parameters.
    Explanation
    ===========
    This class generates thread-local container for SymPy's global parameters.
    Every global parameters must be passed as keyword argument when generating
    its instance.
    A variable, `global_parameters` is provided as default instance for this class.
    WARNING! Although the global parameters are thread-local, SymPy's cache is not
    by now.
    This may lead to undesired result in multi-threading operations.
    Examples
    ========
    >>> from sympy.abc import x
    >>> from sympy.core.cache import clear_cache
    >>> from sympy.core.parameters import global_parameters as gp
    >>> gp.evaluate
    True
    >>> x+x
    2*x
    >>> log = []
    >>> def f():
    ...     clear_cache()
    ...     gp.evaluate = False
    ...     log.append(x+x)
    ...     clear_cache()
    >>> import threading
    >>> thread = threading.Thread(target=f)
    >>> thread.start()
    >>> thread.join()
    >>> print(log)
    [x + x]
    >>> gp.evaluate
    True
    >>> x+x
    2*x
    References
    ==========
    .. [1] https://docs.python.org/3/library/threading.html
    */

    dict: Record<any, any> = {};

    evaluate;
    distribute;
    exp_is_pow;

    constructor(dict: Record<string, any>) {
        this.dict = dict;
        this.evaluate = this.dict["evaluate"];
        this.distribute = this.dict["distribute"];
        this.exp_is_pow = this.dict["exp_is_pow"];
    }
}

const global_parameters = new _global_parameters({"evaluate": true, "distribute": true, "exp_is_pow": false});

export {global_parameters};

// AMD
if (typeof define === 'function' && define.amd)
    define([], function() { return dop });

// Node
else if (typeof module == 'object' && module.exports)
    module.exports = dop;

// Browser (root is window)
else
    root.dop = dop;

})(this);
// Based on: https://github.com/umdjs/umd
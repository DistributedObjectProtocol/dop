// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Mutator_methods
dop.core.proxyArrayHandler = {
    splice: {value:function() {
        return dop.core.splice(this, Array.prototype.slice.call(arguments,0));
    }},
    shift: {value: function() {
        return dop.core.shift(this, Array.prototype.slice.call(arguments,0));
    }},
    pop: {value:function() {
        return dop.core.pop(this, Array.prototype.slice.call(arguments,0));
    }},
    push: {value:function() {
        return dop.core.push(this, Array.prototype.slice.call(arguments,0));
    }},
    unshift: {value:function() {
        return dop.core.unshift(this, Array.prototype.slice.call(arguments,0));
    }},
    reverse: {value:function() {
        return dop.core.reverse(this);
    }},
    sort: {value:function(compareFunction) {
        return dop.core.sort(this, compareFunction);
    }},
    /*fill: {value:function() {
        return dop.core.fill.apply(this, arguments);
    }},
    copyWithin: {value:function() {
        return dop.core.copyWithin.apply(this, arguments);
    }},*/
};
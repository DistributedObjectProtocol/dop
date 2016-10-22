// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Mutator_methods
dop.core.proxyArrayHandler = {
    splice: {value:function() {
        return dop.core.splice.apply(this, arguments);
    }},
    shift: {value: function() {
        return dop.core.shift.apply(this, arguments);
    }},
    pop: {value:function() {
        return dop.core.pop.apply(this, arguments);
    }},
    push: {value:function() {
        return dop.core.push.apply(this, arguments);
    }},
    unshift: {value:function() {
        return dop.core.unshift.apply(this, arguments);
    }},
    fill: {value:function() {
        return dop.core.fill.apply(this, arguments);
    }},
    move: {value:function() {
        return dop.core.move.apply(this, arguments);
    }},
    reverse: {value:function() {
        return dop.core.reverse.apply(this, arguments);
    }},
    sort: {value:function() {
        return dop.core.sort.apply(this, arguments);
    }},
    copyWithin: {value:function() {
        return dop.core.copyWithin.apply(this, arguments);
    }},
};



// dop.core.proxyArrayCaller = function(method, array, args) {
//     var collector = dop.collect(),
//         length = array.length,
//         result = Array.prototype[method].apply(array, args);

//     if (array.length > length)
//         dop.core.storeMutation({
//             name:'length', 
//             object:array, 
//             value:array.length, 
//             oldValue:length
//         });

//     collector.emit();
//     return result;
// };
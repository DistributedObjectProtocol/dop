// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Mutator_methods
dop.core.proxyArrayHandler = {
    copyWithin:{
        value: function() {
            return dop.core.proxyArrayCaller('copyWithin', this, arguments);
        }
    },
    fill:{
        value: function() {
            return dop.core.proxyArrayCaller('fill', this, arguments);
        }
    },
    pop:{
        value: function() {
            return dop.core.proxyArrayCaller('pop', this, arguments);
        }
    },
    push:{
        value: function() {
            return dop.core.proxyArrayCaller('push', this, arguments);
        }
    },
    reverse:{
        value: function() {
            return dop.core.proxyArrayCaller('reverse', this, arguments);
        }
    },
    shift:{value: dop.core.shift},
    sort:{
        value: function() {
            return dop.core.proxyArrayCaller('sort', this, arguments);
        }
    },
    splice:{
        value: function() {
            return dop.core.proxyArrayCaller('splice', this, arguments);
        }
    },
    unshift:{
        value: function() {
            return dop.core.proxyArrayCaller('unshift', this, arguments);
        }
    }
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
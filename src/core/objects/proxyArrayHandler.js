
dop.core.proxyArrayHandler = {
    copyWithin:{
        value: function(){
            return dop.core.proxyArrayCaller('copyWithin', this, arguments);
        }
    },
    fill:{
        value: function(){
            return dop.core.proxyArrayCaller('fill', this, arguments);
        }
    },
    pop:{
        value: function(){
            return dop.core.proxyArrayCaller('pop', this, arguments);
        }
    },
    push:{
        value: function(){
            return dop.core.proxyArrayCaller('push', this, arguments);
        }
    },
    reverse:{
        value: function(){
            return dop.core.proxyArrayCaller('reverse', this, arguments);
        }
    },
    shift:{
        value: function(){
            return dop.core.proxyArrayCaller('shift', this, arguments);
        }
    },
    sort:{
        value: function(){
            return dop.core.proxyArrayCaller('sort', this, arguments);
        }
    },
    splice:{
        value: function(){
            return dop.core.proxyArrayCaller('splice', this, arguments);
        }
    },
    unshift:{
        value: function(){
            return dop.core.proxyArrayCaller('unshift', this, arguments);
        
    }}
};
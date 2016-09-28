var proxyArrayCaller = dop.core.proxyArrayCaller;

dop.core.proxyArrayHandler = {
    copyWithin:{
        value: function(){
            return proxyArrayCaller('copyWithin', this, arguments);
        }
    },
    fill:{
        value: function(){
            return proxyArrayCaller('fill', this, arguments);
        }
    },
    pop:{
        value: function(){
            return proxyArrayCaller('pop', this, arguments);
        }
    },
    push:{
        value: function(){
            return proxyArrayCaller('push', this, arguments);
        }
    },
    reverse:{
        value: function(){
            return proxyArrayCaller('reverse', this, arguments);
        }
    },
    shift:{
        value: function(){
            return proxyArrayCaller('shift', this, arguments);
        }
    },
    sort:{
        value: function(){
            return proxyArrayCaller('sort', this, arguments);
        }
    },
    splice:{
        value: function(){
            return proxyArrayCaller('splice', this, arguments);
        }
    },
    unshift:{
        value: function(){
            return proxyArrayCaller('unshift', this, arguments);
        
    }}
};
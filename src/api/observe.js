
dop.observe = function(object, property) {
    dop.util.invariant(dop.isRegistered(object), 'dop.observe needs a registered object as first parameter');
    var args = arguments;
        callback = args[args.length-1];
    dop.util.invariant(isFunction(callback), 'dop.observe needs a callback as second parameter');

    var observer = dop.createObserver(callback);
    
    (args.length===2) ?
        observer.observe(object)
    :
        observer.observe(object, property);
        
    return observer;
};
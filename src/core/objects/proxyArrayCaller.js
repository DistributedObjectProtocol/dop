
dop.core.proxyArrayCaller = function(method, array, args) {
    var collector = dop.collect(),
        length = array.length,
        result = Array.prototype[method].apply(array, args);

    if ( array.length > length )
        dop.core.storeMutation({
            name:'length', 
            object:array, 
            value:array.length, 
            oldValue:length
        });

    collector.emit();
    return result;
};
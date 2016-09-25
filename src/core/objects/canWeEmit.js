
dop.core.canWeEmit = function() {
    return ( 
        !dop.data.collecting && 
        !dop.data.collectingSystem && 
        dop.data.mutations.length>0
    );
};

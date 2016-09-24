
dop.core.canWeEmit = function(object_id) {
    return ( 
        // !dop.data.collecting && 
        !dop.data.collectingSystem && 
        !dop.data.object[object_id].collecting && 
        dop.data.object[object_id].mutations.length>0
    );
};


dop.core.storeMutation = function(mutation) {
    var collectors = dop.data.collectors,
        object_dop = dop.getObjectDop(mutation.object);
    object_dop.m.push(mutation);

    // Running collectors
    if (collectors.length > 0)
        for (var index=0,total=collectors.length; index<total; index++)
            if (collectors[index].callback===undefined || collectors[index].callback(mutation) === true)
                return collectors[index].mutations.push(mutation);

    return dop.dispatch([mutation]);        
};
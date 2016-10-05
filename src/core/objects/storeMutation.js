
dop.core.storeMutation = function(mutation) {
    var collectors = dop.data.collectors,
        object_dop = dop.getObjectDop(mutation.object);
    object_dop.m.push(mutation);

    // Running collectors
    if (collectors.length > 0)
        for (var index=0,total=collectors.length; index<total; index++)
            if (collectors[index].filter===undefined || collectors[index].filter(mutation) === true)
                return collectors[index].add(mutation);

    return dop.dispatch([mutation]);        
};
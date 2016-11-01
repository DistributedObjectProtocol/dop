
dop.core.storeMutation = function(mutation) {

    var collectors = dop.data.collectors,
        collectorsSystem = dop.data.collectorsSystem,
        index, total;

    // Storing mutation on the object
    dop.getObjectDop(mutation.object).m.push(mutation);

    // Running collectors
    if (collectors.length > 0)
        for (index=0,total=collectors.length; index<total; index++)
            if (collectors[index].add(mutation))
                return;

    // Running system collectors
    if (collectorsSystem.length > 0)
        for (index=0,total=collectorsSystem.length; index<total; index++)
            if (collectorsSystem[index].add(mutation))
                return;

    return dop.emit([mutation]);        
};
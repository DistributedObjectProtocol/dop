
dop.core.storeMutation = function(mutation) {

    var collectors = dop.data.collectors,
        index=0,
        total=collectors.length,
        path_id;

    // Saving path_id
    path_id = mutation.path_id = dop.core.getPathId(mutation.path);

    if (mutation.splice===undefined && mutation.swaps===undefined)
        path_id += dop.core.pathSeparator(mutation.prop);

    // Running collectors
    for (;index<total; index++)
        if (collectors[index].add(mutation))
            return dop.core.runDerivations(path_id);


    var snapshot = new dop.core.snapshot([mutation]);
    snapshot.emit();

    dop.core.runDerivations(path_id);
};
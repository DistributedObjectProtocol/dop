
dop.core.storeMutation = function(mutation) {

    var collectors = dop.data.collectors,
        index=0, total=collectors.length, index2=0, total2;

    mutation.path_id = dop.core.getPathId(
        (mutation.splice!==undefined || mutation.swaps!==undefined) ?
            mutation.path
        :
            mutation.path.concat(mutation.prop)
    );

    // Running collectors
    for (;index<total; index++)
        if (collectors[index].length > 0)
            for (index2=0,total2=collectors[index].length; index2<total2; index2++)
                if (collectors[index][index2].add(mutation))
                    return dop.core.runDerivations(mutation.path_id);

    var snapshot = new dop.core.snapshot([mutation]);
    snapshot.emit();

    dop.core.runDerivations(mutation.path_id);
};
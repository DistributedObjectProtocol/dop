
dop.core.storeMutation = function(mutation) {

    var collectors = dop.data.collectors,
        paths = dop.data.path,
        index=0,
        total=collectors.length,
        path_id_parent,
        path_id;

    // Saving path_id
    path_id_parent = path_id = mutation.path_id = dop.core.getPathId(mutation.path);

    if (mutation.splice===undefined && mutation.swaps===undefined)
        path_id += dop.core.pathSeparator(mutation.prop);


    // Interceptors objects
    if (!dop.core.runInterceptors(paths[path_id_parent], 'interceptors', mutation))
        return


    // Interceptors properties
    if (!dop.core.runInterceptors(paths[path_id], 'interceptors_prop', mutation))
        return


    // Collectors
    for (;index<total; index++)
        if (collectors[index].add(mutation))
            return dop.core.runDerivations(path_id);


    var snapshot = new dop.core.snapshot([mutation]);
    snapshot.emit();

    dop.core.runDerivations(path_id);
};


dop.core.runInterceptors = function(interceptors, type, mutation) {
    if (interceptors && (interceptors=interceptors[type]) && interceptors.length>0)
        for (var index=0,total=interceptors.length; index<total; ++index)
            if (interceptors[index](mutation, dop.getObjectTarget(mutation.object)) !== true)
                return false;

    return true;
};


// dop.core.runInterceptors = function(interceptors, type, mutation) {
//     if (interceptors && (interceptors=interceptors[type]) && interceptors.length>0) {
//         for (var index=0,total=interceptors.length, tosplice=[]; index<total; ++index) {
//             if (interceptors[index] === undefined)
//                 tosplice.push(index);
//             else if (interceptors[index](mutation) !== true)
//                 return false;
//         }
//         for (index=0,total=tosplice.length; index<total; ++index)
//             tosplice.splice(tosplice[index], 1);
//     }

//     return true;
// };

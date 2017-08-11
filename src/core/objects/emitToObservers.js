
dop.core.emitToObservers = function(mutations) {

    var mutation,
        path_id,
        observer_id,
        mutationsToEmitByIdObserver = {},
        mutationsWithSubscribers = false,
        data_path = dop.data.path,
        index = 0,
        total = mutations.length;

    for (;index<total; ++index) {
        mutation = mutations[index];
        path_id = mutation.path_id;

        if (!mutationsWithSubscribers && isObject(dop.data.object[dop.getObjectId(mutation.object)]))
            mutationsWithSubscribers = true;

        // .observers
        if (data_path[path_id] !== undefined && data_path[path_id].observers !== undefined) {
            for (observer_id in data_path[path_id].observers) {
                if (mutationsToEmitByIdObserver[observer_id] === undefined)
                    mutationsToEmitByIdObserver[observer_id] = [];
                mutationsToEmitByIdObserver[observer_id].push(mutation);
            }
        }

        // .observers_prop
        if (mutation.swaps === undefined) { // If mutation is swaps type we should skip because does not have observers_prop and also the length never changes
            path_id += dop.core.pathSeparator(mutation.splice===undefined ? mutation.prop : 'length');
            if (data_path[path_id] !== undefined && data_path[path_id].observers_prop !== undefined) {
                for (observer_id in data_path[path_id].observers_prop) {
                    if (mutationsToEmitByIdObserver[observer_id] === undefined)
                        mutationsToEmitByIdObserver[observer_id] = [];
                    // We have to check this because we dont want to duplicate
                    if (mutationsToEmitByIdObserver[observer_id].indexOf(mutation) == -1)
                        mutationsToEmitByIdObserver[observer_id].push(mutation);
                }
            }
        }

    }

    // Emiting
    for (observer_id in mutationsToEmitByIdObserver) {
        var observer = dop.data.observers[observer_id];
        if (observer !== undefined) // We need to make sure that the observer still exists, because maybe has been removed after calling previous observers
            observer.callback(mutationsToEmitByIdObserver[observer_id]);
    }

    return mutationsWithSubscribers;
};
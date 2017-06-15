
dop.core.emitToObservers = function(mutations) {

    var mutation,
        path_id,
        observer_id,
        observers = {},
        mutationsWithSubscribers = false,
        data_path = dop.data.path,
        index = 0,
        total = mutations.length;

    for (;index<total; ++index) {
        mutation = mutations[index];
        path_id = mutation.path_id;

        if (!mutationsWithSubscribers && isObject(dop.data.object[dop.getObjectId(mutation.object)]))
            mutationsWithSubscribers = true;


        if (data_path[path_id] !== undefined && data_path[path_id].observers !== undefined) {
            for (observer_id in data_path[path_id].observers) {
                if (observers[observer_id] === undefined)
                    observers[observer_id] = [];
                observers[observer_id].push(mutation);
            }
        }

        // If mutation is swap type we should skip
        if (mutation.swaps === undefined) {
            path_id += dop.core.pathSeparator(mutation.splice===undefined ? mutation.prop : 'length');
            if (data_path[path_id] !== undefined && data_path[path_id].observers_prop !== undefined) {
                for (observer_id in data_path[path_id].observers_prop) {
                    if (observers[observer_id] === undefined)
                        observers[observer_id] = [];
                    // We have to check this because we dont want to duplicate
                    if (observers[observer_id].indexOf(mutation) == -1)
                        observers[observer_id].push(mutation);
                }
            }
        }

    }

    // Emiting
    for (observer_id in observers)
        dop.data.observers[observer_id].callback(observers[observer_id]);

    return mutationsWithSubscribers;
};
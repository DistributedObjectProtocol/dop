dop.core.emitToObservers = function(snapshot, filterMutationsToNode) {
    var mutations = snapshot.mutations,
        mutation,
        path_id,
        observer_id,
        mutations_by_observers = {},
        mutations_with_subscribers = false,
        data_path = dop.data.path,
        index = 0,
        total = mutations.length,
        path,
        path_index,
        path_id_all

    for (; index < total; ++index) {
        mutation = mutations[index]
        path_id = mutation.path_id
        path = mutation.path

        // .observers_object
        if (
            data_path[path_id] !== undefined &&
            data_path[path_id].observers_object !== undefined
        ) {
            for (observer_id in data_path[path_id].observers_object) {
                if (mutations_by_observers[observer_id] === undefined)
                    mutations_by_observers[observer_id] = []
                mutations_by_observers[observer_id].push(mutation)
            }
        }

        // .observers_all
        for (path_index = path.length; path_index > 0; --path_index) {
            path_id_all = dop.core.getPathId(path.slice(0, path_index))
            if (
                data_path[path_id_all] !== undefined &&
                data_path[path_id_all].observers_all !== undefined
            ) {
                for (observer_id in data_path[path_id_all].observers_all) {
                    if (mutations_by_observers[observer_id] === undefined)
                        mutations_by_observers[observer_id] = []
                    mutations_by_observers[observer_id].push(mutation)
                }
            }
        }

        // .observers_prop
        if (mutation.swaps === undefined) {
            // If mutation is swaps type we should skip because does not have observers_prop and also the length never changes
            path_id += dop.core.pathSeparator(
                mutation.splice === undefined ? mutation.prop : 'length'
            )
            if (
                data_path[path_id] !== undefined &&
                data_path[path_id].observers_prop !== undefined
            ) {
                for (observer_id in data_path[path_id].observers_prop) {
                    if (mutations_by_observers[observer_id] === undefined)
                        mutations_by_observers[observer_id] = []
                    // We have to check this because we dont want to duplicate
                    if (
                        mutations_by_observers[observer_id].indexOf(mutation) ==
                        -1
                    )
                        mutations_by_observers[observer_id].push(mutation)
                }
            }
        }
    }

    // Emiting
    for (observer_id in mutations_by_observers) {
        var observer = dop.data.observers[observer_id]
        if (observer !== undefined)
            // We need to make sure that the observer still exists, because maybe has been removed after calling previous observers
            observer.callback(
                mutations_by_observers[observer_id],
                filterMutationsToNode
            )
    }

    return mutations_with_subscribers
}

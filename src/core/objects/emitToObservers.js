dop.core.emitToObservers = function(mutations) {
    var mutation,
        path_id,
        observer_id,
        mutations_to_emit_by_id_observers = {},
        mutations_with_subscribers = false,
        data_path = dop.data.path,
        index = 0,
        total = mutations.length

    for (; index < total; ++index) {
        mutation = mutations[index]
        path_id = mutation.path_id

        if (
            !mutations_with_subscribers &&
            isObject(dop.data.object[dop.getObjectId(mutation.object)])
        )
            mutations_with_subscribers = true

        // .observers
        if (
            data_path[path_id] !== undefined &&
            data_path[path_id].observers !== undefined
        ) {
            for (observer_id in data_path[path_id].observers) {
                if (
                    mutations_to_emit_by_id_observers[observer_id] === undefined
                )
                    mutations_to_emit_by_id_observers[observer_id] = []
                mutations_to_emit_by_id_observers[observer_id].push(mutation)
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
                    if (
                        mutations_to_emit_by_id_observers[observer_id] ===
                        undefined
                    )
                        mutations_to_emit_by_id_observers[observer_id] = []
                    // We have to check this because we dont want to duplicate
                    if (
                        mutations_to_emit_by_id_observers[observer_id].indexOf(
                            mutation
                        ) == -1
                    )
                        mutations_to_emit_by_id_observers[observer_id].push(
                            mutation
                        )
                }
            }
        }
    }

    // Emiting
    for (observer_id in mutations_to_emit_by_id_observers) {
        var observer = dop.data.observers[observer_id]
        if (observer !== undefined)
            // We need to make sure that the observer still exists, because maybe has been removed after calling previous observers
            observer.callback(mutations_to_emit_by_id_observers[observer_id])
    }

    return mutations_with_subscribers
}

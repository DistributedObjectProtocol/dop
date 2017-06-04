
dop.core.emitToObservers = function(mutations) {

    var mutation,
        object,
        index = 0,
        total = mutations.length,
        object_dop,
        object_id,
        observers = {},
        observer_id,
        mutationsWithSubscribers = false;

    for (;index<total; ++index) {
        mutation = mutations[index];
        object = mutation.object;
        object_dop = dop.getObjectDop(object);
        object_id = dop.getObjectId(object);

        if (!mutationsWithSubscribers && isObject(dop.data.object[object_id]))
            mutationsWithSubscribers = true;

        // Storing mutations that will be emited to createObserver aka dop.core.observer
        for (observer_id in object_dop.om) {
            if (observers[observer_id] === undefined)
                observers[observer_id] = [];
            observers[observer_id].push(mutation); 
        }
        if (object_dop.omp[mutation.prop] !== undefined) {
            for (observer_id in object_dop.omp[mutation.prop]) {
                // If it hasn't been stored yet
                if (object_dop.om[observer_id] === undefined) { 
                    if (observers[observer_id] === undefined)
                        observers[observer_id] = [];
                    observers[observer_id].push(mutation); 
                }
            }  
        }
    }

    // Emiting to observeMultiples
    for (observer_id in observers)
        dop.data.observers[observer_id].callback(observers[observer_id]);

    return mutationsWithSubscribers;
};

dop.core.emitObservers = function(mutations) {

    var mutation,
        // objects = [],
        object,
        index = 0,
        index2,
        total = mutations.length,
        total2,
        object_dop,
        object_dops = [],
        object_id,
        observersMultiples = {}, // from dop.core.observer() && dop.createObserver()
        observersProperties,
        observers,
        observer_id,
        mutationsWithSubscribers = false;

    for (;index<total; ++index) {
        mutation = mutations[index];
        object = mutation.object;
        object_dop = dop.getObjectDop(object);
        object_id = dop.getObjectId(object);

        if (!mutationsWithSubscribers && isObject(dop.data.object[object_id]))
            mutationsWithSubscribers = true;

        // Storing mutations that will be emited to observeMultiples aka observers
        for (observer_id in object_dop.om) {
            if (observersMultiples[observer_id] === undefined)
                observersMultiples[observer_id] = [];
            observersMultiples[observer_id].push(mutation); 
        }
        if (object_dop.omp[mutation.name] !== undefined) {
            for (observer_id in object_dop.omp[mutation.name]) {
                // If it hasn't been stored yet
                if (object_dop.om[observer_id] === undefined) { 
                    if (observersMultiples[observer_id] === undefined)
                        observersMultiples[observer_id] = [];
                    observersMultiples[observer_id].push(mutation); 
                }
            }  
        }

        // Emiting mutations to observerProperties
        observersProperties = object_dop.op[mutation.name];
        if (isArray(observersProperties) &&  observersProperties.length>0)
            for (index2=0,total2=observersProperties.length; index2<total2; ++index2)
                observersProperties[index2](mutation);


        // Saving temporal mutation to emit all at the same time
        observers = object_dop.o;
        if (isArray(observers) && observers.length > 0) {
            object_dop.m.push(mutation)
            if (object_dops.indexOf(object_dop) === -1)
                object_dops.push(object_dop);
        }
    }

    // Emiting mutations to observers
    for (index=0, total=object_dops.length; index<total; ++index) {
        object_dop = object_dops[index];
        observers = object_dop.o;
        for (index2=0, total2=observers.length; index2<total2; ++index2)
            observers[index2](object_dop.m.slice(0));
        
        object_dop.m = [];
    }
        

    // Emiting to observeMultiples
    for (observer_id in observersMultiples)
        dop.data.observers[observer_id].callback(observersMultiples[observer_id]);

    return mutationsWithSubscribers;
};
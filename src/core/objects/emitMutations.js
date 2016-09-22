
dop.core.emitMutations = function(object_id) {

    var object_data = dop.data.object[object_id],
        mutations = object_data.mutations,
        mutation,
        subobjects = [],
        subobject,
        index = 0,
        index2,
        index3,
        total = mutations.length,
        total2,
        total3,
        object_dop,
        observersProperties,
        observers;

    // Agrouping mutations by subobjects
    for (;index<total; ++index) {
        mutation = mutations[index];
        subobject = mutation.object;
        object_dop = dop.getObjectDop(subobject);
        if ( subobjects.indexOf(subobject) === -1 ) {
            subobjects.push(subobject);
            object_dop.m = [];
        }
        object_dop.m.push(mutation);

        //Emiting mutations to observerProperties
        observersProperties = object_dop.op[mutation.property];
        if (dop.util.typeof(observersProperties) == 'array' &&  observersProperties.length>0)
            for (index2=0,total2=observersProperties.length; index2<total2; ++index2)
                observersProperties[index2](mutation);
    }

    // Emiting mutations to observers
    for (index=0,total=subobjects.length; index<total; ++index) {
        subobject = subobjects[index];
        observers = object_dop.o;
        total3 = observers.length;
        index3 = 0;
        for (;index3<total3; ++index3)
            observers[index3]( object_dop.m.slice(0) );

        delete object_dop.m;
    }

    object_data.mutations = [];
    delete dop.data.mutating[object_id];

};

dop.core.emitMutations = function() {

    if (dop.core.canWeEmit()) {

        var mutations = dop.data.mutations,
            mutation,
            subobjects = [],
            subobject,
            index = 0,
            index2,
            total = mutations.length,
            total2,
            object_dop,
            observersProperties,
            observers;

        // Agrouping mutations by subobjects
        for (;index<total; ++index) {
            mutation = mutations[index];
            subobject = mutation.object;
            object_dop = dop.getObjectDop(subobject);

            // Emiting mutations to observerProperties
            observersProperties = object_dop.op[mutation.name];
            if (dop.util.typeof(observersProperties) == 'array' &&  observersProperties.length>0)
                for (index2=0,total2=observersProperties.length; index2<total2; ++index2)
                    observersProperties[index2](mutation);

            if ( subobjects.indexOf(subobject) === -1 ) {
                subobjects.push(subobject);

                // Emiting mutations to observers
                observers = object_dop.o;
                for (index2 = 0, total2 = observers.length;index2<total2; ++index2)
                    observers[index2]( object_dop.m.slice(0) );

                object_dop.m = [];
            }
        }


        dop.data.mutations = [];

    }
};
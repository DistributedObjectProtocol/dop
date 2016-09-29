
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
            observers,
            action = {},
            unaction = {},
            path,
            object_id,
            node_token;

        for (;index<total; ++index) {
            mutation = mutations[index];
            subobject = mutation.object;
            object_dop = dop.getObjectDop(subobject);
            path = object_dop.slice(0).concat(mutation.name);

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

            // Storing action and unaction
            dop.util.set(action, path, mutation.value);
            dop.util.set(unaction, path, mutation.oldValue);

        }

        // Emiting to nodes/subscriptors
        for (object_id in action)
            if ( dop.data.object[object_id].nodes > 0 )
                for (node_token in dop.data.object[object_id].node)
                    dop.protocol.merge(dop.data.node[node_token], object_id, action[object_id]);


        dop.data.mutations = [];

        return {action:action, unaction:unaction};
    }
};

dop.set = function(object, property, value) {
    dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.set must be a registered object');
    var mutation = dop.core.set(object, property, value);
    if (mutation !== false) {
        var object_id = dop.getObjectId(object);
        dop.core.storeMutation(mutation);
        if (dop.core.canWeEmit(object_id))
            dop.core.emitMutations(object_id);
    }
};






dop.core.storeMutation = function(mutation) {
    var object_id = dop.getObjectId(mutation.object);
    dop.data.object[object_id].mutations.push(mutation);
    dop.data.mutating[object_id] = true;
};

// dop.core.storeMutation = function(mutation) {
//     var object_id = dop.getObjectId(mutation.object),
//         mutations = dop.data.object[object_id].mutations,
//         index = 0,
//         total = mutations.length;

//     for (;index<total; ++index) {
//         if (mutations[index].property === mutation.property && mutations[index].object === mutation.object) {
//             mutations.splice(index, 1);
//             break;
//         }
//     }

//     mutations.push(mutation);
//     dop.data.mutating[object_id] = true;
// };


dop.core.canWeEmit = function(object_id) {
    return ( 
        !dop.data.collecting && 
        !dop.data.collectingSystem && 
        !dop.data.object[object_id].collecting && 
        dop.data.object[object_id].mutations.length>0
    );
};


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



dop.collect = function() {
    var args=arguments, total=args.length;
    if (total === 0)
        dop.data.collecting = true;
    else
        for ( var index=0; index<total; ++index )
            if (dop.isRegistered(args[index]))
                dop.data.object[dop.getObjectId(args[index])].collecting = true;
};


dop.release = function() {
    var args=arguments, total=args.length;
    if (total === 0) {
        dop.data.collecting = false;
        for (var object_id in dop.data.mutating)
            dop.core.emitMutations(object_id);
    }
    else {
        for ( var index=0, object_id; index<total; ++index ) {
            object_id = dop.getObjectId(args[index]);
            if (dop.isRegistered(args[index])) {
                dop.data.object[object_id].collecting = false;
                dop.core.emitMutations(object_id);
            }
        }
    }
};







setTimeout(function(){
console.clear();
o1=dop.register({
    A:{
        A1:{
            A11:['a','b','c','d',{sub:'sub'}],
            A12:"Enzo",
        },
        A2:{}
    },
    B:{}
});
o2=dop.register({mola:123})
dop.observe(o2, mutations => console.log( 'O2',mutations.length, mutations ));
dop.observe(o1.A.A1.A11[4], mutations => console.log( 'A',mutations.length, mutations ));
dop.observe(o1.A.A1.A11, mutations => console.log( 'B',mutations.length, mutations ));
dop.observeProperty(o1.A.A1.A11[4], 'cagondios', mutations => console.log( 'C',mutations ));

dop.collect(o2);
o2.mola=25;
o1.A.A1.A11.shift();
o1.A.A1.A11[3].cagondios=123
o1.A.A1.A11[3].cagondios=234
dop.release();


},1000)






dop.delete = function( object, property) {};
dop.merge = function( object, mutations ) {};




// mymethod: dop.controller(() => {
//     // actions...
// })
// dop.render = function() {}



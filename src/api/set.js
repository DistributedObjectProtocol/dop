
dop.set = function(object, property, value) {
    dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.set must be a registered object');
    var mutation = dop.core.set(object, property, value);
    if (mutation !== false) {
        dop.core.storeMutationObject(mutation, dop.data.mutations_objects);
        dop.core.emitMutationsObject(object, dop.data.mutations_objects);
    }
};







dop.core.storeMutationObject = function(mutation, mutations_objects) {

    var object = mutation.object,
        mutations = dop.getObjectDop(object).m;

    if (mutations_objects.indexOf(object) == -1)
        mutations_objects.push(object);

    dop.getObjectDop(object).m.push(mutation);

};


dop.core.emitMutationsObject = function(object, mutations_objects) {

    var mutations = dop.getObjectDop(object).m;

    if (dop.getObjectDop(object).c !== true && mutations.length>0 && !dop.data.collecting) {

        var observers = dop.getObjectDop(object).o,
            total = observers.length,
            index = 0;

        for (;index<total; ++index) {
            observers[index]( mutations );
        }

        dop.getObjectDop(object).m = dop.getObjectDop(object).m = [];

        return true;

    }

    return false;

};








dop.core.emitMutationsObjectLoop = function(mutations_objects) {

    var index=0,
        t=mutations_objects.length;

    while (index<t) {
        if ( dop.core.emitMutationsObject(mutations_objects[index], mutations_objects) )
            t -= 1;
        else
            index += 1;
    }

};




// dop.collect = function() {
//     var args=arguments, total=args.length;
//     if (t === 0)
//         dop.data.collecting = true;
//     else
//         for ( var index=0; i<total; ++i )
//             if (dop.isRegistered(args[index]))
//                 dop.getObjectDop(args[index]).c = true;
// };


// dop.release = function() {
//     var args=arguments, t=args.length;
//     if (t === 0) {
//         dop.data.collecting = false;
//         dop.core.emitMutationsObjectLoop(dop.data.mutations_objects);
//     }
//     else {
//         for ( var i=0, indexOf; i<t; ++i ) {
//             if (dop.isRegistered(args[i])) {
//                 indexOf=dop.data.mutations_objects.indexOf(args[i]);
//                 if (indexOf > -1) {
//                     dop.core.emitMutations(indexOf);
//                     delete dop.getObjectDop(args[i]).c;
//                 }
//             }
//         }
//     }
// };







// setTimeout(function(){
// console.clear();
// o1=dop.register({
//     A:{
//         A1:{
//             A11:['a','b','c','d',{sub:'sub'}],
//             A12:"Enzo",
//         },
//         A2:{}
//     },
//     B:{}
// });
// dop.observe(o1.A.A1.A11[4], mutations => console.log( 'A',mutations.length, mutations ));
// dop.observe(o1.A.A1.A11, mutations => console.log( 'B',mutations.length, mutations ));

// o1.A.A1.A11.shift();

// },1000)






dop.observeDeep = function(object, callback) {};
dop.unobserveDeep = function(object, callback) {};

dop.delete = function( object, property) {};
dop.merge = function( object, mutations ) {};




// mymethod: dop.controller(() => {
//     // actions...
// })
// dop.render = function() {}



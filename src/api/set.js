
dop.set = function(object, property, value) {
    dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.set must be a registered object');
    var mutation = dop.core.mutate(object, property, value);
    if (mutation !== false) {
        var object_id = dop.getObjectId(object);
        dop.core.storeMutation(mutation);
        if (dop.core.canWeEmit(object_id))
            dop.core.emitMutations(object_id);
    }
};


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
// o2=dop.register({mola:123})
// dop.observe(o2, mutations => console.log( 'O2',mutations.length, mutations ));
// dop.observe(o1.A.A1.A11[4], mutations => console.log( 'A',mutations.length, mutations ));
// dop.observe(o1.A.A1.A11, mutations => console.log( 'B',mutations.length, mutations ));
// dop.observeProperty(o1.A.A1.A11[4], 'cagondios', mutations => console.log( 'C',mutations ));

// dop.collect(o2);
// o2.mola=25;
// o1.A.A1.A11.shift();
// o1.A.A1.A11[3].cagondios=123
// o1.A.A1.A11[3].cagondios=234
// dop.dispatch();


// },1000)






dop.delete = function( object, property) {};
dop.merge = function( object, mutations ) {};




// mymethod: dop.controller(() => {
//     // actions...
// })
// dop.render = function() {}



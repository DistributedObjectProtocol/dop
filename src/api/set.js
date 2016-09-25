
dop.set = function(object, property, value) {
    dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.set must be a registered object');
    var mutation = dop.core.mutate(object, property, value);
    if (mutation !== false) {
        var object_id = dop.getObjectId(object);
        dop.core.storeMutation(mutation);
        dop.core.emitMutations();
    }
    return true;
};

dop.delete = function(object, property) {
    dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.delete must be a registered object');
    var mutation = dop.core.mutate(object, property);
    if (mutation !== false) {
        var object_id = dop.getObjectId(object);
        dop.core.storeMutation(mutation);
        dop.core.emitMutations();
    }
    return true;
};


setTimeout(function(){
console.clear();

o2=dop.register({mola:123})
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

dop.observe(o2, mutations => console.log( 'O2',mutations.length, mutations ));
dop.observe(o1.A.A1.A11, mutations => console.log( 'o1.A.A1.A11',mutations.length, mutations ));
dop.observe(o1.A.A1.A11[4], mutations => console.log( 'o1.A.A1.A11[4]',mutations ));
dop.observeProperty(o1.A.A1.A11[4], 'sub', mutation => console.log( 'o1.A.A1.A11[4].sub',mutation ));

dop.collect();
o2.mola=25;
o1.A.A1.A11[4].sub=123
o1.A.A1.A11.shift();
o1.A.A1.A11[3].sub=234
dop.dispatch();


},1000)










// mymethod: dop.controller(() => {
//     // actions...
// })
// dop.render = function() {}



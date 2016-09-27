
dop.merge = function() {
    dop.data.collectingSystem = true;
    dop.util.merge.apply(this, arguments);
    dop.data.collectingSystem = false;
    dop.core.emitMutations();
};



// setTimeout(function(){
// console.clear();

// o2=dop.register({mola:123,array:[1,2,3]})
// dop.observe(o2, mutations => console.log( 'O2',mutations.length, mutations ));
// dop.observe(o2.array, mutations => console.log( 'O2.array',mutations.length, mutations ));
// dop.merge(o2, {vaya:'tela', mola:undefined, array:{0:"25",1:undefined,length:2}})
// console.log( o2 );

// },1000)




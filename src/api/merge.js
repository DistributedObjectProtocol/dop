
dop.merge = function() {
    dop.data.collectingSystem = true;
    dop.util.merge.apply(this, arguments);
    dop.data.collectingSystem = false;
    return dop.core.emitMutations();
};



// setTimeout(function(){
// console.clear();

// o2=dop.register({mola:123,old:"old",array:[1,2,3]})
// console.log( JSON.stringify(o2) );
// // dop.observe(o2, mutations => console.log( 'O2',mutations.length, mutations ));
// // dop.observe(o2.array, mutations => console.log( 'O2.array',mutations.length, mutations ));
// dop.merge(o2, {old:'old', new:'newvalue', mola:undefined, array:{0:"25",1:undefined,length:10}})
// // console.log( o2["~dop"].t, o2.array["~dop"].t );
// console.log( JSON.stringify(o2) );

// },1000)




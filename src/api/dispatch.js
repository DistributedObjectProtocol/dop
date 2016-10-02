
dop.dispatch = function(mutations) {
    if ( this.mutations===mutations )
        dop.data.collectors.splice(dop.data.collectors.indexOf(this), 1);

    var action = dop.core.emitMutations(mutations);
    dop.core.emitActionSubscribers( action );
    return action;
};



// setTimeout(function(){
// console.clear();

// obj=dop.register({mola:123,old:"old",array:[1,2,3,4,5,6,7,8]})


// console.log( obj.array.slice(0) );
// collector = dop.collect();
// obj.array.shift();
// obj.array.push('mola');
// obj.array.splice(2,2,'coca','cola');
// obj.array.reverse();
// console.log( obj.array.slice(0) );
// collector.dispatch();
// unaction = dop.getUnaction(collector.mutations);
// dop.setAction(unaction)
// console.log('merged', obj.array.slice(0) );


// },1000)


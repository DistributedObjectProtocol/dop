var test = require('tape');
// require('tabe').createStream( test );
var dop = require('../dist/nodejs');




// function myfun(mutations) {
//     console.log( mutations );
// }

var object = dop.register({uno:'A',dos:'B'});
var object2 = dop.register({uno:1, cuatro:4});
// dop.observe(object, myfun)
// object.uno = 25



test('createObserver.observe', function(t) {

    function first(mutations) {
        // console.log( mutations );
    }
    function second(){}

    var observer = dop.createObserver(first);
    var observer2 = dop.createObserver(first);
    var observer3 = dop.createObserver(second);
    t.equal(dop.data.observers[observer.id], observer2, 'Must be same object');
    t.equal(observer, observer2, 'observe and observe2 must be same observers');
    t.notEqual(observer, observer3, 'observe and observe3 must be note same observers');
    t.equal(Object.keys(dop.data.observers).length, 2, 'Only two observers stored');


    observer3.observe(object);
    t.equal(dop.getObjectDop(object).om[observer3.id], true, 'Observer3 stored correctly inside of object_dop');
    t.equal(observer3.objects[0], object, 'Object stored correctly into de observer3 instance');
    
    observer3.unobserve(object);
    t.equal(Object.keys(dop.data.observers).length, 2, 'Only two observers stored');
    t.equal(dop.getObjectDop(object).om[observer3.id], undefined, 'Observer3 unstored correctly inside of object_dop');
    t.equal(observer3.objects[0], undefined, 'Object unstored correctly into de observer3 instance');

    observer.observe(object);
    t.equal(observer.objects[0], object, 'Object stored correctly into de observer instance');
    t.equal(dop.getObjectDop(object).om[observer.id], true, 'Observer stored correctly from object');
    observer.destroy()
    t.equal(dop.data.observers[observer.id], undefined, 'Shouldnt be stored');
    t.equal(Object.keys(dop.data.observers).length, 1, 'Only one observers stored');
    t.equal(dop.getObjectDop(object).om[observer.id], undefined, 'Observer unstored correctly from object');

    t.end();

})


test('createObserver.observeProperty', function(t) {

    function first(mutations) {}
    var observer = dop.createObserver(first);
    observer.observeProperty(object, 'uno');
    t.equal(observer.properties.uno[0], object, 'Object stored correctly inside of the observer')
    t.equal(dop.getObjectDop(object).omp['uno'][observer.id], true, 'Observer id stored correctly inside of object_dop')
    t.equal(observer.properties.uno.length, 1, 'One objects stored into uno property')
    observer.observeProperty(object2, 'uno');
    t.equal(observer.properties.uno[1], object2, 'Object2 stored correctly inside of the observer')
    t.equal(dop.getObjectDop(object2).omp['uno'][observer.id], true, 'Observer id stored correctly inside of object_dop2')
    t.equal(observer.properties.uno.length, 2, 'Two objects stored into uno property')
    

    observer.unobserveProperty(object, 'uno');
    t.equal(observer.properties.uno[0], object2, 'Object2 stored correctly inside of the observer')
    t.equal(observer.properties.uno.indexOf(object), -1, 'Indexof -1')
    t.equal(dop.getObjectDop(object).omp['uno'][observer.id], undefined, 'Observer id unstored correctly inside of object_dop')
    t.equal(observer.properties.uno.length, 1, 'One objects stored into uno property')


    observer.observeProperty(object, 'uno');
    observer.observeProperty(object2, 'dos');
    t.notEqual(dop.data.observers[observer.id], undefined)
    t.equal(observer.properties.uno.length, 2)
    t.equal(dop.getObjectDop(object).omp['uno'][observer.id], true)
    t.equal(dop.getObjectDop(object2).omp['uno'][observer.id], true)
    t.equal(dop.getObjectDop(object2).omp['dos'][observer.id], true)


    observer.destroy()
    t.equal(dop.data.observers[observer.id], undefined)
    t.equal(observer.properties.uno.length, 2, 'Not necesary to remove items inside of the observer')
    t.equal(dop.getObjectDop(object).omp['uno'][observer.id], undefined)
    t.equal(dop.getObjectDop(object2).omp['uno'][observer.id], undefined)
    t.equal(dop.getObjectDop(object2).omp['dos'][observer.id], undefined)


    t.end()
})


test('mutations with createObserver', function(t) {
    
    var muta;
    var observer = dop.createObserver(function first(mutations) {
        t.equal(mutations.length, 2, 'Two mutations received for the first observer')
        muta = mutations;
    });
    var observer2 = dop.createObserver(function second(mutations) {
        t.equal(mutations.length, 1, 'One mutations received for the second observer');
        t.equal(mutations[0], muta[0], 'The first mutation is the same object than the first observer');
        t.end()
    });
    observer.observe(object);
    observer.observeProperty(object, 'uno');
    observer2.observeProperty(object, 'uno');

    collector = dop.collect()
    dop.set(object, 'uno', 123);
    dop.set(object, 'new', 123);
    collector.emitAndDestroy()

})


// todo
// test('dop.observe', function(t) {})
test('dop.observeProperty', function(t) {
    var object = dop.register({
        todos: []
    });
    dop.observe(object.todos, function(mutations){
        // console.log( mutations );
    })
    // object.todos.push(1);
    dop.set(object.todos, 1, 25);
    t.end();
})

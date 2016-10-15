
var dop = require('../dist/nodejs');
var test = require('tape');
var tabe = require('tabe');
// tabe.createStream( test );
var set = dop.set;
var del = dop.delete;



var object = dop.register({
    prop:"prop",
    subobject:{
        a:1,
        b:2,
        c:{d:3}
    }
});
var object_id = dop.getObjectId(object);



test('Sets: Adding a new subobject must convert it as register', t => {
    set(object, 'new',{isregisterd:true});
    var dopobject = dop.getObjectDop(object.new);
    t.equal(typeof dopobject, 'object');
    t.equal(JSON.stringify(dopobject), JSON.stringify([object_id, 'new']));
    t.end();
});


test('Sets: Copying object already registered must create a new one', t => {
    set(object, 'new2', object.new);
    var dopobject = dop.getObjectDop(object.new2);
    t.equal(object.new === object.new2, false);
    t.equal(JSON.stringify(dopobject), JSON.stringify([object_id, 'new2']));
    t.end();
});



test('Sets: Copying object already registered into another deep object', t => {
    set(object.subobject, 'new', object.new);
    var dopobject = dop.getObjectDop(object.subobject.new);
    t.equal(object.subobject.new === object.new, false);
    t.equal(JSON.stringify(dopobject), JSON.stringify([object_id, 'subobject', 'new']));
    t.end();
});






// setTimeout(function() {console.clear();

// // INITIATION
// obj=dop.register({
//     prop:"prop",
//     arr:[1,2,{arr2:[2,3,{the:"end"}]}],
//     old:"old"
// })
// remote=dop.register(dop.util.merge({}, obj));
// console.log( JSON.stringify(obj) );
// console.log( JSON.stringify(remote) );

// {arr:[
//     [0,1], // splice
//     [0,-1] // swap
//     [1,{arr2:[[0,1]]}], // inner changes
// ]}


// // MUTATIONS COLLECT
// collector = dop.collect();
// obj.new='yeah';
// delete obj.old;
// obj.arr.shift();
// obj.arr[1].arr2.shift();
// action = collector.getAction();
// console.log( 'ACTION', JSON.stringify(action) );


// console.log('APLYING ACTION REMOTE')
// action[4] = action[3];
// delete action[3];
// dop.setAction(action);
// console.log( JSON.stringify(obj) );
// console.log( JSON.stringify(remote) );

// },1000)



// obj=dop.register({array:[1,[2,{i:3}]]})
// collector = dop.collect();
// // obj.new='yeah';
// // delete obj.old;
// obj.array.shift();
// // obj.splice(2,{last:9},'coca','cola');
// // obj.reverse();
// // obj.push(dop.register({registered:true}));
// obj.array[0].shift();
// obj.array[0][0].i=33;
// console.log( JSON.stringify(obj.array) );
// obj.array[0].push(4);
// obj.array.push([5]);
// // console.log( collector.getAction() );
// console.log( JSON.stringify(collector.getAction()[3]) );

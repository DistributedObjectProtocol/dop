
var dop = require('../dist/nodejs');
var test = require('tape');
// require('tabe').createStream( test );



test('YEAHH', function(t) {
    t.equal('ret', 'ret');
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

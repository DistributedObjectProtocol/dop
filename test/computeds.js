var test = require('tape');
// require('tabe').createStream( test );
var dop = require('../dist/nodejs').create()
var computed = dop.computed;
var get = dop.get;
var set = dop.set;
var del = dop.del;



test('Creating inside register', function(t) {
    var runs = 0
    var object = dop.register({
        name:"Josema",
        surname:"Gonzalez",
        fullname: computed(function(oldvalue){
            t.equal(oldvalue, undefined)
            runs += 1
            return get(this,"name") +' '+ get(this,"surname")
        })
    })

    t.equal(object.fullname, "Josema Gonzalez")
    t.equal(object.fullname, "Josema Gonzalez")
    t.equal(runs, 1)
    

    t.end()
});

test('Setting a computed', function(t) {
    var runs = 0
    var object = dop.register({
        name:"Josema",
        surname:"Gonzalez",
        fullname: "..."
    })
    set(object, 'fullname', computed(function(oldvalue){
        t.equal(oldvalue, "...")
        runs += 1
        return get(this,"name") +' '+ get(this,"surname")
    }))

    t.equal(object.fullname, "Josema Gonzalez")
    t.equal(object.fullname, "Josema Gonzalez")
    t.equal(runs, 1)
    

    t.end()
});



test('addComputed', function(t) {
    var runs = 0
    var object = dop.register({
        name:"Josema",
        surname:"Gonzalez",
        fullname: "..."
    })
    dop.addComputed(object, 'fullname', function(oldvalue){
        t.equal(oldvalue, "...")
        runs += 1
        return get(this,"name") +' '+ get(this,"surname")
    })

    t.equal(object.fullname, "Josema Gonzalez")
    t.equal(object.fullname, "Josema Gonzalez")
    t.equal(runs, 1)
    

    t.end()
});





test('Mutating name', function(t) {
    var runs = 0
    var object = dop.register({
        name:"Josema",
        surname:"Gonzalez",
        fullname: computed(function(oldvalue){
            runs += 1
            return get(this,"name") +' '+ get(this,"surname")
        })
    })

    t.equal(object.fullname, "Josema Gonzalez")
    set(object, 'name', 'Enzo')
    t.equal(object.fullname, "Enzo Gonzalez")
    t.equal(runs, 2)
    

    t.end()
});



test('Computed based in other computed', function(t) {
    var runs = 0
    var object = dop.register({
        name:"Josema",
        surname:"Gonzalez",
        fullname: computed(function(oldvalue){
            runs += 1
            return get(this,"name") +' '+ get(this,"surname")
        }),
        fullnameUpper: computed(function(oldvalue){
            runs += 1
            return get(this,"fullname").toUpperCase()
        })
    })

    t.equal(object.fullname, "Josema Gonzalez")
    t.equal(object.fullnameUpper, "JOSEMA GONZALEZ")
    set(object, 'name', 'Enzo')
    t.equal(object.fullname, "Enzo Gonzalez")
    t.equal(object.fullnameUpper, "ENZO GONZALEZ")
    t.equal(runs, 4)
    

    t.end()
});




test('Computed based in other object', function(t) {
    var runs = 0
    var object = dop.register({
        name:"Josema",
        surname:"Gonzalez"
    })
    var object2 = dop.register({
        fullname: computed(function(oldvalue){
            t.equal(oldvalue, undefined)
            runs += 1
            return get(object,"name") +' '+ get(object,"surname")
        }),
    })

    t.equal(object2.fullname, "Josema Gonzalez")
    t.equal(object2.fullname, "Josema Gonzalez")
    t.equal(runs, 1)
    

    t.end()
});






test('Computed based in other object computed', function(t) {
    var runs = 0
    var object = dop.register({
        name:"Josema",
        surname:"Gonzalez"
    })
    var object2 = dop.register({
        fullname: computed(function(oldvalue){
            runs += 1
            return get(object,"name") +' '+ get(object,"surname")
        })
    })
    var object3 = dop.register({
        fullnameUpper: computed(function(oldvalue){
            runs += 1
            return get(object2,"fullname").toUpperCase()
        })
    })

    t.equal(object2.fullname, "Josema Gonzalez")
    t.equal(object2.fullname, "Josema Gonzalez")
    t.equal(object3.fullnameUpper, "JOSEMA GONZALEZ")
    t.equal(object3.fullnameUpper, "JOSEMA GONZALEZ")
    set(object, 'name', 'Enzo')
    t.equal(object2.fullname, "Enzo Gonzalez")
    t.equal(object2.fullname, "Enzo Gonzalez")
    t.equal(object3.fullnameUpper, "ENZO GONZALEZ")
    t.equal(object3.fullnameUpper, "ENZO GONZALEZ")
    t.equal(runs, 4)
    

    t.end()
});



test('Deep property', function(t) {
    var object = dop.register({
        subobject: {
            name:"Josema",
            surname:"Gonzalez",
        },
        fullname: computed(function(oldvalue){
            t.equal(oldvalue, undefined)
            return get(this.subobject,"name") +' '+ get(this.subobject,"surname")
        })
    })

    t.equal(object.fullname, "Josema Gonzalez")
    t.end()
});



test('Deep computed set', function(t) {
    var object = dop.register({
        name:"Josema",
        surname:"Gonzalez"
    })
    
    set(object, 'subobject', {
        fullname: computed(function(oldvalue){
            t.equal(oldvalue, undefined)
            return get(object,"name") +' '+ get(object,"surname")
        })
    })

    t.equal(object.subobject.fullname, "Josema Gonzalez")
    t.end()
});

test('Deep computed addComputed', function(t) {
    var object = dop.register({
        name:"Josema",
        surname:"Gonzalez",
        subobject: {}
    })
    dop.addComputed(object.subobject, 'fullname', function(oldvalue){
        t.equal(oldvalue, undefined)
        return get(object,"name") +' '+ get(object,"surname")
    })

    t.equal(object.subobject.fullname, "Josema Gonzalez")
    t.end()
});


test('Deep computed second object', function(t) {
    var object = dop.register({
        name:"Josema",
        surname:"Gonzalez",
        subobject: {}
    })
    var object2 = dop.register({
        subobject: {
            fullname: computed(function(oldvalue){
                t.equal(oldvalue, undefined)
                return get(object,"name") +' '+ get(object,"surname")
            })
        }
    })

    t.equal(object2.subobject.fullname, "Josema Gonzalez")
    t.end()
});


test('Deleting derivation', function(t) {
    var object = dop.register({
        name:"Josema",
        surname:"Gonzalez",
        fullname: computed(function(oldvalue){
            return get(this,"name") +' '+ get(this,"surname")
        })
    })


    t.equal(object.fullname, "Josema Gonzalez")
    del(object, 'name')
    t.equal(object.fullname, "undefined Gonzalez")
    t.end()
});


// test('Deleting computed', function(t) {
//     var object = dop.register({
//         name:"Josema",
//         surname:"Gonzalez",
//         fullname: computed(function(oldvalue){
//             return get(this,"name") +' '+ get(this,"surname")
//         })
//     })


//     t.equal(object.fullname, "Josema Gonzalez")
//     del(object, 'name')
//     t.equal(object.fullname, "undefined Gonzalez")
//     t.end()
// });


// test('Deleting parent object where derivation is instantiated', function(t) {
//     var object = dop.register({
//         subobject: {
//             name:"Josema",
//             surname:"Gonzalez",
//         },
//         fullname: computed(function(oldvalue){
//             t.equal(oldvalue, undefined)
//             return get(this.subobject,"name") +' '+ get(this.subobject,"surname")
//         })
//     })


//     t.equal(object.fullname, "Josema Gonzalez")
//     t.end()
// });


// when delete
// when set a deleted
// arrays
// dos addComputed
// check mutations
// remove computed
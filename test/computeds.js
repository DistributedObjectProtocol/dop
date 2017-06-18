var test = require('tape');
// require('tabe').createStream( test );
var dop = require('../dist/nodejs').create()
var computed = dop.computed;
var get = dop.get;
var set = dop.set;
var del = dop.del;



test('Creating inside register', function(t) {
    var collector = dop.collect()
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
    

    t.equal(collector.mutations.length, 0, "mutations")
    collector.emit()
    t.end()
});

test('Setting a computed', function(t) {
    var collector = dop.collect()
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
    

    t.equal(collector.mutations.length, 1, "mutations")
    collector.emit()
    t.end()
});



test('addComputed', function(t) {
    var collector = dop.collect()
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
    

    t.equal(collector.mutations.length, 1, "mutations")
    collector.emit()
    t.end()
});





test('Mutating name', function(t) {
    var collector = dop.collect()
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
    

    t.equal(collector.mutations.length, 2, "mutations")
    collector.emit()
    t.end()
});



test('Computed based in other computed', function(t) {
    var collector = dop.collect()
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
    

    t.equal(collector.mutations.length, 3, "mutations")
    collector.emit()
    t.end()
});




test('Computed based in other object', function(t) {
    var collector = dop.collect()
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
    

    t.equal(collector.mutations.length, 0, "mutations")
    collector.emit()
    t.end()
});






test('Computed based in other object computed', function(t) {
    var collector = dop.collect()
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
    

    t.equal(collector.mutations.length, 3, "mutations")
    collector.emit()
    t.end()
});



test('Deep property', function(t) {
    var collector = dop.collect()
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
    t.equal(collector.mutations.length, 0, "mutations")
    collector.emit()
    t.end()
});



test('Deep computed set', function(t) {
    var collector = dop.collect()
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
    t.equal(collector.mutations.length, 1, "mutations")
    collector.emit()
    t.end()
});



test('Deep computed addComputed', function(t) {
    var collector = dop.collect()
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
    t.equal(collector.mutations.length, 1, "mutations")
    collector.emit()
    t.end()
});


test('Deep computed second object', function(t) {
    var collector = dop.collect()
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
    t.equal(collector.mutations.length, 0, "mutations")
    collector.emit()
    t.end()
});


test('Deleting derivation', function(t) {
    var collector = dop.collect()
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
    t.equal(collector.mutations.length, 2, "mutations")
    collector.emit()
    t.end()
});


test('Deleting derivation', function(t) {
    var collector = dop.collect()
    var object = dop.register({
        name:"Josema",
        surname:"Gonzalez",
        fullname: computed(function(oldvalue){
            return get(this,"name") +' '+ get(this,"surname")
        })
    })


    t.equal(object.fullname, "Josema Gonzalez")
    del(object, 'fullname')
    t.equal(object.fullname, undefined)
    t.equal(collector.mutations.length, 1, "mutations")
    collector.emit()
    t.end()
});


test('Deleting parent object where derivation is instantiated', function(t) {
    var collector = dop.collect()
    var object = dop.register({
        subobject: {
            name:"Josema",
            surname:"Gonzalez",
        },
        fullname: computed(function(oldvalue){
            try {
                return get(this.subobject,"name") +' '+ get(this.subobject,"surname")
            } catch(e) {
                t.equal(e.toString().indexOf("TypeError")>-1, true, "Is a typeError")
            }
        })
    })


    t.equal(object.fullname, "Josema Gonzalez")
    del(object, 'subobject')
    
    t.equal(collector.mutations.length, 2, "mutations")
    collector.emit()
    t.end()
});


test('Creating computed from derivations deleted', function(t) {
    var collector = dop.collect()
    var object = dop.register({
        subobject: {
            name:"Josema",
            surname:"Gonzalez",
        }
    })
    var copy = object.subobject;
    copy.lol = {test:1234}
    del(object, 'subobject')
    object.fullname = computed(function(){
        return get(copy,"name") +' '+ get(copy,"surname")
    })


    t.equal(object.fullname, "Josema Gonzalez")
    set(copy.name, "Enzo")
    t.equal(object.fullname, "Josema Gonzalez")
    
    t.equal(collector.mutations.length, 3, "mutations")
    collector.emit()
    t.end()
});


test('Creating computed from other computed deleted', function(t) {
    var collector = dop.collect()
    var object = dop.register({
        subobject: {
            name:"Josema",
            surname:"Gonzalez",
        }
    })

    var copy = object.subobject;
    del(object, 'subobject')
    var object2 = dop.register({
        fullname: computed(function(){
            return get(copy,"name") +' '+ get(copy,"surname")
        })
    })



    t.equal(object2.fullname, "Josema Gonzalez")
    set(copy, 'name', "Enza")
    t.equal(object2.fullname, "Josema Gonzalez")
    set(object, 'subobject', copy)
    set(object.subobject, 'name', "Enzo")
    t.equal(object2.fullname, "Enzo Gonzalez")
    
    t.equal(collector.mutations.length, 5, "mutations")
    collector.emit()
    t.end()
});



test('Arrays', function(t) {
    var collector = dop.collect()

    var object = dop.register({
        array: [
            {val:"Josema"},
            {val:"Gonzalez"}
        ],
        fullname: computed(function(){
            return get(this.array[0],"val") +' '+ get(this.array[1],"val")
        })
    })


    t.equal(object.fullname, "Josema Gonzalez")
    object.array.reverse()
    t.equal(object.fullname, "Gonzalez Josema")

    
    t.equal(collector.mutations.length, 2, "mutations")
    collector.emit()
    t.end()
});



test('Arrays2', function(t) {
    var collector = dop.collect()

    var object = dop.register({
        array: [
            {val:"Josema"},
            {val:"Gonzalez"}
        ],
        fullname: computed(function(){
            return get(this.array[0],"val") +' '+ get(this.array[1],"val")
        }),
        fullnameReverse: computed(function(){
            return get(this, "fullname").toUpperCase()
        }),
    })


    t.equal(object.fullname, "Josema Gonzalez")
    object.array.reverse()
    t.equal(object.fullnameReverse, "GONZALEZ JOSEMA")

    
    t.equal(collector.mutations.length, 3, "mutations")
    collector.emit()
    t.end()
});



test('Arrays 3', function(t) {
    var collector = dop.collect()

    var object = dop.register({
        array: [
            {val:"Josema"},
            {val:"Gonzalez"}
        ],
        fullname: computed(function(){
            return get(this.array[0],"val") +' '+ get(this.array[1],"val")
        })
    })


    t.equal(object.fullname, "Josema Gonzalez")
    set(object.array, 0, {val:"Enzo"})
    set(object.array, 2, null)
    t.equal(object.fullname, "Enzo Gonzalez")

    
    t.equal(collector.mutations.length, 4, "mutations")
    collector.emit()
    t.end()
});





test('Multiple computed same property', function(t) {
    var collector = dop.collect()

    var object = dop.register({
        name: "Josema",
        surname: "Gonzalez",
        fullname: computed(function(){
            return get(this, "name") +' '+ get(this, "surname")
        })
    })



    t.equal(object.fullname, "Josema Gonzalez")
    set(object, 'name', 'Enzo')
    t.equal(object.fullname, "Enzo Gonzalez")
    dop.addComputed(object, 'fullname', function(){
        return (get(this, "name")).toUpperCase()
    })
    set(object, 'name', 'Enza')
    t.equal(object.fullname, "ENZA")
    set(object, 'surname', 'Hernandez')
    t.equal(object.fullname, "Enza Hernandez")
    
    t.equal(collector.mutations.length, 8, "mutations")
    collector.emit()
    t.end()
});





test('Removing computeds', function(t) {
    var collector = dop.collect()
    function computed1(){
        return get(this, "name") +' '+ get(this, "surname")
    }
    function computed2(){
        return (get(this, "name")).toUpperCase()
    }

    var object = dop.register({
        name: "Josema",
        surname: "Gonzalez",
        fullname: computed(computed1)
    })
    dop.addComputed(object, 'fullname', computed2)

    t.equal(object.fullname, "JOSEMA")
    set(object, 'surname', 'Hernandez')
    t.equal(object.fullname, "Josema Hernandez")

    dop.removeComputed(object, 'fullname', computed1)
    set(object, 'name', 'Enzo')
    t.equal(object.fullname, "ENZO")
    dop.removeComputed(object, 'fullname', computed2)
    set(object, 'name', 'Enzolino')
    t.equal(object.fullname, "ENZO")
    


    t.equal(collector.mutations.length, 6, "mutations")
    collector.emit()
    t.end()
});



test('Removing all computeds', function(t) {
    var collector = dop.collect()
    function computed1(){
        return get(this, "name") +' '+ get(this, "surname")
    }
    function computed2(){
        return (get(this, "name")).toUpperCase()
    }

    var object = dop.register({
        name: "Josema",
        surname: "Gonzalez",
        fullname: computed(computed1)
    })
    dop.addComputed(object, 'fullname', computed2)

    t.equal(object.fullname, "JOSEMA")
    set(object, 'surname', 'Hernandez')
    t.equal(object.fullname, "Josema Hernandez")

    dop.removeComputed(object, 'fullname')
    set(object, 'name', 'Enzo')
    t.equal(object.fullname, "Josema Hernandez")


    t.equal(collector.mutations.length, 4, "mutations")
    collector.emit()
    t.end()
});



test('Update computeds', function(t) {
    var collector = dop.collect()
    var object = dop.register({
        todos: [],
        completedCount: computed(function () {
            return get(this,'todos').reduce(
                (sum, todo) => sum + (get(todo,'completed') ? 1 : 0),
                0
            )
        }),
        completedAll: computed(function () {
            return get(this,'todos').length - get(this,'completedCount')
        })
    })

    t.equal(object.completedCount, 0)
    t.equal(object.completedAll, 0)
    
    object.todos.push({completed:false})
    object.todos.push({completed:true})
    object.todos.push({completed:false})

    t.equal(object.completedCount, 1)
    t.equal(object.completedAll, 2)

    set(object.todos[0], 'completed', true)

    t.equal(object.completedCount, 2)
    t.equal(object.completedAll, 1)

    set(object.todos[2], 'completed', true)
    
    t.equal(object.completedCount, 3)
    t.equal(object.completedAll, 0)
    
    // t.equal(collector.mutations.length, 4, "mutations")
    collector.emit()
    t.end()
});
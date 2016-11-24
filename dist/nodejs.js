
//////////  src/dop.js
(function factory(root) {

var dop = {
    version: '0.3.1',
    name: 'dop', // Useful for transport (websockets namespaces)
    create: factory,

    // Where all the internal information is stored
    data: {
        node_inc:0,
        node:{},
        object_inc:1,
        object:{},
        object_data:{},
        collectors:[[],[]],
        lastGet:{}
    },
    
    // src
    util: {},
    core: {},
    protocol: {}
};


// Special properties assigned to user objects
var CONS = {
    socket_token: '~TOKEN_DOP',
    dop: '~dop'
};






//////////  src/env/nodejs/connect.js

dop.connect = function(options) {

    var args = Array.prototype.slice.call(arguments, 0);

    if (dop.util.typeof(args[0]) != 'object')
        options = args[0] = {};

    if (typeof options.transport != 'function')
        options.transport = require('dop-transports').connect.ws;

    return dop.core.connector(args);
};




//////////  src/env/nodejs/emitter.js
dop.util.emitter = require('events').EventEmitter;




//////////  src/env/nodejs/listen.js

dop.listen = function(options) {

    var args = Array.prototype.slice.call(arguments, 0);

    if (dop.util.typeof(args[0]) != 'object')
        options = args[0] = {};

    if (typeof options.transport != 'function')
        options.transport = require('dop-transports').listen.ws;

    if (typeof options.try_connects != 'number' || options.try_connects<0)
        options.try_connects = 99;

    return new dop.core.listener(args);
};




//////////  src/util/get.js

dop.util.get = function(object, path) {

    if (path.length === 0)
        return object;

    for (var index=0, total=path.length; index<total; index++) {

        if (index+1<total && dop.util.isObject(object[ path[index] ]))
            object = object[ path[index] ];

        else if (object.hasOwnProperty(path[index]))
            return object[ path[index] ];

        else
            return undefined;

    }

    return object[ path[index] ];

};





//////////  src/util/invariant.js

dop.util.invariant = function(check) {
    if (!check) {
        var message = dop.util.sprintf.apply(this, Array.prototype.slice.call(arguments, 1));
        throw new Error("[dop] Invariant failed: " + message);
    }
};




//////////  src/util/isObject.js

dop.util.isObject = function(object) {
    return (object!==null && typeof object=='object');
};




//////////  src/util/isObjectRegistrable.js

dop.util.isObjectRegistrable = function(object) {
    var tof = dop.util.typeof(object);
    return (tof === 'object' || tof == 'array');
};

// dop.util.isObjectPlain = function(object) {
//     if (!object)
//         return false;
//     var prototype = Object.getPrototypeOf(object);
//     return (prototype === Object.prototype || prototype === Array.prototype);
// };

// function Test(){}
// console.log(isObjectPlain(null));
// console.log(isObjectPlain({}));
// console.log(isObjectPlain(function(){}));
// console.log(isObjectPlain([]));
// console.log(isObjectPlain(1));
// console.log(isObjectPlain("s"));
// console.log(isObjectPlain(true));
// console.log(isObjectPlain(/a/));
// console.log(isObjectPlain(new Date()));
// console.log(isObjectPlain(Symbol('')));
// console.log(isObjectPlain(new Test));


// dop.util.isObjectPlain = function(object) {
//     var tof = dop.util.typeof(object);
//     return (tof == 'object' || tof == 'array');
// };





//////////  src/util/merge.js

dop.util.merge = function(first, second) {
    var args = arguments;
    if (args.length > 2) {
        // Remove the first 2 arguments of the arguments and add thoose arguments as merged at the begining
        Array.prototype.splice.call(args, 0, 2, dop.util.merge.call(this, first, second));
        // Recursion
        return dop.util.merge.apply(this, args);
    }
    else 
        return dop.util.path(second, this, first, dop.util.mergeMutator);
};

dop.util.mergeMutator = function(destiny, prop, value, typeofValue) {
    if (typeofValue=='object' || typeofValue=='array')
        (!destiny.hasOwnProperty(prop)) ? (destiny[prop] = (typeofValue=='array') ? [] : {}) : destiny[prop];
    else
        destiny[prop] = value;
};




//////////  src/util/path.js

dop.util.path = function (source, callback, destiny, mutator) {
    var hasCallback = typeof callback == 'function',
        hasDestiny = dop.util.isObject(destiny);
    dop.util.pathRecursive(source, callback, destiny, mutator, [], [], hasCallback, hasDestiny);
    return destiny;
};

dop.util.pathRecursive = function (source, callback, destiny, mutator, circular, path, hasCallback, hasDestiny) {

    var prop, value, typeofValue, skip;

    for (prop in source) {

        skip = false;
        value = source[prop];
        path.push(prop);

        if (hasCallback)
            skip = callback(source, prop, value, destiny, path, this);

        if (skip !== true) {

            typeofValue = dop.util.typeof(value);

            if (hasDestiny)
                skip = mutator(destiny, prop, value, typeofValue, path);

            // Objects or arrays
            if ((typeofValue=='object' || typeofValue=='array') && skip !== true && value!==source && circular.indexOf(value)==-1) {
                circular.push(value);
                dop.util.pathRecursive(value, callback, hasDestiny?destiny[prop]:undefined, mutator, circular, path, hasCallback, hasDestiny);
            }

            path.pop();
        }
    }
};




//////////  src/util/set.js

// dop.util.set = function(object, path, value) {

//     if (path.length == 0)
//         return object;

//     path = path.slice(0);
//     var obj = object, objdeep, index=0, total=path.length-1;

//     for (;index<total; ++index) {
//         objdeep = obj[path[index]];
//         obj = (objdeep && typeof objdeep == 'object') ?
//             objdeep
//         :
//             obj[path[index]] = {};
//     }

//     obj[path[index]] = value;

//     return object;
// };

// /*
// ori = {test:{hs:124}}
// console.log( dop.util.set(ori, ['test','more'], undefined))
// */







//////////  src/util/sprintf.js

dop.util.sprintf = function() {

    var s = -1, result, str=arguments[0], array = Array.prototype.slice.call(arguments, 1);
    return str.replace(/"/g, "'").replace(/%([0-9]+)|%s/g , function() {

        result = array[ 
            (arguments[1] === undefined || arguments[1] === '') ? ++s : arguments[1]
        ];

        if (result === undefined)
            result = arguments[0];

        return result;

    });

};
// Usage: sprintf('Code error %s for %s', 25, 'Hi') -> "Code error 25 for Hi"
// Usage2: sprintf('Code error %1 for %0', 25, 'Hi') -> "Code error Hi for 25"




//////////  src/util/typeof.js
// https://jsperf.com/typeof-with-more-types
// dop={util:{}}
dop.util.typeof = function(value) {
    var s = typeof value;
    if (s == 'object') {
        if (value) {
            if (Array.isArray(value))
                s = 'array';
            else if (value instanceof Date)
                s = 'date';
            else if (value instanceof RegExp)
                s = 'regexp';
        }
        else
            s = 'null';
    }
    return s;
};



// dop.util.typeof2 = (function() {
    
//     var list = {

//         '[object Null]': 'null',
//         '[object Undefined]': 'undefined',
//         '[object Object]': 'object',
//         '[object Function]': 'function',
//         '[object Array]': 'array',
//         '[object Number]': 'number',
//         '[object String]': 'string',
//         '[object Boolean]': 'boolean',
//         '[object Symbol]': 'symbol',
//         '[object RegExp]': 'regexp',
//         '[object Date]': 'date'
//     };


//     return function(type) {

//         return list[ Object.prototype.toString.call(type) ];

//     };


// })();

// Typeof=dop.util.typeof;
// console.log(Typeof(null));
// console.log(Typeof(undefined));
// console.log(Typeof({}));
// console.log(Typeof(function(){}));
// console.log(Typeof([]));
// console.log(Typeof(1));
// console.log(Typeof("s"));
// console.log(Typeof(true));
// console.log(Typeof(/a/));
// console.log(Typeof(new Date()));
// console.log(Typeof(Symbol('')));
// console.log(Typeof(new Typeof));


// Typeof(null);
// Typeof(undefined);
// Typeof({});
// Typeof(function(){});
// Typeof([]);
// Typeof(1);
// Typeof("s");
// Typeof(true);
// Typeof(/a/);
// Typeof(new Date());
// Typeof(Symbol(''));
// Typeof(new Typeof);






//////////  src/util/uuid.js

dop.util.uuid = function () {

    for (var i=0, uuid='', random; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20)
            uuid += '-';
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
};




//////////  src/api/collect.js

dop.collect = function(filter) {
    dop.util.invariant(arguments.length===0 || (arguments.length>0 && typeof filter=='function'), 'dop.collect only accept one argument as function');
    return dop.core.createCollector(dop.data.collectors[0], dop.data.collectors[0].length, filter);
};


// setTimeout(function() {
// console.clear();

// obj=dop.register({mola:123,array:[1,2,{obj:'lol'},4,5,6,7,8],old:"old"})
// arr=obj.array;
// str=dop.encode(obj);

// dop.observe(obj.array, console.log);
// console.log(obj.array.slice(0), obj.array.length);

// collector = dop.collect();
// obj.new='yeah';
// delete obj.old;
// obj.array.shift();
// obj.array.splice(2,{last:9},'coca','cola');
// obj.array.reverse();
// obj.array.push(dop.register({registered:true}));
// obj.array[7].obj='LOOOOOL!'
// collector.emit();

// unaction = collector.getUnaction();
// // console.log(obj.array.slice(0), obj, unaction[3], collector.mutations.length);
// console.log(obj.array.slice(0), obj.array.length, arr===obj.array);
// dop.setAction(unaction);
// console.log(str);
// console.log(dop.encode(obj), str===dop.encode(obj));
// console.log(obj.array.slice(0), obj.array.length, arr===obj.array);

// },1000)




//////////  src/api/collectFirst.js

dop.collectFirst = function(filter) {
    dop.util.invariant(arguments.length===0 || (arguments.length>0 && typeof filter=='function'), 'dop.collectFirst only accept one argument as function');
    return dop.core.createCollector(dop.data.collectors[0], 0, filter);
};




//////////  src/api/decode.js

dop.decode = function(data) {
    var undefineds = [],
        index = 0,
        total,
        output = JSON.parse(data, function(property, value) {
            return dop.core.decode.call(this, property, value, undefineds);
        });

    for (total=undefineds.length; index<total; ++index)
        undefineds[index][0][undefineds[index][1]] = undefined;

    return output;
};




//////////  src/api/del.js

dop.del = function(object, property) {
    // dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.del must be a registered object');
    return (dop.isRegistered(object)) ?
        dop.core.delete(object, property) !== undefined
    :
        delete object[property];
};




//////////  src/api/emit.js

dop.emit = function(mutations, action) {
    if (mutations.length>0) {
        // This is true if we have nodes subscribed to those object/mutations
        if (dop.core.emitObservers(mutations)) {
            if (action === undefined)
                action = dop.getAction(mutations);
            dop.core.emitNodes(action);
        }
    }
};




//////////  src/api/encode.js

dop.encode = function(data) {
    return JSON.stringify(data, dop.core.encode);
};




//////////  src/api/getAction.js

dop.getAction = function(mutations) {

    var action = {},
        index = 0,
        total = mutations.length;

    for (;index<total; ++index)
        if (dop.core.objectIsStillStoredOnPath(mutations[index].object)) // Only need it for arrays but is faster than injectMutation directly
            dop.util.injectMutationInAction(action, mutations[index]);

    return action;
};

dop.core.objectIsStillStoredOnPath = function(object) {

    var path = dop.getObjectDop(object),
        index = path.length-1,
        parent;

    for (;index>0; --index) {
        parent = (index>1) ? dop.getObjectDop(object)._ : dop.data.object[path[0]];
        if (parent[path[index]] !== object)
            return false;
        object = dop.getObjectProxy(parent);
    }

    return true;
};




//////////  src/api/getNodeBySocket.js

dop.getNodeBySocket = function(socket) {
    return dop.data.node[ socket[CONS.socket_token] ];
};




//////////  src/api/getObject.js

dop.getObjectDop = function(object) {
    return object[CONS.dop];
};

dop.getObjectId = function(object) {
    return dop.getObjectDop(object)[0];
};

dop.getObjectProperty = function(object) {
    var object_dop = dop.getObjectDop(object);
    return object_dop[object_dop.length-1];
};

dop.getObjectProxy = function(object) {
    return dop.getObjectDop(object).p;
};

dop.getObjectRoot = function(object) {
    return dop.data.object[dop.getObjectId(object)];
};

dop.getObjectRootById = function(object_id) {
    return dop.data.object[object_id];
};

dop.getObjectTarget = function(object) {
    return dop.getObjectDop(object).t;
};

dop.isRegistered = function (object) {
    return (dop.util.isObject(object) && dop.getObjectDop(object) !== undefined);
};




//////////  src/api/getUnaction.js

dop.getUnaction = function(mutations) {

    var unaction = {},
        index = mutations.length-1,
        mutation;

    for (;index>-1; --index)
        dop.util.injectMutationInAction(unaction, mutations[index], true);

    return unaction;
};




//////////  src/api/observe.js

dop.observe = function(object, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.observe needs a registered object as first parameter');
    dop.util.invariant(typeof callback == 'function', 'dop.observe needs a callback as second parameter');

    if (dop.getObjectDop(object).o.indexOf(callback) == -1) {
        dop.getObjectDop(object).o.push(callback);

        return function defered() {
            return dop.unobserve(object, callback);
        }
    }

};




//////////  src/api/observeProperty.js

dop.observeProperty = function(object, property, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.observeProperty needs a registered object as first parameter');
    dop.util.invariant(typeof callback == 'function', 'dop.observeProperty needs a callback as third parameter');

    if (dop.util.typeof(dop.getObjectDop(object).op) != 'object')
        dop.getObjectDop(object).op = {};

    var observers = (dop.util.typeof(dop.getObjectDop(object).op[property]) != 'array') ?
        (dop.getObjectDop(object).op[property] = [])
    :
        dop.getObjectDop(object).op[property];


    if (observers.indexOf(callback) == -1) {
        observers.push(callback);
        return function defered() {
            return dop.unobserveProperty(object, property, callback);
        }
    }
};




//////////  src/api/onsubscribe.js

dop.onsubscribe = function(callback) {
    dop.util.invariant(typeof callback == 'function', 'dop.onsubscribe only accept a function as parameter');
    dop.data.onsubscribe = callback;
};




//////////  src/api/register.js

dop.register = function(object, options) {

    dop.util.invariant(dop.util.isObjectRegistrable(object), 'dop.register needs a regular object as first parameter');

    if (dop.isRegistered(object))
        return dop.getObjectProxy(object);    

    var object_id = dop.data.object_inc++;
    // options = dop.util.merge({proxy:true}, options);
    object = dop.core.configureObject(object, [object_id]);
    dop.data.object[object_id] = object;
    dop.data.object_data[object_id] = {
        node: {},
        nodes: 0,
        options: options
    };

    return object;

};





//////////  src/api/set.js

dop.set = function(object, property, value) {
    // dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.set must be a registered object');
    (dop.isRegistered(object)) ?
        dop.core.set(object, property, value)
    :
        object[property] = value;
    return value;
};




//////////  src/api/setAction.js

dop.setAction = function(action) {
    var collector = dop.collectFirst();
    dop.util.path(action, null, dop.data.object, dop.core.setAction);
    return collector;
};


dop.core.setAction = function(destiny, prop, value, typeofValue, path) {

    // if (path.length > 1) {

        var typeofDestiny = dop.util.typeof(destiny[prop]);

        // Array mutations
        if (typeofValue=='object' && value.hasOwnProperty(CONS.dop)) {

            var mutations = value[CONS.dop],
                mutation,
                index=0,
                total=mutations.length;

            if (typeofDestiny!='array')
                dop.set(destiny, prop, []);

            for (;index<total; ++index) {
                mutation = mutations[index];
                // swaps
                if (mutation[0]<0 || mutation[1]<0) {
                    mutation = mutation.slice(0);
                    (mutation[0]<0) ? mutation[0] = mutation[0]*-1 : mutation[1] = mutation[1]*-1;
                    dop.core.swap(destiny[prop], mutation);
                }
                // set
                else {
                    if (destiny[prop].length<mutation[0])
                        dop.getObjectTarget(destiny[prop]).length = mutation[0];
                    // set
                    if (mutation.length===3 && mutation[1]===1) {
                        (mutation[2] === undefined) ?
                           dop.del(destiny[prop], mutation[0])
                        :
                            dop.set(destiny[prop], mutation[0], mutation[2]);
                    }
                    // splice
                    else
                        dop.core.splice(destiny[prop], mutation);
                }
            }

            if (typeof value.length == 'number' && value.length>-1)
                destiny[prop].length = value.length;


            return true; // Skiping to dont go inside of {~dop:...}
        }

        else {

            // Deeply
            if (typeofValue=='object' && !destiny.hasOwnProperty(prop))
                dop.set(destiny, prop, {});

            // Delete
            else if (typeofValue=='undefined')
                dop.del(destiny, prop);

            // Set array and skip path deep
            else if (typeofValue=='array') {
                dop.set(destiny, prop, dop.util.merge([], value));
                return true;
            }

            // Set array and skip path deep
            else if (typeofValue=='object' && typeofDestiny!='object' && typeofDestiny!='array') {
                dop.set(destiny, prop, dop.util.merge({}, value));
                return true;
            }

            // Set value
            else if (typeofValue!='object')
                dop.set(destiny, prop, value);

        }
    // }
};
// dop.core.setActionLoop = function() {
//     if (prop === CONS.dop)
//         return true;
// };







//////////  src/api/unobserve.js

dop.unobserve = function(object, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.unobserve needs a registered object as first parameter');
    dop.util.invariant(typeof callback == 'function', 'dop.unobserve needs a callback as second parameter');

    var observers = dop.getObjectDop(object).o, indexOf;
    if (dop.util.typeof(observers) != 'array')
        return false;

    indexOf = observers.indexOf(callback);

    if (indexOf == -1)
        return false;
    else
        observers.splice(indexOf, 1);

    if (observers.length == 0)
        delete dop.getObjectDop(object).o;

    return true;
};




//////////  src/api/unobserveProperty.js

dop.unobserveProperty = function(object, property, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.unobserveProperty needs a registered object as first parameter');
    dop.util.invariant(typeof callback == 'function', 'dop.unobserveProperty needs a callback as second parameter');

    var observers = dop.getObjectDop(object).op, indexOf;
    if (dop.util.typeof(observers) != 'object' || dop.util.typeof(observers[property]) != 'array')
        return false;

    observers = observers[property];
    indexOf = observers.indexOf(callback);

    if (indexOf == -1)
        return false;
    else
        observers.splice(indexOf, 1);

    if (observers.length == 0)
        delete dop.getObjectDop(object).op[property];

    return true;
};







//////////  src/core/constructors/collector.js

dop.core.collector = function(queue, index) {
    this.active = true;
    this.shallWeGenerateAction = true;
    this.shallWeGenerateUnaction = true;
    this.mutations = [];
    this.queue = queue;
    queue.splice(index, 0, this);
};



dop.core.collector.prototype.add = function(mutation) {
    if (this.active && (this.filter===undefined || this.filter(mutation)===true)) {
        this.shallWeGenerateAction = true;
        this.shallWeGenerateUnaction = true;
        this.mutations.push(mutation);
        return true;
    }
    return false;
};


dop.core.collector.prototype.emit = function() {
    var mutations = this.mutations;
    dop.emit(mutations, this.action);
    this.mutations = [];
    return mutations;
};


dop.core.collector.prototype.destroy = function() {
    this.active = false;
    this.queue.splice(this.queue.indexOf(this), 1);
};


dop.core.collector.prototype.emitAndDestroy = function() {
    this.destroy();
    return this.emit();
};


dop.core.collector.prototype.getAction = function() {
    if (this.shallWeGenerateAction) {
        this.shallWeGenerateAction = false;
        this.action = dop.getAction(this.mutations);
    }
    return this.action;
};


dop.core.collector.prototype.getUnaction = function() {
    if (this.shallWeGenerateUnaction) {
        this.shallWeGenerateUnaction = false;
        this.unaction = dop.getUnaction(this.mutations);
    }
    return this.unaction;
};





//////////  src/core/constructors/listener.js

dop.core.listener = function(args) {
    // Inherit emitter
    dop.util.emitter.call(this); //https://jsperf.com/inheritance-call-vs-object-assign
    args.unshift(dop, this);
    this.options = args[2];
    this.transport = this.options.transport.apply(this, args);
};
// Inherit emitter
dop.util.merge(dop.core.listener.prototype, dop.util.emitter.prototype);





//////////  src/core/constructors/node.js

dop.core.node = function() {
    // Inherit emitter
    dop.util.emitter.call(this); //https://jsperf.com/inheritance-call-vs-object-assign
    this.object_owned = {};
    this.object_subscribed = {};
    this.request_inc = 1;
    this.requests = {};
    this.requests_queue = [];
};
// Inherit emitter
dop.util.merge(dop.core.node.prototype, dop.util.emitter.prototype);



dop.core.node.prototype.send = function(message) {
    return this.socket.send(message);
};


dop.core.node.prototype.subscribe = function() {
    return dop.protocol.subscribe(node, arguments);
};


dop.core.node.prototype.close = function() {
    return this.socket.close();
};


dop.protocol.subscribe = function(node, args) {
    args = Array.prototype.slice.call(args, 0);
    args.unshift(node, dop.protocol.instructions.subscribe);
    var request = dop.core.createRequest.apply(node, args);
    dop.core.storeRequest(node, request);
    dop.core.emitRequests(node);
    return request.promise;
};




//////////  src/core/error.js

dop.core.error = {

    warning: {
        TOKEN_REJECTED: 'User disconnected because is rejecting too many times the token assigned'
    },

    reject: {
        // OBJECT_NAME_NOT_FOUND: 1,
        // 1: 'Object "%s" not found to be subscribed',
        // OBJECT_ALREADY_SUBSCRIBED: 2,
        // 2: 'The object "%s" is already subscribed',
    }

};





//////////  src/core/mutators/delete.js

dop.core.delete = function(object, property) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property);
    if (descriptor && descriptor.configurable) {
        
        var objectTarget = dop.getObjectTarget(object),
            objectProxy = dop.getObjectProxy(object);

        if (objectTarget===objectProxy || object===objectProxy) {
            var mutation = {
                object:dop.getObjectProxy(objectTarget),
                name:property,
                oldValue:objectTarget[property]
            };
            dop.core.storeMutation(mutation);
        }

        return delete objectTarget[property];
    }
};




//////////  src/core/mutators/pop.js

dop.core.pop = function(array) {
    if (array.length === 0)
        return undefined;
    var spliced = dop.core.splice(array, [array.length-1, 1]);
    return spliced[0];
};




//////////  src/core/mutators/push.js
// https://jsperf.com/push-against-splice OR https://jsperf.com/push-vs-splice
dop.core.push = function(array, items) {
    if (items.length === 0)
        return array.length;
    items.unshift(array.length, 0);
    var spliced = dop.core.splice(array, items);
    return array.length;
};




//////////  src/core/mutators/reverse.js
// https://jsperf.com/array-reverse-algorithm
dop.core.reverse = function(array) {
    var objectTarget = dop.getObjectTarget(array),
        objectProxy = dop.getObjectProxy(array),
        total = objectTarget.length/2,
        index = 0,
        indexr,
        swaps = [],
        shallWeStore = (objectTarget===objectProxy || array===objectProxy);

    for (;index<total; ++index) {
        indexr = objectTarget.length-index-1;
        if (index !== indexr) {
            tempItem = objectTarget[indexr];
            objectTarget[indexr] = objectTarget[index];
            objectTarget[index] = tempItem;
            if (shallWeStore)
                swaps.push(index, indexr);

            // Updating path
            dop.core.updatePathArray(objectTarget, index);
            dop.core.updatePathArray(objectTarget, indexr);
        }
    }

    if (shallWeStore && swaps.length>0)
        dop.core.storeMutation({
            object:objectProxy,
            swaps:swaps
        });

    return array;
};













// dop.core.swap = function() {
//     var items = Array.prototype.slice.call(arguments, 0),
//         array = this,
//         objectTarget = dop.getObjectTarget(array),
//         objectProxy = dop.getObjectProxy(array),
//         swaps = [],
//         shallWeStore = (objectTarget===objectProxy || array===objectProxy),
//         index=0, length=items.length, one, two, tempItem;

//     for (;index<length; index+=2) {
//         one = Number(items[index]);
//         two = Number(items[index+1]);
//         if (!isNaN(two) && one!==two) {
//             // if (objectTarget===objectProxy || array===objectProxy) {}
//             tempItem = objectTarget[two];
//             objectTarget[two] = objectTarget[one];
//             objectTarget[one] = tempItem;
//             swaps.push(one,two);
//         }
//     }

//     if (shallWeStore && swaps.length>0)
//         dop.core.storeMutation({
//             object:objectProxy,
//             swaps:swaps
//         });

//     return swaps;
// };


// var arr = ['Hola', 'Mundo', 'Cruel', 'Te', 'Odio', 'Mucho'];
// swap.call(arr, 2,1,3,'5','1','0');
// console.log( arr );

// swap.call(arr, '0','1','5',3,1,2);
// console.log( arr );





//////////  src/core/mutators/set.js

dop.core.set = function(object, property, value) {

    if (object[property] !== value) {

        var descriptor = Object.getOwnPropertyDescriptor(object, property);

        if (!descriptor || (descriptor && descriptor.writable)) {
            var objectTarget = dop.getObjectTarget(object),
                objectProxy = dop.getObjectProxy(object),
                oldValue = objectTarget[property],
                length = objectTarget.length,
                hasOwnProperty = objectTarget.hasOwnProperty(property);

            // Setting
            objectTarget[property] = value;
            if (dop.util.isObjectRegistrable(value)) {
                // var object_dop = dop.getObjectDop(value);
                // if (dop.isRegistered(value) && Array.isArray(object_dop._) && object_dop._ === objectTarget)
                //     object_dop[object_dop.length-1] = property;
                // else {
                    // var shallWeProxy = dop.data.object_data[dop.getObjectId(objectTarget)].options.proxy;
                    objectTarget[property] = dop.core.configureObject(value, dop.getObjectDop(objectTarget).concat(property), objectTarget);
                // }
            }

            if (objectTarget===objectProxy || object===objectProxy) {
                var mutation = {object:objectProxy, name:property, value:value};
                if (hasOwnProperty)
                    mutation.oldValue = oldValue;
                if (Array.isArray(objectTarget)) // if is array we must store the length in order to revert it with setUnaction
                    mutation.length = length;
                if (Array.isArray(value)) // We cant store the original array cuz when we inject the mutation into the action object could be different from the original
                    mutation.valueOriginal = dop.util.merge([], value);

                dop.core.storeMutation(mutation);

                return mutation;
            }
        }
    }
};




//////////  src/core/mutators/shift.js

dop.core.shift = function(array) {
    if (array.length === 0)
        return undefined;
    var spliced = dop.core.splice(array, [0, 1]);
    return spliced[0];
};




//////////  src/core/mutators/sort.js
// http://stackoverflow.com/a/234777/1469219 http://stackoverflow.com/a/38905402/1469219
// https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
// http://khan4019.github.io/front-end-Interview-Questions/sort.html#bubbleSort
// https://github.com/benoitvallon/computer-science-in-javascript/tree/master/sorting-algorithms-in-javascript
dop.core.sort = function(array, compareFunction) {
    var objectTarget = dop.getObjectTarget(array),
        objectProxy = dop.getObjectProxy(array),
        copy = objectTarget.slice(0),
        output, swaps;

    output = Array.prototype.sort.call(objectTarget, compareFunction);
    swaps = dop.core.sortDiff(objectTarget, copy);
    if (swaps.length>1 && (objectTarget===objectProxy || array===objectProxy))
        dop.core.storeMutation({
            object:objectProxy,
            swaps:swaps
        });
    return output;
};


dop.core.sortDiff = function (array, copy) {

    var total = copy.length,
        swaps = [],
        index1 = 0,
        index2, tmp;

    for (;index1<total; ++index1) {
        if (array[index1] !== copy[index1]) {
            index2 = copy.indexOf(array[index1]);
            tmp = copy[index1];
            copy[index1] = copy[index2];
            copy[index2] = tmp;
            swaps.push(index1, index2);
            // Updating path
            dop.core.updatePathArray(copy, index1);
            dop.core.updatePathArray(copy, index2);
        }
    }

    return swaps;
}




// function diffArray(array) {
//     var copy = array.slice(0),
//         swaps = [],
//         index = 0,
//         total = copy.length,
//         indexNew, tmp;

//     array.sort();

//     for (;index<total; ++index) {
//         if (copy[index] !== array[index]) {
//             indexNew = copy.indexOf(array[index]);
//             tmp = copy[index];
//             copy[index] = copy[indexNew];
//             copy[indexNew] = tmp;
//             swaps.push([index, indexNew]);
            
//             console.log([index, indexNew], copy );
//             if (indexNew < index) {
//                 console.log( 'lol' );
//             }
            
//             // swapeds[indexNew] = true;
//             // if (indexCache!==indexNew && indexCache !== index) {
//             //     swapeds[indexCache] = true;
//             //     swap(copy, indexNew, indexCache);
//             //     swaps.push([indexNew, indexCache]);
//             //     console.log([indexNew, indexCache], copy, swapeds );
//             // }
//         }
//     }

//     return swaps;
// }




//////////  src/core/mutators/splice.js

dop.core.splice = function(array, args) {

    var originallength = array.length,
        objectTarget = dop.getObjectTarget(array),
        objectProxy = dop.getObjectProxy(array),
        spliced;



    // Splicing!!
    spliced = Array.prototype.splice.apply(objectTarget, args);

    // If enviroment do not allow proxies (objectTarget and objectProxy are same object in that case) 
    // or if the array is the proxy itself
    if (objectTarget===objectProxy || array===objectProxy) {

        var argslength = args.length,
            length = objectTarget.length,
            start = Number(args[0]),
            deleteCount = (Number(args[1])>0) ? args[1] : 0,
            itemslength = (args.length>2) ? (args.length-2) : 0,
            end, item, object_dop;


        // Defaults for start
        if (isNaN(start))
            start = 0;
        else if (start<0)
            start = (length+start < 0) ? 0 : length+start;
        else if (start>originallength)
            start = originallength;


        // We dont need update becase no items remaining after splice
        end = (argslength===1) ? 0 :
            // If deleteCount is the same of items to add means the new lengh is the same and we only need to update the new elements
            (argslength>2 && deleteCount===itemslength) ?
                start+deleteCount
            :
                objectTarget.length;



        for (;start<end; ++start) {
            item = objectTarget[start];
            if (dop.util.isObjectRegistrable(item)) {

                object_dop = dop.getObjectDop(item);

                if (object_dop!==undefined && object_dop._ === objectTarget)
                    object_dop[object_dop.length-1] = start;

                else
                    objectTarget[start] = dop.core.configureObject(
                        item,
                        dop.getObjectDop(objectTarget).concat(start),
                        // dop.data.object_data[dop.getObjectId(objectTarget)].options.proxy,
                        objectTarget
                    );
            }
        }


        if (originallength!==length || itemslength>0) {
            if (args[0]<0)
                args[0] = array.length+args[0];
            var mutation = {
                object:objectProxy,
                splice:args
            };
            if (spliced.length > 0)
                mutation.spliced = spliced;
            dop.core.storeMutation(mutation);
        }

    }

    return spliced;
};





//////////  src/core/mutators/swap.js

dop.core.swap = function(array, swaps) {

    if (swaps.length>1) {

        var objectTarget = dop.getObjectTarget(array),
            objectProxy = dop.getObjectProxy(array),
            index = 0,
            total = swaps.length-1,
            tempItem, swapA, swapB;

        for (;index<total; index+=2) {
            swapA = swaps[index];
            swapB = swaps[index+1];
            tempItem = objectTarget[swapA];
            objectTarget[swapA] = objectTarget[swapB];
            objectTarget[swapB] = tempItem;
            // Updating path
            dop.core.updatePathArray(objectTarget, swapA);
            dop.core.updatePathArray(objectTarget, swapB);
        }


        if (objectTarget===objectProxy || array===objectProxy)
            dop.core.storeMutation({
                object:objectProxy,
                swaps:swaps
            });

        return array;
    }

};




//////////  src/core/mutators/unshift.js

dop.core.unshift = function(array, items) {
    if (items.length === 0)
        return array.length;
    items.unshift(0, 0);
    var spliced = dop.core.splice(array, items);
    return array.length;
};





//////////  src/core/objects/configureObject.js

var canWeProxy = typeof Proxy == 'function';
dop.core.configureObject = function(object, path, parent) {

    // Creating a copy if is another object registered
    if (dop.isRegistered(object))
        return dop.core.configureObject(
            dop.util.merge( Array.isArray(object)?[]:{}, object),
            path,
            parent
        );

    // Recursion
    var property, value, object_dop;
    for (property in object) {
        value = object[property];
        if (dop.util.isObjectRegistrable(value))
            object[property] = dop.core.configureObject(value, path.concat(property), object);
    }

    // Setting ~dop object
    Object.defineProperty(object, CONS.dop, {value:path.slice(0)});
    object_dop = dop.getObjectDop(object);
    object_dop.m = []; // mutations
    object_dop.o = []; // observers
    object_dop.op = {}; // observers by property


    if (dop.util.isObject(parent))
        object_dop._ = (dop.isRegistered(parent)) ? dop.getObjectTarget(parent) : parent;


    // Making proxy object
    if (canWeProxy) {
        var target = object;
        object = new Proxy(object, dop.core.proxyObjectHandler);
        // Adding proxy and target alias
        object_dop.p = object;
        object_dop.t = target;
    }
    else
        object_dop.p = object_dop.t = object;


    // Adding traps for mutations methods of arrays
    if (dop.util.typeof(object) == 'array')
        Object.defineProperties(object, dop.core.proxyArrayHandler);


    return object;
};




//////////  src/core/objects/createAsync.js

dop.core.createAsync = function(node, request_id) {
    var resolve, reject,
    promise = new Promise(function(res, rej) {
        resolve = res;
        reject = rej;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};



// mypromise = dop.createAsync();
// mypromise.then(function(v) {
//     console.log('yeah',v)
// });
// setTimeout(function() {
//     mypromise.resolve(1234567890)
// },1000);


// dop.core.createAsync = function() {
//     var observable = Rx.Observable.create(function(observer) {
//         observable.resolve = function(value) {
//             observer.onNext(value);
//             observer.onCompleted();
//         };
//         observable.reject = observer.onError;
//     });
//     return observable;
//     // return {stream:observable,resolve:observer.onNext,reject:observer.onError,cancel:cancel};
// };
// mypromise = dop.createAsync();
// mypromise.subscribe(function(v) {
//     console.log('yeah',v);
// });
// setTimeout(function() {
//     mypromise.resolve(1234567890);
// },1000);




// https://github.com/ReactiveX/rxjs/issues/556
// function getData(num) {
//   return new Promise((resolve, reject) => {
//     resolve(num + 1);
//   });
// }

// async function create() {
//   var list = await Rx.Observable.range(1, 5)
//     .flatMap(num => getData(num))
//     .toArray().toPromise();

//   return list;
// }

// console.clear();

// Rx.Observable.fromPromise(create()).subscribe(list => {
//   console.log(list);
// }, err => {
//   console.log(err);
// });





//////////  src/core/objects/createCollector.js

dop.core.createCollector = function(queue, index, filter) {
    var collector = new dop.core.collector(queue, index);
    collector.filter = filter;
    return collector;
};




//////////  src/core/objects/emitObservers.js

dop.core.emitObservers = function(mutations) {

    var mutation,
        subobjects = [],
        subobject,
        index = 0,
        index2,
        total = mutations.length,
        total2,
        object_dop,
        observersProperties,
        observers,
        mutationsWithSubscribers = false;

    for (;index<total; ++index) {
        mutation = mutations[index];
        subobject = mutation.object;
        object_dop = dop.getObjectDop(subobject);

        if (!mutationsWithSubscribers && dop.data.object_data[object_dop[0]].nodes > 0)
            mutationsWithSubscribers = true;

        // Emiting mutations to observerProperties
        observersProperties = object_dop.op[mutation.name];
        if (dop.util.typeof(observersProperties) == 'array' &&  observersProperties.length>0)
            for (index2=0,total2=observersProperties.length; index2<total2; ++index2)
                observersProperties[index2](mutation);

        if (subobjects.indexOf(subobject) === -1) {
            subobjects.push(subobject);

            // Emiting mutations to observers
            observers = object_dop.o;
            for (index2 = 0, total2 = observers.length;index2<total2; ++index2)
                observers[index2](object_dop.m.slice(0));

            object_dop.m = [];
        }
    }

    return mutationsWithSubscribers;
};




//////////  src/core/objects/injectMutationInAction.js

dop.util.injectMutationInAction = function(action, mutation, isUnaction) {

    var isMutationArray = mutation.splice!==undefined || mutation.swaps!==undefined,
        path = dop.getObjectDop(mutation.object).slice(0),
        object_data = dop.data.object,
        prop = mutation.name,
        value = (isUnaction) ? mutation.oldValue : mutation.value,
        typeofValue = dop.util.typeof(value),
        index = 0,
        isArray = Array.isArray,
        parent;


    if (!isMutationArray)
        path.push(prop);

    for (;index<path.length-1; ++index) {
        parent = action;
        prop = path[index];
        if (object_data!==undefined)
            object_data = object_data[prop];
        action = dop.util.isObject(action[prop]) ? action[prop] : action[prop]={};
    }

    prop = path[index];

    if (isMutationArray || isArray(object_data)) {

        if (isMutationArray && !dop.util.isObject(action[prop])) 
            action[prop] = {};

        if (isMutationArray)
            action = action[prop];

        if (!dop.util.isObject(action[CONS.dop]))
            action[CONS.dop] = [];
            
        var mutations = action[CONS.dop];

        // swap
        if (mutation.swaps!==undefined) {
            var swaps = mutation.swaps.slice(0);
            if (isUnaction)
                swaps.reverse();
            var tochange = (swaps[0]>0) ? 0 : 1;
            swaps[tochange] = swaps[tochange]*-1;
            mutations.push(swaps);
        }

        // splice
        else if (mutation.splice!==undefined) {
            var splice;
            if (isUnaction) {
                splice = (mutation.spliced) ? mutation.spliced.slice(0) : [];
                splice.unshift(mutation.splice[0], mutation.splice.length-2);
            }
            else
                splice = mutation.splice.slice(0);
                
            mutations.push(splice);
        }

        // set
        else
            mutations.push([prop, 1, value]);

        if (isUnaction && mutation.length!==undefined && mutation.length!==object_data.length)
            action.length = mutation.length;
    }

    // set
    else
        action[prop] = (typeofValue=='object' || typeofValue=='array') ? dop.util.merge(typeofValue=='array'?[]:{},value) : value;
};




//////////  src/core/objects/localProcedureCall.js

dop.core.localProcedureCall = function(f, args, resolve, reject, compose) {
    var req = dop.core.createAsync(), output;
    if (typeof compose == 'function')
        req = compose(req);

    args.push(req);
    req.then(resolve).catch(reject);
    output = f.apply(req, args);

    // Is sync
    if (output !== req)
        req.resolve(output);
};




//////////  src/core/objects/proxyArrayHandler.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Mutator_methods
dop.core.proxyArrayHandler = {
    splice: {value:function() {
        return dop.core.splice(this, Array.prototype.slice.call(arguments,0));
    }},
    shift: {value: function() {
        return dop.core.shift(this, Array.prototype.slice.call(arguments,0));
    }},
    pop: {value:function() {
        return dop.core.pop(this, Array.prototype.slice.call(arguments,0));
    }},
    push: {value:function() {
        return dop.core.push(this, Array.prototype.slice.call(arguments,0));
    }},
    unshift: {value:function() {
        return dop.core.unshift(this, Array.prototype.slice.call(arguments,0));
    }},
    reverse: {value:function() {
        return dop.core.reverse(this);
    }},
    sort: {value:function(compareFunction) {
        return dop.core.sort(this, compareFunction);
    }},
    /*fill: {value:function() {
        return dop.core.fill.apply(this, arguments);
    }},
    copyWithin: {value:function() {
        return dop.core.copyWithin.apply(this, arguments);
    }},*/
};




//////////  src/core/objects/proxyObjectHandler.js

dop.core.proxyObjectHandler = {
    set: function(object, property, value) {
        return dop.core.set(dop.getObjectProxy(object), property, value) !== undefined;
    },
    deleteProperty: function(object, property) {
        return dop.core.delete(dop.getObjectProxy(object), property) !== undefined;
    },
    /*get: function(object, property) {
        dop.data.lastGet.object = object;
        dop.data.lastGet.property = property;
        return object[property];
    }*/
};





//////////  src/core/objects/storeMutation.js

dop.core.storeMutation = function(mutation) {

    var collectors = dop.data.collectors,
        index=0, total=collectors.length, index2=0, total2;

    // Storing mutation on the object
    dop.getObjectDop(mutation.object).m.push(mutation);

    // Running collectors
    for (;index<total; index++)
        if (collectors[index].length > 0)
            for (index2=0,total2=collectors[index].length; index2<total2; index2++)
                if (collectors[index][index2].add(mutation))
                    return;

    return dop.emit([mutation]);        
};




//////////  src/core/objects/updatePathArray.js

dop.core.updatePathArray = function (array, newIndex) {
    var item = array[newIndex];
    if (dop.isRegistered(item)) {

        var object_dop = dop.getObjectDop(item),
            index = object_dop.length-1;

        if (object_dop[index] !== newIndex) {
            object_dop[index] = newIndex;

            // Updating neested objects
            dop.util.path(item, function(source, prop, value) {
                if (dop.util.isObject(value))
                    dop.getObjectDop(value)[index] = newIndex;
            });
        }

    }
    return false;
};





//////////  src/core/protocol/connector.js

dop.core.connector = function(args) {
    var node = new dop.core.node();
    args.unshift(dop, node);
    node.options = args[2];
    node.transport = node.options.transport;
    node.socket = node.options.transport.apply(this, args);
    return node;
};





//////////  src/core/protocol/createRequest.js

dop.core.createRequest = function(node, instruction) {
    var request_id = node.request_inc++,
        request = Array.prototype.slice.call(arguments, 1);
    request.unshift(request_id);
    request.promise = dop.core.createAsync();
    return request;
};




//////////  src/core/protocol/createResponse.js

dop.core.createResponse = function() {
    arguments[0] = arguments[0]*-1;
    return Array.prototype.slice.call(arguments, 0);
};




//////////  src/core/protocol/decode.js
var regexpdate = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/,
    regexpsplit = /\/(.+)\/([gimuy]{0,5})/;

dop.core.decode = function(property, value, undefineds) {

    if (typeof value == 'string') {

        if (value === '~F')
            return dop.core.remoteFunction(this, property);

        if (value == '~U' && dop.util.isObject(undefineds)) {
            undefineds.push([this, property]); // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined
            return undefined;
        }

        if (value === '~I')
            return Infinity;

        if (value === '~i')
            return -Infinity;

        if (value === '~N')
            return NaN;

        if (regexpdate.exec(value))
            return new Date(value);

        if (value.substr(0,2) == '~R') {
            var split = regexpsplit.exec(value.substr(2)); // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
            return new RegExp(split[1], split[2]);
        }

        if (value[0] === '~') // https://jsperf.com/charat-vs-index/5
            return value.substring(1);


    }

    return value;

};






//////////  src/core/protocol/emitNodes.js

dop.core.emitNodes = function(action) {
    var object_id, node_token, node;
    for (object_id in action) {
        if (dop.data.object_data[object_id].nodes > 0) {
            for (node_token in dop.data.object_data[object_id].node) {
                node = dop.data.node[node_token];
                dop.protocol.merge(node, object_id, action[object_id]);
            }
        }
    }
};




//////////  src/core/protocol/emitRequests.js

dop.core.emitRequests = function(node, wrapper) {
    if (typeof wrapper != 'function')
        wrapper = dop.encode;

    var requests=node.requests_queue, index=0, total=requests.length;

    for (;index<total; ++index)
        node.requests[requests[index][0]] = requests[index];

    node.requests_queue = [];
    node.send(wrapper((total>1) ? requests : requests[0]));
};




//////////  src/core/protocol/encode.js

dop.core.encode = function(property, value) {

    var tof = typeof value;

    if (tof == 'function')
        return '~F';

    if (tof == 'undefined') // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined
        return '~U';

    if (value === Infinity)
        return '~I';

    if (value === -Infinity)
        return '~i';
    
    if (tof == 'number' && isNaN(value))
        return '~N';

    if (tof == 'object' && value instanceof RegExp)
        return '~R' + value.toString();

    if (tof == 'string' && value[0] === '~') // https://jsperf.com/charat-vs-index/5
        return '~'+value;

    return value;

};



// // Extending example
// (function() {
//     var encode = dop.core.encode;
//     dop.core.encode = function(property, value) {
//         if (typeof value == 'boolean')
//             return '~BOOL';
//         return encode(property, value);
//     };
// })();






//////////  src/core/protocol/getRejectError.js

dop.core.getRejectError = function(error) {
    if (typeof error == 'number' && dop.core.error.reject[error] !== undefined) {
        var args = Array.prototype.slice.call(arguments, 1);
        args.unshift(dop.core.error.reject[error]);
        return dop.util.sprintf.apply(this, args);
    }
    return error;  
};




//////////  src/core/protocol/onclose.js

dop.core.onclose = function(listener_or_node, socket) {

    var isListener = (listener_or_node.socket !== socket),
        node = (isListener) ? dop.getNodeBySocket(socket) : listener_or_node;

    listener_or_node.emit('close', socket);

    if (dop.util.isObject(node)) {
        listener_or_node.emit('disconnect', node);
        dop.core.unregisterNode(node);
    }

};





//////////  src/core/protocol/onmessage.js

dop.core.onmessage = function(listener_or_node, socket, message_string, message_raw) {

    listener_or_node.emit('message', socket, message_string, message_raw);

    var messages, 
        isListener = (listener_or_node.socket !== socket),
        node = (isListener) ? dop.data.node[ socket[CONS.socket_token] ] || {} : listener_or_node;


    // Parsing messages
    if (typeof message_string == 'string' && message_string.substr(0,1) == '[') {
        try { messages = dop.decode(message_string); } 
        catch(e) { /*console.log(e);*/ }
    }
    else 
        messages = message_string;


    // Managing protocol
    if (dop.util.typeof(messages) == 'array') {

        // Detecting if is multimessage
        if (typeof messages[0] == 'number')
            messages = [messages];

        // Managing all messages one by one
        for (var i=0, t=messages.length, message, requests, request, request_id, response, instruction_type, message_typeof; i<t; i++) {

            message = messages[i];
            request_id = message[0];

            // If is a number we manage the request
            if (typeof request_id == 'number' && request_id !== 0) {

                // If is only one request
                message_typeof = dop.util.typeof(message[1]);
                requests = ((message_typeof=='number' && message_typeof!='array') || request_id<0) ? 
                    [request_id, message.slice(1)]
                :
                    requests = message;


                for (var j=1, t2=requests.length, instruction_function; j<t2; ++j) {
                    
                    request = requests[j];

                    if (dop.util.typeof(request)=='array' && ((typeof request[0]=='number' && request_id>0) || request_id<0)) {
                        
                        instruction_type = request[0];
                        instruction_function = 'on'+dop.protocol.instructions[instruction_type];

                        // REQUEST ===============================================================
                        if (request_id>0 && typeof dop.protocol[instruction_function]=='function')
                            dop.protocol[instruction_function](node, request_id, request);


                        // RESPONSE ===============================================================
                        else {

                            request_id *= -1;

                            if (dop.util.isObject(node.requests[request_id])) {

                                response = request;
                                request = node.requests[request_id];

                                instruction_type = request[1];
                                instruction_function = '_on'+dop.protocol.instructions[instruction_type];

                                if (typeof dop.protocol[instruction_function]=='function')
                                    dop.protocol[instruction_function](node, request_id, request, response);
                                
                                delete node.requests[request_id];

                            }

                        }

                    }
                }

            }

        }

    }






    // var messages, 
    //     user = (socket[CONS.socket_token] === undefined) ?
    //         socket
    //     :
    //         node.users[ socket[CONS.socket_token] ];






    // // Managing OSP protocol
    // if (dop.util.typeof(messages) == 'array')
    //     dop.core.manage.call(this, user, messages);

};




//////////  src/core/protocol/onopen.js

dop.core.onopen = function(listener_or_node, socket, transport) {

    listener_or_node.emit('open', socket);

    // if listener_or_node is listener we send token
    if (listener_or_node.socket !== socket) {
        var node = new dop.core.node();
        node.transport = transport;
        node.socket = socket;
        node.try_connects = listener_or_node.options.try_connects;
        node.listener = listener_or_node;
        dop.protocol.connect(node);
    }
};







//////////  src/core/protocol/registerNode.js

dop.core.registerNode = function(node, token) {
    node.token = token;
    node.socket[CONS.socket_token] = token;
    dop.data.node[token] = node;  
};




//////////  src/core/protocol/registerObjectToNode.js

dop.core.registerObjectToNode = function(node, object) {
    var object_id = dop.getObjectId(object),
        object_data = dop.data.object_data[object_id];

    if (object_data.node[node.token] === undefined) {
        object_data.node[node.token] = true;
        object_data.nodes += 1;
        node.object_subscribed[object_id] = true;
        return true;
    }
    else
        return false;
};




//////////  src/core/protocol/remoteFunction.js

dop.core.remoteFunction = function $DOP_REMOTE_function(object, property) {

    return function $DOP_REMOTE_FUNCTION() {

        // return that.call(path, Array.prototype.slice.call(arguments));
        console.log(dop.getObjectDop(object), property, Array.prototype.slice.call(arguments,0));

    };

    // // http://jsperf.com/dynamic-name-of-functions
    // return new function(
    //     "return function " + dop.core.remoteFunction.name + "() {  return that.call(path, arguments); }"
    //)();

};




//////////  src/core/protocol/storeRequest.js

dop.core.storeRequest = function(node, request) {
    node.requests_queue.push(request);
};




//////////  src/core/protocol/unregisterNode.js

dop.core.unregisterNode = function(node) {
    var object_id, object_data;
    for (object_id in node.object_subscribed) {

        object_data = dop.data.object_data[object_id];

        // Deleting instance inside of dop.data.object_data
        object_data.nodes -= 1;
        delete object_data.node[node.token];
    }

    delete dop.data.node[ node.token ];
};




//////////  src/protocol/_onconnect.js

dop.protocol._onconnect = function(node, request_id, request, response) {

    var token = request[2];

    // Node is connected correctly
    if (response[0]===0) {
        node.listener.emit('connect', node, token);
        node.emit('connect', token);
    }

    // Resending token
    else if (node.try_connects-- > 0) {
        delete dop.data.node[token];
        dop.protocol.connect(node);
    }

    // We disconnect the node because is rejecting too many times the token assigned
    else {
        delete dop.data.node[token];
        node.listener.emit('warning', dop.core.error.warning.TOKEN_REJECTED);
        node.socket.close();
    }

};




//////////  src/protocol/_onsubscribe.js

dop.protocol._onsubscribe = function(node, request_id, request, response) {

    if (response[0] !== undefined) {

        if (response[0] !== 0)
            request.promise.reject(dop.core.getRejectError(response[0], request[2]));

        else {
            var object_path = response[1],
                object_owned_id = object_path[0],
                object_owned = response[2],
                object, object_id;

            if (node.object_owned[object_owned_id] === undefined) {
                object = dop.register(object_owned);
                object_id = dop.getObjectId(object);
                node.object_owned[object_owned_id] = object_id;
            }
            else {
                object_id = node.object_owned[object_owned_id];
                object = dop.getObjectRootById(object_id);
            }

            request.promise.resolve(dop.util.get(object, object_path.slice(1)));
        }
    }

};




//////////  src/protocol/connect.js

dop.protocol.connect = function(node) {
    var token, request;
    do {
        token = dop.util.uuid();
    } while(typeof dop.data.node[token]=='object');

    dop.data.node[token] = node;
    node.token = token;
    node.socket[CONS.socket_token] = token;

    request = dop.core.createRequest(node, dop.protocol.instructions.connect, token);
    dop.core.storeRequest(node, request);
    dop.core.emitRequests(node, JSON.stringify);
};




//////////  src/protocol/instructions.js

dop.protocol.instructions = {


    // [<request_id>, <instruction>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.

    // Is possible send multiple requests in one message, just wrapping it in an Array. But the order of the responses is not in order. Which means the response of request_idTwo could be resolved before request_idOne
    // [[<request_id1>, <instruction>, <params...>], [<request_id2>, <instruction>, <params...>]]

    // Is possible send one request with multiple instructions. The response will be recieved when all the requests are resolved. The response could be only one. But if the response is multiple has to respect the order
    // [<request_id>, [<instruction>, <params...>], [<instruction>, <params...>]]

    // If the response has a 0 as second parameter, means the response it's fulfilled. Any other value is an error
    // [-1234, 0, <params...>]

    // Also the error response could be custom as string
    // [-1234, 'My custom message error']

    // Response with instructions, if the second parameter of the response is an array it means is an instruction that could be (set, delete or merge)
    // [-<request_id>, [<instruction>, <params...>], [<instruction>, <params...>]]

    // Sending the same request without parameters means a cancel/abort of the request
    // [1234]


                        // Server -> Client
    connect: 0,         // [ 1234, 0, <user_token>, <options>]
                        // [-1234, 0]

                        // Client -> Server
    reconnect: 1,       // [ 1234, 1, <new_user_token>, <old_user_token>, <options>]
                        // [-1234, 0]

                        // Subscriptor -> Owner
    subscribe: 2,       // [ 1234, 2, <params...>]
                        // [-1234, 0, [<object_id>], <data_object>, <options>]
                        // [-1234, 0, [<object_id>, 'path']]

                        // Subscriptor -> Owner
    unsubscribe: 3,     // [ 1234, 3, <object_id>]
                        // [-1234, 0]

                        // Subscriptor -> Owner
    call: 4,            // [ 1234, 4, [<object_id>,'path','path'], [<params...>]]
                        // [-1234, 0, <return>]

                        // Subscriptor -> Owner
    update: 5,          // [ 1234, 5, [<object_id>, 'path', 'path'], <options>]
                        // [-1234, 0, [<object_id>, 'path', 'path'], <object_data_to_merge>, <options>]

                        // Owner -> Subscriptor
    merge: 6,           // [ 1234, 6, <object_id>, <object_data_to_merge>, <options>]
                        // [-1234, 0]

};

for (var instruction in dop.protocol.instructions)
    dop.protocol.instructions[ dop.protocol.instructions[instruction] ] = instruction;





//////////  src/protocol/merge.js

dop.protocol.merge = function(node, object_id, action) {
    
    console.log(node.token, object_id, action);
    // node.send(JSON.stringify(
    //     dop.core.createRequest(node, dop.protocol.instructions.connect, token)
    //));

};




//////////  src/protocol/onconnect.js

dop.protocol.onconnect = function(node, request_id, request) {
    
    var token=request[1], response;

    if (dop.data.node[token] === undefined) {
        dop.core.registerNode(node, token);
        response = dop.core.createResponse(request_id, 0);
        node.emit('connect', token);
    }
    else
        response = dop.core.createResponse(request_id, 1);

    node.send(JSON.stringify(response));

};





//////////  src/protocol/onsubscribe.js

dop.protocol.onsubscribe = function(node, request_id, request) {

    if (typeof dop.data.onsubscribe == 'function') {

        var args = Array.prototype.slice.call(request, 1), object, response;

        dop.core.localProcedureCall(dop.data.onsubscribe, args, function resolve(value) {
            if (dop.util.isObject(value)) {
                object = dop.register(value);
                var object_id = dop.getObjectId(object);
                response = dop.core.createResponse(request_id, 0, dop.getObjectDop(object));
                if (dop.core.registerObjectToNode(node, object))
                    response.push(dop.getObjectRootById(object_id));
                node.send(dop.encode(response));
                return object;
            }
            else
                dop.util.invariant(false, 'dop.onsubscribe callback must return or resolve a regular object');


        }, function reject(error) {
            response = dop.core.createResponse(request_id);
            if (error instanceof Error)
                console.log(error.stack);
            else
                response.push(error);
            node.send(JSON.stringify(response));
        }, function(req) {
            req.node = node;
            return req;
        });

    }

};




//////////  src/umd.js
// Factory
if (root === undefined)
    return dop;

// AMD
if (typeof define === 'function' && define.amd)
    define([], function() { return dop });

// Node
else if (typeof module == 'object' && module.exports)
    module.exports = dop;

// Browser (window)
else
    root.dop = dop;

})(this);



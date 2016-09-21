
dop.core.proxyObjectHandler = {
    set: function(object, property, value) {
        dop.set(object, property, value);
        return true;
    }
    // ,
    // get: function(object, property) {
    //     if (object.hasOwnProperty(property)) {
    //         console.log( 'get', object['~dop'].slice(0), property );
    //     }
    //     return object[property];
    // }
};
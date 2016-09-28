
dop.util.path = function ( source, callback, destiny ) {

    var hasCallback = typeof callback == 'function';
     // UNCOMMENT THIS FOR STOP & RE-ASIGN FEATURE
    // if (hasCallback)
        // config = {
            // stop:function(){config.stoped=true},
            // return:function(value){config.returned=value}
        // };
    // UNCOMMENT THIS FOR STOP & RE-ASIGN FEATURE 

    // dop.util.pathRecursive.call(config, [], source, destiny, callback, [], hasCallback, dop.util.isObject(destiny); // UNCOMMENT THIS FOR STOP & REASIGN FEATURE
    dop.util.pathRecursive(
        source, 
        destiny, 
        callback, 
        [], 
        [],
        hasCallback,
        dop.util.isObject(destiny)
    );
    return destiny;
};

dop.util.pathRecursive = function pathRecursive( source, destiny, callback, circular, path, hasCallback, hasDestiny ) {

    var prop, value, value2, isArray;

    for (prop in source) {

        // if ( this.stoped === true ) return;

        value = source[prop];

        if (hasCallback) {
            path.push( prop );
            callback(path.slice(0), source, destiny, this );
            // if ( this.stoped === true ) return; // UNCOMMENT THIS FOR STOP & REASIGN FEATURE
        }

        // Objects or arrays
        if ( value && value !== source && (value.constructor === Object || (isArray=Array.isArray(value))) && circular.indexOf(value)==-1 ) {

            circular.push(value);

            if ( hasDestiny ) {
                value2 = ( !destiny.hasOwnProperty(prop) ) ?
                    (destiny[prop] = (isArray) ? [] : {})
                :
                    destiny[prop];
            }

            pathRecursive(value, value2, callback, circular, path, hasCallback, hasDestiny );

        }
        else if ( hasDestiny ) {
            // destiny[prop] = (hasCallback && this.hasOwnProperty('returned')) ? this.returned : value; // UNCOMMENT THIS FOR STOP & REASIGN FEATURE
            // delete this.returned; // UNCOMMENT THIS FOR STOP & REASIGN FEATURE
            if (value === undefined)
                delete destiny[prop];
            else
                destiny[prop] = value;
        }


        if (hasCallback)
            path.pop();
    }

};

dop.util.path = function ( source, callback, destiny ) {

    var hasCallback = typeof callback == 'function';
     // UNCOMMENT THIS FOR STOP & REASIGN FEATURE
    // if (hasCallback)
        // config = {
            // stop:function(){config.stoped=true},
            // return:function(value){config.returned=value}
        // };
    // UNCOMMENT THIS FOR STOP & REASIGN FEATURE 

    // dop.util.pathRecursive.call(config, [], source, destiny, callback, [], hasCallback, (destiny && typeof destiny=='object')); // UNCOMMENT THIS FOR STOP & REASIGN FEATURE
    dop.util.pathRecursive(
        [], 
        source, 
        destiny, 
        callback, 
        [], 
        hasCallback,
        (destiny && typeof destiny=='object')
    );
    return destiny;
};

dop.util.pathRecursive = function pathRecursive( circular, source, destiny, callback, path, hasCallback, hasDestiny ) {

    var key, value, value2, isArray;

    for (key in source) {

        if ( this.stoped === true ) return;

        value = source[key];

        if (hasCallback) {
            path.push( key );
            callback(path.slice(0), source, destiny, this );
            // if ( this.stoped === true ) return; // UNCOMMENT THIS FOR STOP & REASIGN FEATURE
        }

        // Objects or arrays
        if ( value && value !== source && (value.constructor === Object || (isArray=Array.isArray(value))) && circular.indexOf(value)==-1 ) {

            circular.push(value);

            if ( hasDestiny ) {
                value2 = ( !destiny.hasOwnProperty(key) ) ?
                    (destiny[key] = (isArray) ? [] : {})
                :
                    destiny[key];
            }

            pathRecursive(circular, value, value2, callback, path, hasCallback, hasDestiny );

        }
        else if ( hasDestiny && value !== undefined ) {
            // destiny[key] = (hasCallback && this.hasOwnProperty('returned')) ? this.returned : value; // UNCOMMENT THIS FOR STOP & REASIGN FEATURE
            // delete this.returned; // UNCOMMENT THIS FOR STOP & REASIGN FEATURE
            destiny[key] = value; // COMMENT THIS FOR STOP & REASIGN FEATURE
        }


        if (hasCallback)
            path.pop();
    }

};

dop.util.sprintf = function( ) {

    var s = -1, result, str=arguments[0], array = Array.prototype.slice.call(arguments, 1);
    return str.replace(/"/g, "'").replace( /%([0-9]+)|%s/g , function() {

        result = array[ 
            ( arguments[1] === undefined || arguments[1] === '' ) ? ++s : arguments[1]
        ];

        if (result === undefined)
            result = arguments[0];

        return result;

    });

};
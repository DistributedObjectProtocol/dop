

syncio.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.

    // Is possible send multiple requests in one message, just wrapping it in an Array
    // [[<request_one>, <action>, <params...>], [<request_two>, <action>, <params...>]]

    // If the response have a number greater than -1 as second parameter and is the same value than the request, means the response it's fulfilled
    // [-1234, 2, <params...>]

    // If the response have a second parameter defined as number less than 0 means is an error on any case of 
    // the requests's bellow, The number of the error is negative so to get the corret code_error we must make it positive
    // [-1234, -23]   -> -23 * -1 == code_error

    // Also the error response could be custom if is an string
    // [-1234, 'My custom message error']

    // You can always pass more extra parameters on any requests
    // [ 1234, 2, <user_token>, <extra_params...>]



                        // Client
    connect: 0,         // [ 1234, 0]
                        // [-1234, 0, <user_token>, '~F']


    request: 1,         // [ 1234, 1, [<params...>]]
                        // [-1234, 1, [<params...>]]


    sync: 2,            // Server
                        // [ 1234, 2, <object_id>, <writable 0|1>, <data_object>, <name>]
                        // [-1234, 2, <data_object_merged>]


    unsync: 3,          // [ 1234, 3, <object_id>]
                        // [-1234, 3]


    call: 4,            // [ 1234, 4, [<object_id>, 'path','path'], [<params...>]]
                        // [-1234, 4, [<params...>]]


    set: 5,             // [ 1234, 5, [<object_id>, 'path','path'], 'value']              -> Server ->  If value is not defined then is a delete
                        // [ 1234, 5, [<object_id>, 'path','path'], 'oldvalue', 'value']  -> Client ->  Oldvalue is required only when the client send
                        // [-1234, 5]



};


syncio.protocol_keys = {};
for (var key in syncio.protocol)
    syncio.protocol_keys[ syncio.protocol[key] ] = key;



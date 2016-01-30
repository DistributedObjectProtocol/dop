

synko.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.

    // Is possible send multiple requests in one message, just wrapping it in an Array
    // [[<request_one>, <action>, <params...>], [<request_two>, <action>, <params...>]]

    // If the response has a 0 as second parameter, means the response it's fulfilled. Any other value is an error
    // [-1234, 0, <params...>]

    // Also the error response could be custom an string
    // [-1234, 'My custom message error']

    // Sending the same request without parameters means a cancel/abort of the request
    // [1234]



    fulfilled: 0,


                        // Client
    connect: 0,         // [ 1234, 0]
                        // [-1234, 0, <user_token>, {'~F':'$custom_F','~U':'$custom_U','~R':'$custom_R'}]


    request: 1,         // [ 1234, 1, [<params...>]]
                        // [-1234, 0, [<params...>]]


    sync: 2,            // Server
                        // [ 1234, 2, <object_id>, <writable 0|1>, <data_object>, <name>]
                        // [-1234, 0, <data_object_merged>]


    unsync: 3,          // [ 1234, 3, <object_id>]
                        // [-1234, 0]


    call: 4,            // [ 1234, 4, [<object_id>, 'path','path'], [<params...>]]
                        // [-1234, 0, [<params...>]]


    set: 5,             // [ 1234, 5, [<object_id>, 'path','path'], 'value']              -> Server ->  If value is not defined then is a delete
                        // [ 1234, 5, [<object_id>, 'path','path'], 'oldvalue', 'value']  -> Client ->  Oldvalue is required only when the client send
                        // [-1234, 0]


};


synko.protocol_keys = {};
for (var key in synko.protocol)
    synko.protocol_keys[ synko.protocol[key] ] = key;



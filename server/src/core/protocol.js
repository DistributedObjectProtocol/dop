

dop.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.

    // Is possible send one request with multiple actions. And the response must respect the order sent
    // [<request_id>, [<action>, <params...>], [<action>, <params...>]]

    // Is possible send multiple requests in one message, just wrapping it in an Array. But the order of the responses is not fixed. Which means the response of request_idTwo could be resolved before request_idOne
    // [[<request_id1>, <action>, <params...>], [<request_id2>, <action>, <params...>]]

    // If the response has a 0 as second parameter, means the response it's fulfilled. Any other value is an error
    // [-1234, 0, <params...>]

    // Also the error response could be custom an string
    // [-1234, 'My custom message error']

    // Sending the same request without parameters means a cancel/abort of the request
    // [1234]



    fulfilled: 0,


                        // Server
    connect: 0,         // [ 1234, 0, <user_token>, {'~F':'$custom_F','~U':'$custom_U','~R':'$custom_R'}]
                        // [-1234, 0]


    sync: 1,            // Client
                        // [ 1234, 1, <name>, <data_object_merged>]
                        // [-1234, 0, <object_id>, <changes_int>, <writable 0|1>, <data_object>]

    unsync: 2,          // [ 1234, 2, <object_id>]
                        // [-1234, 0]


    call: 3,            // [ 1234, 3, [<object_id>, 'path','path'], [<params...>]]
                        // [-1234, 0, [<params...>]]


    set: 4,             // [ 1234, 4, [<object_id>, 'path','path'], 'value']
                        // [ 1234, 4, [<object_id>, 'path','path'], 'oldvalue', 'value']  -> Client ->  Oldvalue is required only when the client send
                        // [-1234, 0]


    delete: 5,          // [ 1234, 5, [<object_id>, 'path','path']]
                        // [ 1234, 5, [<object_id>, 'path','path'], 'oldvalue']  -> Client ->  Oldvalue is required only when the client send
                        // [-1234, 0]

    request: 6,         // [ 1234, 6, [<params...>]]
                        // [-1234, 0, [<params...>]]


};


dop.protocol_keys = {};
for (var key in dop.protocol)
    dop.protocol_keys[ dop.protocol[key] ] = key;



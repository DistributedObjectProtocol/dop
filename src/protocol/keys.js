

dop.protocol.keys = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.

    // Is possible send one request with multiple actions. And the response must respect the order sent. The response will be recieved when all the requests are resolved
    // [<request_id>, [<action>, <params...>], [<action>, <params...>]]

    // Is possible send multiple requests in one message, just wrapping it in an Array. But the order of the responses is not fixed. Which means the response of request_idTwo could be resolved before request_idOne
    // [[<request_id1>, <action>, <params...>], [<request_id2>, <action>, <params...>]]

    // If the response has a 0 as second parameter, means the response it's fulfilled. Any other value is an error
    // [-1234, 0, <params...>]

    // Also the error response could be custom an string
    // [-1234, 'My custom message error']

    // Sending the same request without parameters means a cancel/abort of the request
    // [1234]



                        // Server -> Client
    connect: 0,         // [ 1234, 0, <user_token>, {'~F':'$custom_F','~U':'$custom_U','~R':'$custom_R'}]
                        // [-1234, 0]


    request: 1,         // [ 1234, 1, [<params...>]]
                        // [-1234, 0, [<params...>]]


    sync: 2,            // [ 1234, 2, <ref_id>, <name_or_id>, <data_object_merged>]
                        // [-1234, 0, <writable 0|1|2>, <data_object>, <changes_int>]


    unsync: 3,          // [ 1234, 3, <ref_id>]
                        // [-1234, 0]


    call: 4,            // [ 1234, 4, [<ref_id>, 'path','path'], [<params...>]]
                        // [-1234, 0, [<params...>]]


    set: 5,             // [ 1234, 5, [<ref_id>, 'path','path'], 'value']
                        // [ 1234, 5, [<ref_id>, 'path','path'], 'oldvalue', 'value']  -> Client ->  Oldvalue is required only when the client send
                        // [-1234, 0]


    delete: 6,          // [ 1234, 6, [<ref_id>, 'path','path']]
                        // [ 1234, 6, [<ref_id>, 'path','path'], 'oldvalue']  -> Client ->  Oldvalue is required only when the client send
                        // [-1234, 0]



};

for (var key in dop.protocol.keys)
    dop.protocol.keys[ dop.protocol.keys[key] ] = key;
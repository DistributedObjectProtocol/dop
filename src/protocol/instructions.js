
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
    connect: 0,         // [ 1234, 0, <user_token>]
                        // [-1234, 0]

                        // Client -> Server
    reconnect: 1,       // [ 1234, 1, <new_user_token>, <old_user_token>]
                        // [-1234, 0]


    request: 2,         // [ 1234, 2, <params...>]
                        // [-1234, 0, <value>]

                        // Subscriptor -> Owner
    subscribe: 3,       // [ 1234, 3, <params...>]
                        // [-1234, 0, [<object_id>], <data_object>, <last_update_id>]
                        // [-1234, 0, [<object_id>, 'path']]

    unsubscribe: 4,     // [ 1234, 4, <object_id>] // If object_id is negative means is unsubscribing his own object
                        // [-1234, 0]

                        // Subscriptor -> Owner
    call: 5,            // [ 1234, 5, [<object_id>, 'path','path'], [<params...>]]
                        // [-1234, 0, <value>]

                        // Subscriptor -> Owner
    update: 6,          // [ 1234, 6, [<object_id>, 'path', 'path'], <last_update_id>]
                        // [-1234, 0, [<object_id>, 'path', 'path'], <object_data_to_merge>, <last_update_id>]

                        // Owner -> Subscriptor
    set: 7,             // [ 1234, 7, <object_id>, ['path','path'],'value', <last_update_id>]
                        // [-1234, 0]

                        // Owner -> Subscriptor
    delete: 8,          // [ 1234, 8, <object_id>, ['path','path'], <last_update_id>]
                        // [-1234, 0]

                        // Owner -> Subscriptor
    merge: 9,           // [ 1234, 9, <object_id>, <object_data_to_merge>, <last_update_id>]
                        // [-1234, 0]

};

for (var instruction in dop.protocol.instructions)
    dop.protocol.instructions[ dop.protocol.instructions[instruction] ] = instruction;

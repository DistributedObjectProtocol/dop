

syncio.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.

    // Is possible send multiple requests in one message, just wrapping it in an Array
    // [[<request_one>, <action>, <params...>], [<request_two>, <action>, <params...>]]

    // If the response have a number greater than -1 as second parameter means the response it's fulfilled
    // [-1234, 2, <params...>]

    // If the response have a second parameter defined as number less than 0 means is an error on any case of 
    // the action's bellow, The number of the error is negative so to get the corret code_error we must make it positive
    // [-1234, -23]   -> -23 * -1 == code_error

    // Also the error response could be custom if is an string
    // [-1234, 'My custom message error']

    // You can always pass more extra parameters on any action
    // [ 1234, 2, <user_token>, <extra_params...>]





                        // Server
    connect: 1,         // [ 1234, 1, <user_token>]
                        // [-1234, 1, <user_token_old>, [[<object_id>,<last_request>], [<object_id>,<last_request>], ...]]   ->   If the user response with a old token means is trying to resync because it lost the connection
    

    request: 2,         // [ 1234, 2, <params...>]
                        // [-1234, 2, <params...>]


    sync: 3,            // Server
                        // [ 1234, 3, <object_id>, <writable 0|1>, <data_object>]
                        // [-1234, 3]
                        // Client
                        // [ 1234, 3, <name>, <params...>]
                        // [-1234, 3, <object_id>, <writable 0|1>, <data_object>]



    unsync: 4,          // [ 1234, 4, <object_id>]
                        // [-1234, 4]


    get: 5,             // [ 1234, 5, <object_id>, ['path','path'], 'param', 'param', ...]
                        // [-1234, 5, <data_returned>]


    set: 6,             // [ 1234, 6, <object_id>, ['path','path'], 'value']              -> Server ->  If value is not defined then is a delete
                        // [ 1234, 6, <object_id>, ['path','path'], 'oldvalue', 'value']  -> Client ->  Oldvalue is required only for the client
                        // [-1234, 6]



};



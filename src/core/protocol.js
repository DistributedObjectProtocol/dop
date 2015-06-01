
// Server
syncio.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.



    // If the response have a 0 as second parameter means the response it's fulfilled
    // [-1234, 0, <params...>]

    // If the response have a second parameter defined as number less than 0 means is an error on any case of 
    // the action's bellow, The number of the error is negative so to get the corret code_error we must make it positive
    // [-1234, -23]   -> -23 * -1 == code_error

    // Also the error response could be custom if is an string
    // [-1234, 'My custom message error']





    // <action>
    connect: 0,         // [ 1234, 0, <user_token>]    ->    If the response of connect (0) have more than 2 parameters means its trying to reconnect/resync
                        // [-1234, 0, <user_token_old>, [[<object_id>,<last_request>], [<object_id>,<last_request>], ...]]

    sync: 1,


    unsync: 2,


    get: 3,             // [ 1234, 3, <object_id>, ['path','path'], 'param', 'param', ...]
                        // [-1234, 0, <data_returned>]

    set: 4,             // [ 1234, 4, <object_id>, ['path','path'], 'value']    ->   If value is not defined then is a delete
                        // [-1234, 0]

    request: 5,         // [ 1234, 5, <params...>]
                        // [-1234, 0]

};



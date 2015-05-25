

syncio.protocol = {


    // [<request_id>, <action>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.
    // All the requests need and response


    // If the response have a 0 as second parameter means the response it's fulfilled
    // [-1234, 0, <params...>]

    // If the response have a second parameter defined as 1 means is an error on any case of the action's bellow
    // [-1234, 1, <code_error>]




    // <action>
    custom: 0,          // [ 1234, 0, <params...>]
                        // [ -1234, 0]

    sync: 1,            // [ 1234, 1, [<app_name>, <app_name>, ...], <password>]
                        // [-1234, 0, [[<app_id>,<app_data>], [<app_id>,<app_data>], ...]

    reconnect: 2,       // [ 1234, 2, [[<app_id>,<last_request_id_server>], [<app_id>,<last_request_id_server>], ...]]
                        // [ -1234, 0]

    set: 3,             // [ 1234, 3, <app_id>, ['path','path'], 'value']
                        // [ -1234, 0]

    get: 4,             // [ 1234, 4, <app_id>, ['path','path'], param, param]
                        // [-1234, 0, <data_returned>]

    delete: 5,          // [ 1234, 5, <app_id>, ['path','path']]
                        // [ -1234, 0]

};





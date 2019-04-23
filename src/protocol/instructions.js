dop.protocol.instructions = {
    // [<request_id>, <instruction>, <params...>]
    // If <request_id> it's greater than 0 is a request, if is less than 0 then is the response of the request.

    // Is possible send multiple requests in one message, just wrapping it in an Array. But the order of the responses is not determined. Which means the response of request_idTwo could be resolved before request_idOne
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

    // Subscriber -> Owner
    subscribe: 1, // [ <request_id>, <instruction>, <params...>]
    // [-<request_id>, 0, <object_id>, <data_object>]
    // [-<request_id>, 0, <object_id>, ['path']]

    // Subscriber -> Owner
    unsubscribe: 2, // [ <request_id>, <instruction>, <object_id>]
    // [-<request_id>, 0]

    // Subscriber -> Owner
    call: 3, // [ <request_id>, <instruction>, <object_id>, ['path','subpath'], [<params...>]]
    // [-<request_id>, 0, <return>]

    // Owner -> Subscriber
    broadcast: 4, // [ <request_id>, <instruction>, <object_id>, ['path','subpath'], [<params...>]]
    // [-<request_id>, 0, <return>]

    // Owner -> Subscriber
    patch: 5, // [ <request_id>, <instruction>, <object_id>, <version>, <patch>]
    // [-<request_id>, 0]

    1: 'subscribe',
    2: 'unsubscribe',
    3: 'call',
    4: 'broadcast',
    5: 'patch'
}

// for (var instruction in dop.protocol.instructions)
// dop.protocol.instructions[ dop.protocol.instructions[instruction] ] = instruction;

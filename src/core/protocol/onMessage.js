dop.core.onMessage = function(node, message_string) {
    var messages
    // Parsing messages
    if (typeof message_string == 'string' && message_string[0] == '[') {
        // https://jsperf.com/slice-substr-substring-test
        try {
            messages = dop.decode(message_string)
        } catch (e) {
            /*console.log(e);*/
        }
    } else messages = message_string

    // Managing protocol
    if (isArray(messages)) {
        // Detecting if is multimessage
        if (typeof messages[0] == 'number') messages = [messages]

        // Managing all messages one by one
        for (
            var i = 0,
                t = messages.length,
                message,
                requests,
                request,
                request_id,
                response,
                instruction_type,
                message_typeof;
            i < t;
            i++
        ) {
            message = messages[i]
            request_id = message[0]

            // If is a number we manage the request
            if (typeof request_id == 'number' && request_id !== 0) {
                // If is only one request
                message_typeof = dop.util.typeof(message[1])
                requests =
                    (message_typeof == 'number' && message_typeof != 'array') ||
                    request_id < 0
                        ? [request_id, message.slice(1)]
                        : (requests = message)

                for (
                    var j = 1, t2 = requests.length, instruction_function;
                    j < t2;
                    ++j
                ) {
                    request = requests[j]

                    if (
                        dop.util.typeof(request) == 'array' &&
                        ((typeof request[0] == 'number' && request_id > 0) ||
                            request_id < 0)
                    ) {
                        instruction_type = request[0]
                        instruction_function =
                            'on' + dop.protocol.instructions[instruction_type]

                        // REQUEST ===============================================================
                        if (
                            request_id > 0 &&
                            isFunction(dop.protocol[instruction_function])
                        )
                            dop.protocol[instruction_function](
                                node,
                                request_id,
                                request
                            )
                        // RESPONSE ===============================================================
                        else {
                            request_id *= -1

                            if (isObject(node.requests[request_id])) {
                                response = request
                                request = node.requests[request_id]

                                instruction_type = request[1]
                                instruction_function =
                                    '_on' +
                                    dop.protocol.instructions[instruction_type]

                                if (
                                    isFunction(
                                        dop.protocol[instruction_function]
                                    )
                                )
                                    dop.protocol[instruction_function](
                                        node,
                                        request_id,
                                        request,
                                        response
                                    )

                                dop.core.deleteRequest(node, request_id)
                            }
                        }
                    }
                }
            }
        }
    }

    // var messages,
    //     user = (socket[dop.cons.TOKEN] === undefined) ?
    //         socket
    //     :
    //         node.users[ socket[dop.cons.TOKEN] ];

    // // Managing OSP protocol
    // if (dop.util.typeof(messages) == 'array')
    //     dop.core.manage.call(this, user, messages);
}

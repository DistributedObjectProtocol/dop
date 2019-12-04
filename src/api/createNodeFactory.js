export default function createNodeFactory(DJSON) {
    return function createNode() {
        const functions = {}
        const requests = {}
        let function_id = 0
        let request_id = 0

        function registerLocalFunction(function_id, f) {
            console.log('registerLocalFunction', function_id)
            functions[function_id] = f
        }

        function createRemoteFunction(function_id) {
            console.log('createRemoteFunction', function_id)
            return function remoteFunction(...args) {
                const data = [++request_id, function_id, args]
                api.send(DJSON.stringify(data))
                const a = 2 + 2
                return new Promise((resolve, reject) => {
                    console.log(1234)
                    requests[data[0]] = { data, resolve, reject }
                })
            }
        }

        function open(send, f) {
            api.send = send
            registerLocalFunction(function_id, f)
            return createRemoteFunction(function_id++)
        }

        function message(msg) {
            // Parsing messages
            if (typeof msg == 'string' && msg[0] == '[') {
                // https://jsperf.com/slice-substr-substring-test
                try {
                    const [id, function_id, args] = DJSON.parse(msg)
                    if (typeof id == 'number') {
                        if (id > 0) {
                            console.log('request', functions[function_id])
                        } else if (id < 0) {
                            console.log('reject', requests[id])
                        }
                    }
                } catch (e) {}
            }
        }

        function close() {}

        const api = {
            open,
            message,
            close
        }

        return api
    }
}

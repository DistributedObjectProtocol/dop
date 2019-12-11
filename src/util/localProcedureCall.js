export default function localProcedureCall(f, req, args) {
    try {
        const output = f.apply(req, args)
        if (output !== req) {
            output instanceof Promise
                ? output.then(req.resolve).catch(req.reject)
                : req.resolve(output)
        }
    } catch (e) {
        // https://airbrake.io/blog/nodejs-error-handling/nodejs-error-class-hierarchy
        if (
            e instanceof Error ||
            (typeof AssertionError == 'function' &&
                e instanceof AssertionError) ||
            (typeof RangeError == 'function' && e instanceof RangeError) ||
            (typeof ReferenceError == 'function' &&
                e instanceof ReferenceError) ||
            (typeof SyntaxError == 'function' && e instanceof SyntaxError) ||
            (typeof TypeError == 'function' && e instanceof TypeError)
        ) {
            throw e
        }
        req.reject(e)
    }
}

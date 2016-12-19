
dop.encode = (function(data, encoder) {
    var encoderCache
    return function(data, encoder) {
        if (typeof encoder != 'function') {
            if (encoderCache === undefined)
                encoderCache = dop.core.multiEncode(dop.core.encodeSpecial, dop.core.encodeProtocol, dop.core.encodeUtil);
            encoder = encoderCache;
        }
        return JSON.stringify(data, encoder);
    }
})();
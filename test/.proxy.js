var dop = require('../dist/dop.nodejs')

if (process.argv[2] === 'proxy') {
    dop.set = function(o, p, v) {
        var old = o[o]
        try {
            o[p] = v
        } catch (e) {}
        return v
    }
    dop.get = function(o, p) {
        return o[p]
    }
    dop.del = function(o, p) {
        var a = delete o[p]
        return a
    }
    var create = dop.create
    dop.create = function() {
        var d = create()
        d.set = dop.set
        d.get = dop.get
        d.del = dop.del
        return d
    }
}

module.exports = dop

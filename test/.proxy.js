var dop = require('../dist/dop.nodejs')

// // This is not necesary now but we can use to manipulate some methods depending of test arguments
// if (process.argv[2] === 'proxy') {
//     dop.set = function(o, p, v) {
//         var old = o[o]
//         try {
//             o[p] = v
//         } catch (e) {}
//         return v
//     }
//     dop.get = function(o, p) {
//         return o[p]
//     }
//     dop.del = function(o, p) {
//         var a = delete o[p]
//         return a
//     }
//     var create = dop.create
//     dop.create = function() {
//         var d = create()
//         d.set = dop.set
//         d.get = dop.get
//         d.del = dop.del
//         return d
//     }
// }

module.exports = dop

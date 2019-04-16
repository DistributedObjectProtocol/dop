// https://jsperf.com/uuid-vs-pseudohash
dop.util.uuid = function(length) {
    // if (length === undefined) length = 32
    var text = []
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++)
        text.push(possible.charAt(Math.floor(Math.random() * possible.length)))

    return text.join('')
}

// dop.util.uuid = function() {
//     for (var i = 0, uuid = '', random; i < 32; i++) {
//         random = (Math.random() * 16) | 0
//         if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-'
//         uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(
//             16
//         )
//     }

//     return uuid
// }

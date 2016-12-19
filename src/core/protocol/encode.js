
dop.core.encode = function(property, value) {
    return dop.core.encodeProtocol(
        property, dop.core.encodeUtil(
            property, dop.core.encodeSpecial(property, value)));
};

// dop.core.multiEncode = function() {
//     var encoders = arguments,
//         length = encoders.length;
//     return function recursion(property, value, index) {
//         if (index === undefined)
//             index = 0;
//         if (index<length) {
//             value = encoders[index](property, value);
//             return (index<length-1) ? recursion(property, value, index+1) : value;
//         }
//     }
// };

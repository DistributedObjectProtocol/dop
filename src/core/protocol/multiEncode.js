
// dop.core.multiEncode = function() {
//     var encoders = arguments,
//         length = encoders.length, v;
//     return function recursion(property, value, index) {
//         if (index>=length)
//             return value;
//         else if (index === undefined) {
//             v = value;
//             index = 0;
//         }
//         v = encoders[index](property, value);
//         return (v!==value) ? v : recursion(property, value, index+1);
//     }
// };

// dop.util.sprintf = function() {

//     var s = -1, result, str=arguments[0], array = Array.prototype.slice.call(arguments, 1);
//     return str.replace(/"/g, "'").replace(/%([0-9]+)|%s/g , function() {

//         result = array[ 
//             (arguments[1] === undefined || arguments[1] === '') ? ++s : arguments[1]
//         ];

//         if (result === undefined)
//             result = arguments[0];

//         return result;

//     });

// };
// // Usage: sprintf('Code error %s for %s', 25, 'Hi') -> "Code error 25 for Hi"
// // Usage2: sprintf('Code error %1 for %0', 25, 'Hi') -> "Code error Hi for 25"
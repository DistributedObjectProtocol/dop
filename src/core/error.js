
dop.core.error = {

    api: {
        // OBJECT_NAME_REGISTERED: 'You can not repeat the name of the object to subscribe in the method onsubscribe',
        OBJECT_IS_SUBOBJECT: 'The object you are trying to subscribe is a subobject(neested object) of another object'
    },

    warning: {
        TOKEN_REJECTED: 'User disconnected because is rejecting too many times the token assigned'
    },

    reject: {
        OBJECT_NAME_NOT_FOUND: 1,
        1: 'Object "%s" not found to be subscribed',
        OBJECT_ALREADY_SUBSCRIBED: 2,
        2: 'The object "%s" is already subscribed',
    }

};




// function invariant(condition, format, a, b, c, d, e, f) {
//   if ("development" !== 'production') {
//     if (format === undefined) {
//       throw new Error('invariant requires an error message argument');
//     }
//   }

//   if (!condition) {
//     var error;
//     if (format === undefined) {
//       error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
//     } else {
//       var args = [a, b, c, d, e, f];
//       var argIndex = 0;
//       error = new Error(format.replace(/%s/g, function () {
//         return args[argIndex++];
//       }));
//       error.name = 'Invariant Violation';
//     }

//     error.framesToPop = 1; // we don't care about invariant's own frame
//     throw error;
//   }
// }
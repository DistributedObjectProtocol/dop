
// dop.core.invertMutations = function(mutations) {
//     mutations.reverse();
//     for (var index=0,total=mutations.length,mutation; index<total; ++index) {
//         mutation = mutations[index];

//         if (mutation.swaps !== undefined)
//             dop.core.invertSwapMutation(mutation);

//         else if (mutation.splice !== undefined)
//             dop.core.invertSpliceMutation(mutation);

//         else
//             dop.core.invertMutation(mutation);
//     }
// };
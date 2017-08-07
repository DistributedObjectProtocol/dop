
dop.protocol.instructionsPatchs = {
    undefined: '~U', // Delete
    function: '~F', // Remote function
    object: 0, // New object or array
    splice: 1, // Splice array
    swaps: 2, // Swap array

    // Non standards, only for JavaScript
    nan: '~N',
    regex: '~R',
    infinity: '~I',
    _infinity: '~i'
};




// a={
//     a: [0],
//     b: undefined,
//     c: "[0]",
//     newarr: {a:[0],b:undefined,c:"[0]",d:[4,[0],{}]},
// }

// // --------

// b={
//     a: [2,[0]],
//     b: [0],
//     c: "[0]",
//     newarr: [2,{a:[2,[0]],b:[0],c:"[0]",d:[2,[4,[2,[0]],[2,{}]]] }],
// }

// c={
//     a: [2,[0]],
//     b: [0],
//     c: "[0]",
//     newarr: [2,{a:"[0]",b:[0],c:"[[0]",d:[4,[0],{}]}],
// }


// c={
//     a: [2,[0]],
//     b: "~U",
//     c: "[0]",
//     newarr: [2,{a:[0],b:"~U",c:"[0]",d:[4,[0],{}]}],
// }

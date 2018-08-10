dop.protocol.instructionsPatchs = {
    delete: 0, // Delete
    object: 1, // New object or array
    splice: 2, // Splice array
    swaps: 3, // Swap array
    function: '~F', // Remote function

    // No standard, only for JavaScript
    undefined: '~U',
    nan: '~N',
    regex: '~R',
    infinity: '~I',
    _infinity: '~i'
}

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

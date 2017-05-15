
dop.protocol.instructionsPatchs = {

    undefined: { // delete
        value: 0,
        isForNodes: true
    },

    function: { // remote function
        value: 1,
        isForNodes: true
    },

    object: { // new object or array
        value: 2,
        isForNodes: false
    },

    splice: {
        value: 3,
        isForNodes: false
    },

    swaps: {
        value: 4,
        isForNodes: false
    },

};
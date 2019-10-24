const R = require('ramda')

const object = {
    string: 'string',
    boolean: true,
    number: -123,
    Infinity: -Infinity,
    float: 1.234153454354341,
    long: 12313214234312324353454534534,
    null: null,
    undefined: undefined,
    NaN: NaN,
    symbol: Symbol('sym'),
    date: new Date(),
    regexp: /molamazo/g,
    function: function() {
        console.log(arguments)
    },
    f: () => {},
    b: 3,
    c: 5,
    obj: { lolo: 111 },
    arr: [1, 2, 3, { La: 123 }],
    array: [567],
    arrobj: { 0: 1, 1: 2 },
    d: {
        a: 11,
        b: 12,
        array: [1, 2, 3, { abc: 123 }],
        d: {
            d1: 13,
            d2: {
                d21: 123,
                d22: {
                    d221: 12,
                    d223: {
                        hola: 'hola',
                        undefined: 'undefined'
                    }
                }
            }
        },
        arrobj: ['a', 'b', 'c', 'd'],
        f: 5,
        g: 123,
        d2: {
            d22: {
                d222: 25,
                d223: {
                    hola: 'mundo'
                    //   undefined: undefined // lodash ignores undefined values
                }
            }
        }
    }
}

const destiny = {}
const r = R.mergeRight(destiny, object)
console.log(r === destiny, r === object)

export function is(value) {
    if (value === null) return 'null'
    if (isArray(value)) return 'array'
    return typeof value
}

export function isArray(array) {
    return Array.isArray(array)
}

export function isObject(object) {
    return object !== null && typeof object == 'object'
}

export function isPojo(object) {
    if (!isObject(object)) return false
    const prototype = Object.getPrototypeOf(object)
    return prototype === Object.prototype || prototype === Array.prototype
}

export function isPojoObject(object) {
    if (!isObject(object)) return false
    const prototype = Object.getPrototypeOf(object)
    return prototype === Object.prototype
}

// function Test() {}
// console.log(isPojo({}))
// console.log(isPojo([]))
// console.log(isPojo(new Test()))
// console.log(isPojo(new Error()))
// console.log(isPojo(new Date()))
// console.log(isPojo(null))
// console.log(isPojo(Symbol('')))
// console.log(isPojo(function() {}))
// console.log(isPojo(1))
// console.log(isPojo('s'))
// console.log(isPojo(true))
// console.log(isPojo(/a/))
